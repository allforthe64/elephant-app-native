import { Audio } from 'expo-av'
import React, { useState } from 'react'
import { Text, View , TouchableOpacity, ScrollView, StyleSheet, Image} from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMicrophone, faSquare, faXmark } from '@fortawesome/free-solid-svg-icons'
import AudioEditor from '../../components/audioEditor'
import { updateStaging, addfile } from '../../storage'
import { firebaseAuth } from '../../firebaseConfig'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { storage } from '../../firebaseConfig'
import {ref, uploadBytes} from 'firebase/storage'

const AudioRecorder = () => {

    try {
        const [recording, setRecording] = useState()
    const [recordings, setRecordings] = useState([])
    const [success, setSuccess] = useState(false)

    const currentUser = firebaseAuth.currentUser.uid

    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync()

            if (permission.status === 'granted') {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true
                })

                const {recording} = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                )
    
                setRecording(recording)
            } else {
               setMessage('Please grant permission to Elephant App to access microphone') 
            }

            
        } catch (err) {
            console.error('Failed to start recording', err)
        }
    }

    const stopRecording = async () => {
        setRecording(undefined)
        await recording.stopAndUnloadAsync()

        const updatedRecordings = [...recordings]
        const {sound, status} = await recording.createNewLoadedSoundAsync()
        
        updatedRecordings.push({
            sound: sound,
            duration: getDurartionFormatted(status.durationMillis),
            file: recording.getURI(),
            name: `Recording ${recordings.length + 1}`
        })

        setRecordings(updatedRecordings)
    }

    const getDurartionFormatted = (millis) => {
        const minutes = millis / 1000 / 60
        const minutesDisplay = Math.floor(minutes)
        const seconds = Math.round((minutes - minutesDisplay) * 60)
        const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds
        return `${minutesDisplay}:${secondsDisplay}`
    }

    const getRecordingLines = () => {
        return recordings.map((recordingLine, index) => {
            return (
            <AudioEditor editRecordings={setRecordings} recordingLine={recordingLine} index={index} key={index} recordings={recordings} deleteFunc={filterRecordings} />
        ) 
            
        })
    }

    const filterRecordings = (input, target) => {

        const arr = []

        input.map(el => {
            if (JSON.stringify(el) !== JSON.stringify(target)) arr.push(el)
        })

        setRecordings(arr)
    }

    console.log(recordings)

    const saveFiles = async () => {

        const references = await Promise.all(recordings.map(async (el) => {
            const filename = `${el.name}^${currentUser}.${el.file.split('.')[1]}`

            try {
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest()
                    xhr.onload = () => {
                        resolve(xhr.response) 
                    }
                    xhr.onerror = (e) => {
                        reject(e)
                        reject(new TypeError('Network request failed'))
                    }
                    xhr.responseType = 'blob'
                    xhr.open('GET', el.file, true)
                    xhr.send(null)
                })
    
                const fileRef = ref(storage, filename)
                uploadBytes(fileRef, blob)
    
            } catch (err) {
                console.log(err)
            }

            const reference = await addfile({
                name: filename,
                fileType: el.file.split('.')[1],
                size: el.duration,
                uri: el.file
            })
            return reference

        }))

        console.log('references: ', references)

        updateStaging(references, currentUser)
        const empty = []
        setRecordings(empty)
        setSuccess(true)
          
    }

    const insets = useSafeAreaInsets()

  return (
    <View style={{
        backgroundColor: 'rgb(23,23,23)',
        height: '100%'}}>
        <Image style={styles.bgImg } source={require('../../assets/elephant-dashboard.jpg')} />
        <View style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            paddingBottom: '10%',
            paddingTop: insets.top,
            paddingBottom: insets.bottom}}>
            {success && 
                    <View style={styles.successContainer}>
                        <View style={styles.innerSuccessContainer}>
                            <Text style={{color: 'green'}}>Upload Successful!</Text>
                            <TouchableOpacity onPress={() => setSuccess(false)}>
                                <FontAwesomeIcon icon={faXmark} size={20} color={'black'} />
                            </TouchableOpacity>
                        </View>
                    </View>
            }
            <Text style={styles.bigHeader}>Audio Recordings:</Text>
            {recordings.length === 0 ? 
                <View style={styles.noRecCon}>
                    <Text style={styles.bigHeader}>No Recordings Yet</Text>
                </View>
            :
                <View style={styles.scrollCon}>
                    <ScrollView>
                        {getRecordingLines()}
                    </ScrollView>
                </View>
            }
            <View style={styles.wrapperContainer}>
                <View style={recording ? styles.buttonWrapperIcon : styles.buttonWrapperRed}>
                    <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
                    {recording ? <FontAwesomeIcon icon={faSquare} size={46} style={{color: 'red', marginLeft: '13%'}}/> : <FontAwesomeIcon icon={faMicrophone} size={50} style={{marginLeft: '12%'}}/>}
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.wrapperContainer}>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => saveFiles()}>
                    <Text style={styles.input}>Save All</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </View>
  )

    } catch (err) {
        alert(err)
    }
}

const styles = StyleSheet.create({
    bigHeader: {
        color: 'white',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: '700',
        marginBottom: '5%'
      },
    scrollCon: {
        height: '60%',
        width: '95%',
        borderBottomWidth: 1,
        borderColor: 'white',
        marginBottom: '5%',
    },
    noRecCon: {
        height: '60%',
        width: '95%',
        borderBottomWidth: 1,
        borderColor: 'white',
        marginBottom: '5%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bgImg: {
        objectFit: 'scale-down',
        opacity: .15,
        transform: [{scaleX: -1}]
    },
    wrapperContainer: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginBottom: '8%'
    },
    buttonWrapper: {
        width: '60%',
        borderColor: '#777',
        borderRadius: 25,
        backgroundColor: 'white',
        borderWidth: 1,
        paddingTop: '2%',
        paddingBottom: '2%',
    },
    buttonWrapperIcon: {
        width: '18%',
        borderRadius: 25,
        borderColor: 'white',
        borderWidth: 3,
        paddingTop: '2%',
        paddingBottom: '2%',
        borderRadius: 1000,
    },
    buttonWrapperRed: {
        width: '18%',
        borderRadius: 1000,
        backgroundColor: 'red',
        borderWidth: 1,
        paddingTop: '2%',
        paddingBottom: '2%',
    },
    input: {
    textAlign: 'center',
    fontSize: 15,
    width: '100%',
    },
    successContainer: {
        position: 'absolute',
        top: 0,
        backgroundColor: 'white',
        width: '100%',
        height: '5%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    innerSuccessContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '50%',
    },
})

export default AudioRecorder
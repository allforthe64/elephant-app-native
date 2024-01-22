import { Audio } from 'expo-av'
import React, { useState, useEffect } from 'react'
import { Text, View , TouchableOpacity, ScrollView, StyleSheet, Image} from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMicrophone, faSquare, faXmark } from '@fortawesome/free-solid-svg-icons'
import AudioEditor from '../../components/audioEditor'
import { updateUser, addfile } from '../../storage'
import { firebaseAuth } from '../../firebaseConfig'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { storage } from '../../firebaseConfig'
import {ref, uploadBytes} from 'firebase/storage'
import { userListener } from '../../storage'
import { format } from 'date-fns'
import { useToast } from 'react-native-toast-notifications'

const AudioRecorder = () => {

    try {
        const [recording, setRecording] = useState()
        const [recordings, setRecordings] = useState([])
        const [userInst, setUserInst] = useState()
        const [loading, setLoading] = useState(false)

        const currentUser = firebaseAuth.currentUser.uid
        const toast = useToast()

        //get the current user 
        useEffect(() => {
            if (firebaseAuth) {
            try {
                const getCurrentUser = async () => {
                const unsubscribe = await userListener(setUserInst, false, currentUser)
            
                return () => unsubscribe()
                }
                getCurrentUser()
            } catch (err) {console.log(err)}
            } else console.log('no user yet')
            
        }, [firebaseAuth])


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

    const saveFiles = async () => {

        setLoading(true)
        let uploadSize = 0

        const references = await Promise.all(recordings.map(async (el) => {

            //check if a file already exists with this file's name. If it does, increase version number
            let versionNo = 0
            userInst.fileRefs.forEach(fileRef => {
                if (fileRef.fileName === (el.name + '.' + el.file.split('.')[1]) && fileRef.fileName.split('.')[1] === el.file.split('.')[1]) {
                    versionNo ++
                }
            })

            //generate formatted date
            const formattedDate = format(new Date(), `yyyy-MM-dd:hh:mm:ss::${Date.now()}`)

            //upload the file
            const blob = await new Promise(async (resolve, reject) => {
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

            const filename = `${currentUser}/${formattedDate}`
            const fileRef = ref(storage, filename)
            const result = await uploadBytes(fileRef, blob)
    
            //create file reference
            const reference = await addfile({
                name: el.name + '.' + el.file.split('.')[1],
                fileType: el.file.split('.')[1],
                size: result.metadata.size,
                uri: el.file,
                user: currentUser, 
                timeStamp: formattedDate, 
                version: versionNo
            })

            //increase upload size
            uploadSize += result.metadata.size

            return reference

        }))

        //increase the ammount of space the user is consuming and add the references to the user's staging
        const newSpaceUsed = userInst.spaceUsed + uploadSize
        const newUser = {...userInst, spaceUsed: newSpaceUsed, fileRefs: [...userInst.fileRefs, ...references]}
        await updateUser(newUser)

        const empty = []
        setRecordings(empty)
        setLoading(false)
        toast.show('File upload successful', {
            type: 'success'
        })
          
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
            <Text style={styles.bigHeader}>Audio Recordings:</Text>

            {loading ? 
                <View style={styles.noRecCon}>
                    <Text style={styles.bigHeader}>Uploading Recordings...</Text>
                </View>
            :
                <>
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
                </>
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
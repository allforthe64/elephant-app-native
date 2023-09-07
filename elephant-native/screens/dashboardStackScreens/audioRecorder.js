import { Audio } from 'expo-av'
import React, { useState } from 'react'
import { Text, View , Button, StyleSheet} from 'react-native'

const AudioRecorder = () => {

    const [recording, setRecording] = useState()
    const [recordings, setRecordings] = useState([])
    const [message, setMessage] = useState()

    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync()

            if (permission.status === 'granted') {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true
                })

                const {recording} = await Audio.Recording.createAsync(
                    Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
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
            file: recording.getURI()
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
        console.log(recordings)
        return recordings.map((recordingLine, index) => {return (
            <View key={index} style={styles.row}>
                <Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration}</Text>
                <Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title='Play'/>
                <Button style={styles.button + 'color:red'} onPress={(recordingLine) => filterRecordings(recordings, recordingLine)} title='Delete'/>
            </View>
        ) 
            
        })
    }

    const filterRecordings = (input, target) => {

        if (input.length === 1) {
            setRecordings([])
        } else {
            for (let i = 0; i < input.length; i++) {
                    
                if (input.indexOf(target.file) !== -1) {
                    input.splice(i, 1);
                    console.log(input)
                    i--;
                }
            }
        }
        
        setRecordings(input)
    }

  return (
    <View style={styles.container}>
        <Text>{message}</Text>
        <Button title={recording ? 'Stop Recording': 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
        />
        {getRecordingLines()}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    fill: {
        flex: 1,
        margin: 16
    },
    button: {
        margin: 16
    }
})

export default AudioRecorder
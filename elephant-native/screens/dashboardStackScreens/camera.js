import React, {useEffect, useRef, useState} from 'react'
import { View, Text, StatusBar, StyleSheet, Button, Image } from 'react-native'
import { Camera } from 'expo-camera'
import { shareAsync } from 'expo-sharing'
import * as MediaLibrary from 'expo-media-library'
import { SafeAreaView } from 'react-native-safe-area-context'

const CameraComponent = () => {

    const cameraRef = useRef()
    const [hasCameraPermission, setHasCameraPermission] = useState()
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState()
    const [photo, setPhoto] = useState()

    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync()
            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync()
            setHasCameraPermission(cameraPermission.status === "granted")
            setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted")
        })()
    }, [])

    if (hasCameraPermission === undefined) {
        return <Text>Requesting permissions...</Text>
    } else if (!hasCameraPermission) {
        return <Text>Permission for camera not granted. Please change this in settings.</Text>
    }

    const takePic = async () => {
        const options = {
            quality: 1,
            base64: true,
            exif: false
        }

        const newPhoto = await cameraRef.current.takePictureAsync(options)
        setPhoto(newPhoto)
    }

    if (photo) {
        const sharePic = () => {
            shareAsync(photo.uri).then(() => {
                setPhoto(undefined)
            })
        }

        const savePhoto = () => {
            MediaLibrary.saveToLibraryAsync(photo.uri).then((() => {
                setPhoto(undefined)
            }))
        }

        const saveToElephant = () => {
            setPhoto(undefined)
        }

        return (
            <SafeAreaView style={styles.container}>
                <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64}}/>
                <Button title='Share' onPress={sharePic} />
                { hasMediaLibraryPermission ? <Button title='Save to photos' onPress={savePhoto} /> : undefined} 
                <Button title='Discard' onPress={() => setPhoto(undefined)} />
                <Button title='Save to elephant storage' onPress={saveToElephant} />
            </SafeAreaView>
        )
    }

  return (
    <Camera style={styles.container} ref={cameraRef}>
        <View style={styles.buttonContainer}>
            <Button title='Take Pic' onPress={takePic}/>
        </View>
       <StatusBar style="auto" /> 
    </Camera>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    buttonContainer: {
        backgroundColor: 'white',
        marginBottom: '20%'
    },
    preview: {
        alignSelf: 'stretch',
        flex: 1
    }
})

export default CameraComponent
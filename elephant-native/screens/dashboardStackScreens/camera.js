import React, {useEffect, useRef, useState} from 'react'
import { View, Text, StatusBar, StyleSheet, Button, Image, TouchableOpacity } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { Camera } from 'expo-camera'
import { shareAsync } from 'expo-sharing'
import * as MediaLibrary from 'expo-media-library'
import { SafeAreaView } from 'react-native-safe-area-context'
import { firebase } from '../../firebaseConfig'
import { format } from 'date-fns'
import { addfile, updateStaging } from '../../storage'
import { firebaseAuth } from '../../firebaseConfig'

const CameraComponent = () => {

    const cameraRef = useRef()
    const [hasCameraPermission, setHasCameraPermission] = useState()
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState()
    const [photo, setPhoto] = useState()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const currentUser = firebaseAuth.currentUser.uid

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

        const saveToElephant = async () => {

            setLoading(true)

            //create new formatted date for file
            const formattedDate = format(new Date(), "yyyy-MM-dd:hh:mm:ss")

              try {
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest()
                    xhr.onload = () => {
                       resolve(xhr.response) 
                    }
                    xhr.onerror = (e) => {
                        reject(new TypeError('Network request failed'))
                    }
                    xhr.responseType = 'blob'
                    xhr.open('GET', photo.uri, true)
                    xhr.send(null)
                })


                const filename = `${formattedDate}.jpg`
                const ref = firebase.storage().ref().child(filename)

                await ref.put(blob)

                console.log('reference: ', photo)

                const reference = await addfile({
                        name: formattedDate,
                        fileType: 'jpg',
                        size: photo.width * photo.height,
                        uri: photo.uri
                    })
                updateStaging([reference], currentUser)

                setSuccess(true)

              } catch (err) {
                console.log(err)
              }
            
            setPhoto(undefined)
            setLoading(false)
        }

        return (
            loading ? (
                    <View style={styles.containerCenter}>
                        <Text style={{color: 'black'}}>Uploading Image...</Text>
                    </View>
                )
                : (
                    <SafeAreaView style={styles.container}>
                        <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64}}/>
                        <Button title='Share' onPress={sharePic} />
                        { hasMediaLibraryPermission ? <Button title='Save to photos' onPress={savePhoto} /> : undefined} 
                        <Button title='Discard' onPress={() => setPhoto(undefined)} />
                        <Button title='Save to elephant storage' onPress={saveToElephant} />
                    </SafeAreaView>
                )
        )
    }

  return (
    <Camera style={styles.container} ref={cameraRef}>
        {success && 
            <View style={styles.successContainer}>
                <View style={styles.innerContainer}>
                    <Text style={{color: 'green'}}>Upload Successful!</Text>
                    <TouchableOpacity onPress={() => setSuccess(false)}>
                        <FontAwesomeIcon icon={faXmark} size={20} color={'black'} />
                    </TouchableOpacity>
                </View>
            </View>
        }
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
    containerCenter: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
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
    innerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '50%',
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
import React, {useEffect, useRef, useState} from 'react'
import { View, Text, StatusBar, StyleSheet, Button, Image, TouchableOpacity, Pressable } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faXmark, faRepeat } from '@fortawesome/free-solid-svg-icons'
import { Camera } from 'expo-camera'
import { shareAsync } from 'expo-sharing'
import * as MediaLibrary from 'expo-media-library'
import { firebase } from '../../firebaseConfig'
import { format } from 'date-fns'
import { addfile, updateStaging } from '../../storage'
import { firebaseAuth } from '../../firebaseConfig'

const CameraComponent = () => {
    try {
        const cameraRef = useRef()
        const [hasCameraPermission, setHasCameraPermission] = useState()
        const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState()
        const [photo, setPhoto] = useState()
        const [success, setSuccess] = useState(false)
        const [session, setSession] = useState(false)

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

        const saveToElephant = async () => {

            setPhoto(undefined)

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

                const reference = await addfile({
                        name: formattedDate + '.jpg',
                        fileType: 'jpg',
                        size: photo.width * photo.height,
                        uri: photo.uri
                    })
                updateStaging([reference], currentUser)

                setSuccess(true)

            } catch (err) {
                console.log(err)
            }
        }

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

        if (photo) {
        if (session === true) {
            console.log('in here')
            saveToElephant()
        } else {
            return (
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingBottom: '10%'
                }}>
                    <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64}}/>
                    <Button title='Share' onPress={sharePic} />
                    { hasMediaLibraryPermission ? <Button title='Save to photos' onPress={savePhoto} /> : undefined} 
                    <Button title='Save to elephant storage' onPress={saveToElephant} />
                    <Button title='Discard' onPress={() => setPhoto(undefined)} />
                </View>
                )
        }
        }

        console.log(currentUser)

        return (
            <Camera style={styles.containerCenter} ref={cameraRef}>
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
                <View style={session ? {position: 'absolute', top: 30, right: 20, backgroundColor: 'white', width: '12%', height: '7%', borderRadius: 100, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'} : {position: 'absolute', top: 30, right: 20, width: '12%', height: '7%', borderRadius: 100, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} onPress={() => setSession(prev => !prev)}>
                    <TouchableOpacity onPress={() => setSession(prev => !prev)}>
                        <FontAwesomeIcon icon={faRepeat} color={session ? 'black' : 'white'} size={30} />
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <Button title='Take Pic' onPress={takePic}/>
                </View>
            <StatusBar style="auto" /> 
            </Camera>
        )
    } catch (err) {
        alert(err)
    }    
}

const styles = StyleSheet.create({
    containerCenter: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end'
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
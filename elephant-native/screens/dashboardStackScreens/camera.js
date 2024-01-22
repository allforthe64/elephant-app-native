import React, {useEffect, useRef, useState, useContext} from 'react'
import { View, Text, StatusBar, StyleSheet, Animated, Image, TouchableOpacity, Platform } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCloudArrowUp, faEnvelope, faDownload, faTrash, faRepeat, faVideoCamera, faCamera, faSquare } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import { Camera, CameraType, VideoCodec } from 'expo-camera'
import { Video, Audio } from 'expo-av'
import { shareAsync } from 'expo-sharing'
import * as MediaLibrary from 'expo-media-library'
import { format } from 'date-fns'
import { addfile, updateUser, userListener, updateStaging} from '../../storage'
import { firebaseAuth } from '../../firebaseConfig'
import { storage } from '../../firebaseConfig'
import {ref, uploadBytes} from 'firebase/storage'
import { faCircle as solidCircle } from '@fortawesome/free-solid-svg-icons'
import { PinchGestureHandler } from 'react-native-gesture-handler'
import { useToast } from 'react-native-toast-notifications'

const CameraComponent = () => {

    try {
        const cameraRef = useRef()
        const [hasCameraPermission, setHasCameraPermission] = useState()
        const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState()
        const [hasAudioRecordingPermission, setHasAudioRecordingPermission] = useState()
        const [photo, setPhoto] = useState()
        const [session, setSession] = useState(true)
        const [userInst, setUserInst] = useState()
        const [loading, setLoading] = useState(true)
        const [type, setType] = useState(CameraType.back)
        const [video, setVideo] = useState(false)
        const [recording, setRecording] = useState(false)
        const [videoObj, setVideoObj] = useState()
        const [zoom, setZoom] = useState(0)

        const currentUser = firebaseAuth.currentUser.uid

        const toast = useToast()

        //initialize animation ref
        let fadeAnim = useRef(new Animated.Value(100)).current

        //get the current user 
        useEffect(() => {
            if (currentUser) {
            try {
                const getCurrentUser = async () => {
                const unsubscribe = await userListener(setUserInst, false, currentUser)
            
                return () => unsubscribe()
                }
                getCurrentUser()
            } catch (err) {console.log(err)}
            } else console.log('no user yet')
            
        }, [currentUser])

        //get camera permissions
        useEffect(() => {
            (async () => {
                const cameraPermission = await Camera.requestCameraPermissionsAsync()
                const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync()
                const {status} = await Audio.requestPermissionsAsync() 
                setHasCameraPermission(cameraPermission.status === "granted")
                setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted")
                setHasAudioRecordingPermission(status === "granted")
            })()
        }, [])

        useEffect(() => {
            //Will change fadeAnim value to 0 in 3 seconds
            Animated.timing(fadeAnim, {
                toValue: 100,
                duration: 0,
                useNativeDriver: true
            }).start()
        }, [photo])

        //render content based on permissions
        if (hasCameraPermission === undefined || hasMediaLibraryPermission === undefined || hasAudioRecordingPermission === undefined) {
            return <Text>Requesting permissions...</Text>
        } else if (!hasCameraPermission) {
            return <Text>Permission for camera not granted. Please change this in settings.</Text>
        }

        //take photo using takePictureAsync method
        const takePic = async () => {
            try {
                const options = {
                    quality: 1,
                    base64: true,
                    exif: false
                }
    
                const newPhoto = await cameraRef.current.takePictureAsync(options)
                setPhoto(newPhoto)
            } catch (err) {
                alert(err)
            }
        }

        //take a video using takeAsyncVideo method
        const takeVideo = async () => {
            try {
                setRecording(true)
                const options = {
                    quality: 1,
                    mute: false,
                    codec: VideoCodec.H264
                }
                const recordedVideo = await cameraRef.current.recordAsync(options)
                setVideoObj(recordedVideo)
            } catch (error) { alert('error within recording function: ', error) }
        }

        //stop recording video
        const stopVideo = () => {
            cameraRef.current.stopRecording()
            setRecording(false)
        }

        const saveToElephant = async (videoMode) => {

            //save video
            if (videoMode) {
                console.log('running video upload')
                setVideoObj(undefined)

                //create new formatted date for file
                const formattedDate = format(new Date(), "yyyy-MM-dd:hh:mm:ss")

                try {  
                    //create blob using the photo from state and save it to elephant staging
                    const blob = await new Promise(async (resolve, reject) => {
                        const xhr = new XMLHttpRequest()
                        xhr.onload = () => {
                        resolve(xhr.response) 
                        }
                        xhr.onerror = (e) => {
                            reject(new TypeError('Network request failed'))
                        }
                        xhr.responseType = 'blob'
                        xhr.open('GET', videoObj.uri, true)
                        xhr.send(null)
                    })

                    const filename = `${formattedDate}.${Platform.OS === 'ios' ? 'mov' : 'mp4'}`
                    const fileRef = ref(storage, `${currentUser}/${filename}`)
                    const result = await uploadBytes(fileRef, blob)

                    //generate reference
                    const reference = await addfile({
                            name: filename,
                            fileType: `${Platform.OS === 'ios' ? 'mov' : 'mp4'}`,
                            size: result.metadata.size,
                            uri: videoObj.uri,
                            user: currentUser,
                            version: 0,
                            timeStamp: `${formattedDate}.${Platform.OS === 'ios' ? 'mov' : 'mp4'}`
                        })
                    
                    //increase the ammount of space the user is consuming based off the size of the video
                    const newSpaceUsed = userInst.spaceUsed + result.metadata.size
                    const newUser = {...userInst, spaceUsed: newSpaceUsed, fileRefs: [...userInst.fileRefs, reference]}
                    await updateUser(newUser)

                    toast.show('Upload successful', {
                        type: 'success'
                    })

                } catch (err) {
                    alert(err)
                }
            } else {
                setPhoto(undefined)

                //create new formatted date for file
                const formattedDate = format(new Date(), `yyyy-MM-dd:hh:mm:ss::${Date.now()}`)

                try {  
                    //create blob using the photo from state and save it to elephant staging
                    const blob = await new Promise(async (resolve, reject) => {
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
                    const fileRef = ref(storage, `${currentUser}/${filename}`)
                    const result = await uploadBytes(fileRef, blob) 

                    const reference = await addfile({
                            name: filename,
                            fileType: 'jpg',
                            size: result.metadata.size,
                            uri: photo.uri,
                            user: currentUser,
                            version: 0,
                            timeStamp: `${formattedDate}.jpg`
                        })
                    
                    
                    //increase the ammount of space the user is consuming based off the size of the video
                    updateStaging([reference], currentUser)

                    toast.show('Upload successful', {
                        type: 'success'
                    })

                } catch (err) {
                    console.log(err)
                }
            }
        }

        //allow photo to be shared using shareAsync method
        const sharePic = () => {
            shareAsync(photo.uri).then(() => {
                setPhoto(undefined)
            })
        }

        //allow photo to be shared using shareAsync method
        const shareVideo = () => {
            shareAsync(videoObj.uri).then(() => {
                setVideoObj(undefined)
            })
        }

        //save photo to the phone's local storage using saveToLibraryAsync method
        const savePhoto = () => {
            MediaLibrary.saveToLibraryAsync(photo.uri).then((() => {
                setPhoto(undefined)
            }))
        }

        //save photo to the phone's local storage using saveToLibraryAsync method
        const saveVideo = () => {
            MediaLibrary.saveToLibraryAsync(videoObj.uri).then((() => {
                setVideoObj(undefined)
            }))
        }

        //if session mode is turned on after picture is taken, immediately save the photo to elephant storage
        if (photo) {
            if (session === true) {
                saveToElephant(false)
            }
            
        }

        //if session mode is turned on after video is taken, immediately save the photo to elephant storage
        if (videoObj) {
            if (session === true) {
                saveToElephant(true)
            }
        }

        const fadeOut = () => {
            //Will change fadeAnim value to 0 in 3 seconds
            Animated.timing(fadeAnim, {
                delay: 100,
                toValue: 0,
                duration: 2500,
                useNativeDriver: true
            }).start()
        }

        //toggle between front and back camera
        const toggleType = () => {
            if (!recording) setType(prev => prev === CameraType.back ? CameraType.front : CameraType.back)
        }

        //if velocity of pinch event is positive increase zoom, if it is negative decrease zoom
        const onPinchEvent = (event) => {

            if (event.nativeEvent.velocity > 0) {
                setZoom(prev => {
                    if (type === CameraType.back) {
                        let newZoom = prev += .01
                        if (newZoom > 1) newZoom = 1
                        return newZoom
                    } else {
                        let newZoom = prev += .001
                        if (newZoom > 1) newZoom = 1
                        return newZoom
                    }
                })
            } else setZoom(prev => {
                if (type === CameraType.back) {
                    let newZoom = prev -= .01
                    if (newZoom < 0) newZoom = 0
                    return newZoom
                } else {
                    let newZoom = prev -= .001
                    if (newZoom < 0) newZoom = 0
                    return newZoom
                }
            })
        }

        return (
            <>
                {photo ? 
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64}}/>
                        <View style={{position: 'absolute', top: '8%', right: '2.5%'}} >
                            {/* <Button title='Share' onPress={sharePic} />
                            { hasMediaLibraryPermission ? <Button title='Save to photos' onPress={savePhoto} /> : undefined} 
                            <Button title='Save to elephant storage' onPress={saveToElephant} />
                            <Button title='Discard' onPress={() => setPhoto(undefined)} /> */}
                            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: '2%'}}>
                                <Animated.View style={{display: 'flex', flexDirection: 'coloumn', marginRight: 10, paddingTop: 20, opacity: fadeAnim}} onLayout={() => fadeOut()}>
                                    <View style={{backgroundColor: 'rgba(0, 0, 0, .5)',  marginBottom: 25, paddingTop: 2, paddingBottom: 2, borderRadius: 17}}>
                                        <Text style={{fontSize: 18, textAlign: 'center', color: 'white'}}>Share</Text>
                                    </View>
                                    <View style={{backgroundColor: 'rgba(0, 0, 0, .5)',  marginBottom: 25, paddingTop: 2, paddingBottom: 2, borderRadius: 17}}>
                                    {hasMediaLibraryPermission ? <Text style={{fontSize: 18, paddingLeft: 10, paddingRight: 10, color: 'white'}}>Save To Photos</Text> : undefined}
                                    </View>
                                    <View style={{backgroundColor: 'rgba(0, 0, 0, .5)',  marginBottom: 25, paddingTop: 2, paddingBottom: 2, borderRadius: 17}}>
                                        <Text style={{fontSize: 18, textAlign: 'center', color: 'white'}}>Add To Staging</Text>
                                    </View>
                                    <View style={{backgroundColor: 'rgba(0, 0, 0, .5)', paddingTop: 2, paddingBottom: 2, borderRadius: 17}}>
                                        <Text style={{fontSize: 18, textAlign: 'center', color: 'white'}}>Delete</Text>
                                    </View>
                                    
                                </Animated.View>
                                <View style={{display: 'flex', flexDirection: 'coloumn', backgroundColor: 'rgba(0, 0, 0, .5)', paddingTop: 15, paddingBottom: 15, paddingLeft: 10, paddingRight: 10, borderRadius: 25}}>
                                    <TouchableOpacity style={{marginBottom: 15}} onPress={sharePic}>
                                        <FontAwesomeIcon icon={faEnvelope} size={30} color='white'/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{marginBottom: 25}} onPress={savePhoto}>
                                        <FontAwesomeIcon icon={faDownload} size={30} color='white'/>
                                    </TouchableOpacity> 
                                    <TouchableOpacity style={{marginBottom: 20}} onPress={() => saveToElephant(false)}>
                                        <FontAwesomeIcon icon={faCloudArrowUp} size={30} color='white'/>
                                    </TouchableOpacity> 
                                    <TouchableOpacity onPress={() => setPhoto(undefined)}>
                                        <FontAwesomeIcon icon={faTrash} size={30} color='white'/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
            : videoObj ? 
                <>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}>
                        <Video style={{flex: 1, alignSelf: 'stretch', height: '100%'}} source={{uri: videoObj.uri}} useNativeControls resizeMode='contain' isLooping/>
                        <View style={{position: 'absolute', top: '8%', right: '2.5%'}} >
                            {/* <Button title='Share' onPress={sharePic} />
                            { hasMediaLibraryPermission ? <Button title='Save to photos' onPress={savePhoto} /> : undefined} 
                            <Button title='Save to elephant storage' onPress={saveToElephant} />
                            <Button title='Discard' onPress={() => setPhoto(undefined)} /> */}
                            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: '2%'}}>
                                <Animated.View style={{display: 'flex', flexDirection: 'coloumn', marginRight: 10, paddingTop: 20, opacity: fadeAnim}} onLayout={() => fadeOut()}>
                                    <View style={{backgroundColor: 'rgba(0, 0, 0, .5)',  marginBottom: 25, paddingTop: 2, paddingBottom: 2, borderRadius: 17}}>
                                        <Text style={{fontSize: 18, textAlign: 'center', color: 'white'}}>Share</Text>
                                    </View>
                                    <View style={{backgroundColor: 'rgba(0, 0, 0, .5)',  marginBottom: 25, paddingTop: 2, paddingBottom: 2, borderRadius: 17}}>
                                    {hasMediaLibraryPermission ? <Text style={{fontSize: 18, paddingLeft: 10, paddingRight: 10, color: 'white'}}>Save To Photos</Text> : undefined}
                                    </View>
                                    <View style={{backgroundColor: 'rgba(0, 0, 0, .5)',  marginBottom: 25, paddingTop: 2, paddingBottom: 2, borderRadius: 17}}>
                                        <Text style={{fontSize: 18, textAlign: 'center', color: 'white'}}>Add To Staging</Text>
                                    </View>
                                    <View style={{backgroundColor: 'rgba(0, 0, 0, .5)', paddingTop: 2, paddingBottom: 2, borderRadius: 17}}>
                                        <Text style={{fontSize: 18, textAlign: 'center', color: 'white'}}>Delete</Text>
                                    </View>
                                    
                                </Animated.View>
                                <View style={{display: 'flex', flexDirection: 'coloumn', backgroundColor: 'rgba(0, 0, 0, .5)', paddingTop: 15, paddingBottom: 15, paddingLeft: 10, paddingRight: 10, borderRadius: 25}}>
                                    <TouchableOpacity style={{marginBottom: 15}} onPress={shareVideo}>
                                        <FontAwesomeIcon icon={faEnvelope} size={30} color='white'/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{marginBottom: 25}} onPress={saveVideo}>
                                        <FontAwesomeIcon icon={faDownload} size={30} color='white'/>
                                    </TouchableOpacity> 
                                    <TouchableOpacity style={{marginBottom: 20}} onPress={() => saveToElephant(true)}>
                                        <FontAwesomeIcon icon={faCloudArrowUp} size={30} color='white'/>
                                    </TouchableOpacity> 
                                    <TouchableOpacity onPress={() => setVideoObj(undefined)}>
                                        <FontAwesomeIcon icon={faTrash} size={30} color='white'/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </>
            :
                    <>
                        <PinchGestureHandler
                            onGestureEvent={onPinchEvent}
                            /* onHandlerStateChange={}   */  
                        >
                            <Camera style={styles.containerCenter} ref={cameraRef} type={type} zoom={zoom}>
                                <View style={{
                                        position: 'absolute',
                                        top: 0,
                                        width: '100%',
                                        height: '12.5%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        alignItems: 'flex-end',
                                        paddingRight: '5%',
                                    }}>
                                        <TouchableOpacity onPress={() => setSession(prev => !prev)} style={session ? {backgroundColor: 'white', width: '14%', height: '55%', borderRadius: 100, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'} : { width: '14%', height: '55%', borderRadius: 100, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, .5)'}}>
                                            <FontAwesomeIcon icon={faCloudArrowUp} color={session ? 'black' : 'white'} size={30} />
                                        </TouchableOpacity>
                                </View>
                                <View style={{
                                        position: 'absolute',
                                        top: 75,
                                        width: '100%',
                                        height: '12.5%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        alignItems: 'flex-end',
                                        paddingRight: '5%',
                                    }}>
                                        <TouchableOpacity onPress={toggleType} style={{ width: '14%', height: '55%', borderRadius: 100, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, .5)'}}>
                                            <FontAwesomeIcon icon={faRepeat} color={'white'} size={30} />
                                        </TouchableOpacity>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity onPress={() => setVideo(prev => !prev)} style={video ? {/* backgroundColor: 'white' */backgroundColor: 'rgba(0, 0, 0, .5)', width: '14%', height: '55%', borderRadius: 100, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: '10%', marginTop: '5%'} : { width: '14%', height: '55%', borderRadius: 100, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, .5)', marginRight: '10%', marginTop: '5%'}}>
                                            <FontAwesomeIcon icon={video ? faCamera : faVideoCamera} color={/* video ? 'black' :  */'white'} size={30} />
                                    </TouchableOpacity>
                                    {!video ? 
                                        <TouchableOpacity onPress={takePic} style={{marginRight: '17%'}}> 
                                            <FontAwesomeIcon icon={faCircle} size={90} color='white'/>
                                        </TouchableOpacity>
                                    :   
                                        <>
                                            {recording ? 
                                                <TouchableOpacity onPress={stopVideo} style={{marginRight: '17%', backgroundColor: 'transparent', borderWidth: 8, borderColor: 'white', borderRadius: 1000, width: '24%', height: 90, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}> 
                                                    <FontAwesomeIcon icon={faSquare} size={55} color='red'/>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity onPress={takeVideo} style={{marginRight: '17%', backgroundColor: 'transparent', borderWidth: 8, borderColor: 'white', borderRadius: 1000, width: '24%', height: 90, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}> 
                                                    <FontAwesomeIcon icon={solidCircle} size={55} color='red'/>
                                                </TouchableOpacity>
                                            }
                                        </>
                                    }
                                </View>
                                <StatusBar style="auto" /> 
                            </Camera>
                        </PinchGestureHandler>
                    </>
            }
            </>
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
    innerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '50%',
    },
    buttonContainer: {
        marginBottom: '15%',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center'
    },
    preview: {
        alignSelf: 'stretch',
        flex: 1
    }
})

export default CameraComponent
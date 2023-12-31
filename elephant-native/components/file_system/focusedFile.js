import { View, Text, Modal, TouchableOpacity, Pressable, TextInput, ScrollView} from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faXmark, faFile, faFolder, faArrowUpRightFromSquare, faImage, faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import React, {useEffect, useState} from 'react'
import { getFile, getFileDownloadURL } from '../../storage'
import { shareAsync } from 'expo-sharing'
import * as MediaLibrary from 'expo-media-library'
import * as FileSystem from 'expo-file-system'
import { Image } from 'react-native'
import { Linking } from 'react-native'
import { Audio } from 'expo-av'
import { firebaseAuth } from '../../firebaseConfig'
import { userListener } from '../../storage'


const FocusedFileComp = ({file, focus, deleteFile, renameFileFunction, folders, handleFileMove}) => {

    //initialize state
    const [userInst, setUserInst] = useState()
    const [preDelete, setPreDelete] = useState(false)
    const [add, setAdd] = useState(false)
    const [newFileName, setNewFileName] = useState(file ? file.fileName.split('.')[0] + (file.version > 0 ? ` (${file.version}).${file.fileName.split('.')[1]}` : '.' + file.fileName.split('.')[1]) : '') 
    const [moveFile, setMoveFile] = useState(false)
    const [destination, setDestination] = useState()
    const [expanded, setExpanded] = useState(false)
    const [sound, setSound] = useState()
    const [playing, setPlaying] = useState(false)
    const [playbackPosition, setPlaybackPosition] = useState(0)

    const [fileURL, setFileURL] = useState()
    const [fileObj, setFileObj] = useState()
    const [mediaPermissions, setMediaPermissions] = useState()
    const [navigateURL, setNavigateURL] = useState()

    const auth = firebaseAuth

    console.log(fileObj)
    console.log(file)

    //get the current user 
    useEffect(() => {
        if (auth) {
        try {
            const getCurrentUser = async () => {
            const unsubscribe = await userListener(setUserInst, false, auth.currentUser.uid)
        
            return () => unsubscribe()
            }
            getCurrentUser()
        } catch (err) {console.log(err)}
        } else console.log('no user yet')
        
    }, [auth])


        //rename a file by overwriting the fileName property
        const renameFile = () => {
            console.log(newFileName)
            let version = 0
            userInst.fileRefs.forEach(fileRef => {
                if (fileRef.fileName.split('.')[0].toLowerCase() === newFileName.toLowerCase()) version ++})
            console.log(version)

            console.log(version)

            if (newFileName !== file.fileName.split('.')[0] && newFileName.length > 0) {
                const newFile = {
                    ...file,
                    fileName: newFileName + '.' + file.fileName.split('.')[1],
                    version: version
                }
                const newFileObj = {
                    ...fileObj,
                    fileName: newFileName + '.' + file.fileName.split('.')[1],
                    fileId: file.fileId,
                    version: version
                }
                renameFileFunction({newFileRef: newFile, newFileInst: newFileObj})
                setNewFileName(version > 0 ? newFileName + ` (${version})` + '.' + file.fileName.split('.')[1] : newFileName + '.' + file.fileName.split('.')[1])
            }
        }

        //move a file by changing its flag property
        const handleMove = () => {
            const newFile = {
                ...file,
                flag: destination,
                fileName: newFileName ? newFileName + '.' + file.fileName.split('.')[1] : file.fileName
            }
            focus(false)
            setDestination(null)
            setMoveFile(false)
            handleFileMove(newFile)
        }

        //get the downloadable url from firebase storage from the file doc and save it in state
        useEffect(() => {
            const getFileDoc = async () => {
                const fileInst = await getFile(file.fileId)
                const url = await getFileDownloadURL(fileInst.uri)
                setFileURL(url)
                setFileObj(fileInst)
                setNavigateURL(fileInst.linksTo)
            }
            getFileDoc()

            const getPermissions = async () => {
                //get shareAsync permissions
                const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync()
                setMediaPermissions(mediaLibraryPermission.status === "granted")
            }
            getPermissions()
        }, [])

        //call download async method on url passed from firebase storage bucket
        const downloadFileFunction = async () => {
            const fileName = file.fileName
            const result = await FileSystem.downloadAsync(fileURL, FileSystem.documentDirectory + fileName)
            save(result.uri)
        }
        
        //save the file by opening up the share menu
        const save = (uri) => {
            shareAsync(uri)
        }  

        //load in the sound, set callback function interval to 10 mills, and check the finished status
        //play sound and set playing status to true
        async function playSound() {
            setPlaying(true)
            const { sound, status } = await Audio.Sound.createAsync({uri: fileURL}, 10, (status) => {if(status.didJustFinish) {
                //reset the playback position, set playing to false
                setPlaybackPosition(0) 
                setPlaying(false)}}
            );
            //play the sound from the playback position
            setSound(sound);
            await sound.playFromPositionAsync(playbackPosition, [0, 0]);
        }

        //get status of the sound, check if it's loaded
        //if the sound is playing, pause the sound
        //set the playbackPosition to result.positionMillis, set playing to false
        const pauseSound = async () => {
            setPlaying(false)
            try {
                const result = await sound.getStatusAsync();
                if (result.isLoaded) {
                if (result.isPlaying === true) {
                    sound.pauseAsync();
                    if (playbackPosition === result.playableDurationMillis) setPlaybackPosition(0)
                    else setPlaybackPosition(result.positionMillis)
                }
                }
            } catch (error) {}
        };
        
        //unload the sound
        useEffect(() => {
            return sound
              ? () => {
                  sound.unloadAsync();
                }
              : undefined;
        }, [sound]);

    return (
            <>
                {fileObj ? 

<Modal animationType='slide' presentationStyle='pageSheet'>
<>
    {preDelete ? 
        (   
            <Modal animationType='slide' presentationStyle='pageSheet'>
                <View style={{ paddingTop: '10%', backgroundColor: 'rgb(23 23 23)', height: '100%', width: '100%'}}>
                    {/* if the user hits the delete button on a file, open a modal that confirms they want to delete the file*/}
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: '5%', paddingTop: '10%',     width: '100%'}}>
                        <Pressable onPress={() => setPreDelete(false)}>
                        <FontAwesomeIcon icon={faXmark} color={'white'} size={30}/>
                        </Pressable>
                    </View>
                    <View style={{width: '100%', height: '95%', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 22, color: 'white', textAlign: 'center'}}>Are you sure you want to delete {file.fileName}?</Text>

                    {/* button with onPress function to delete the file */}
                    <View style={{width: '50%',
                            borderRadius: 25,
                            backgroundColor: 'red',
                            paddingTop: '2%',
                            paddingBottom: '2%',
                            marginTop: '10%',
                            marginLeft: '2%'}}>
                        <TouchableOpacity onPress={() => {
                            setPreDelete(false)
                            focus(false)
                            deleteFile(file.fileId)
                        }} style={{
                        display: 'flex', 
                        flexDirection: 'row', 
                        width: '100%', 
                        justifyContent: 'center',
                        }}>
                            <Text style={{fontSize: 15, color: 'white', fontWeight: '600'}}>Delete</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{width: '50%',
                        borderColor: '#777',
                        borderRadius: 25,
                        backgroundColor: 'white',
                        borderWidth: 1,
                        paddingTop: '2%',
                        paddingBottom: '2%',
                        marginTop: '7%',
                        marginBottom: '10%',
                        marginLeft: '2%'}}>
                        <TouchableOpacity onPress={() => setPreDelete(false)} style={{
                        display: 'flex', 
                        flexDirection: 'row', 
                        width: '100%', 
                        justifyContent: 'center',
                        }}>
                            <Text style={{fontSize: 15, color: 'black', fontWeight: '600'}}>Cancel</Text>
                        </TouchableOpacity>
                    </View>


                    </View>
                </View>
            </Modal>
        )
    :
    moveFile ? 
    (
        <Modal animationType='slide' presentationStyle='pageSheet' >
            <View style={{height: '100%', width: '100%', backgroundColor: 'rgb(23 23 23)'}}>
                {/* if the moveFile state is true, display the modal with the file movement code*/}
                {/* xMark icon for closing out the moveFile modal */}
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: '5%', paddingTop: '10%', width: '100%'}}>
                    <Pressable onPress={() => setMoveFile(false)}>
                    <FontAwesomeIcon icon={faXmark} color={'white'} size={30}/>
                    </Pressable>
                </View>
                <View style={{width: '100%', height: '95%', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 40, color: 'white', fontWeight: 'bold', textAlign: 'left', width: '100%', paddingLeft: '5%', marginBottom: '10%'}}>Move To...</Text>

                    <View style={{width: '100%', height: '55%', marginBottom: '10%'}}>
                            <ScrollView>
                            {/* map over each of the folders from the filesystem and display them as a pressable element // call movefile function when one of them is pressed */}
                            {folders.map((f, index) => {
                                if (f.id !== file.flag) return (
                                    <Pressable key={index} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '5%'}} onPress={() => setDestination(f.id)}>
                                        <View style={f.id === destination ? {borderBottomWidth: 2, width: '85%', backgroundColor: 'white', display: 'flex', flexDirection: 'row', paddingLeft: '2.5%', paddingTop: '2%'} : {borderBottomWidth: 2, width: '85%', borderBottomColor: 'white', display: 'flex', flexDirection: 'row', paddingLeft: '2.5%', paddingTop: '2%'}}>
                                        <FontAwesomeIcon icon={faFolder} size={30} color={f.id === destination ? 'black' : 'white'}/>
                                        <Text style={f.id === destination ? {color: 'black', fontSize: 30, marginLeft: '5%'} : {color: 'white', fontSize: 30, marginLeft: '5%'}}>{f.fileName}</Text>
                                        </View>
                                    </Pressable>)
                                }
                            )}
                            {/* 
                            
                                IF EVENTUALLY THE USER WILL BE ABLE TO MOVE A FILE TO THE HOMEPAGE, THIS IS WHERE THAT COULD WOULD BE

                            <Pressable style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '5%'}} onPress={() => setDestination('home')}>
                                    <View style={destination === 'home' ? {borderBottomWidth: 2, width: '85%', backgroundColor: 'white', display: 'flex', flexDirection: 'row', paddingLeft: '2.5%', paddingTop: '2%'} : {borderBottomWidth: 2, width: '85%', borderBottomColor: 'white', display: 'flex', flexDirection: 'row', paddingLeft: '2.5%', paddingTop: '2%'}}>
                                    <FontAwesomeIcon icon={faFolder} size={30} color={destination === 'home' ? 'black' : 'white'}/>
                                    <Text style={destination === 'home' ? {color: 'black', fontSize: 30, marginLeft: '5%'} : {color: 'white', fontSize: 30, marginLeft: '5%'}}>Home</Text>
                                    </View>
                                </Pressable> */}
                            </ScrollView>
                    </View>

                    <View style={{width: '50%',
                        borderColor: '#777',
                        borderRadius: 25,
                        backgroundColor: 'white',
                        borderWidth: 1,
                        paddingTop: '2%',
                        paddingBottom: '2%',
                        marginBottom: '10%',
                        marginLeft: '2%'}}>
                        <TouchableOpacity onPress={handleMove} style={{
                        display: 'flex', 
                        flexDirection: 'row', 
                        width: '100%', 
                        justifyContent: 'center',
                        }}>
                            <Text style={{fontSize: 15, color: 'black', fontWeight: '600'}}>Confirm Move</Text>
                        </TouchableOpacity>
                    </View>


                </View>
            </View>
        </Modal>
    )
    :
    <View style={{ paddingTop: '10%', backgroundColor: 'rgb(23 23 23)', height: '100%', width: '100%'}}>
            
            {/*x button container */}
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: '5%'}}>
            <Pressable onPress={() => focus(null)}>
                <FontAwesomeIcon icon={faXmark} color={'white'} size={30}/>
            </Pressable>
            </View>
            <View style={{paddingLeft: '5%'}}>

            {/* if the add folder state is toggled on, display the form for creating a new folder*/}
            {add ?  
                    <View style={{paddingTop: '25%'}}>
                        <Text style={{color: 'white', fontSize: 35, fontWeight: '700'}}>Rename File:</Text>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',  marginTop: '10%'}}>
                            <FontAwesomeIcon icon={faFile} size={30} color='white'/>
                            <TextInput style={{color: 'white', fontSize: 20, fontWeight: 'bold', borderBottomColor: 'white', borderBottomWidth: 2, width: '70%', marginRight: '15%'}} onChangeText={(e) => setNewFileName(e)} autoFocus/>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', paddingRight: '5%', marginTop: '10%'}}>
                            <View style={{width: '40%',
                                    borderColor: '#777',
                                    borderRadius: 25,
                                    backgroundColor: 'white',
                                    borderWidth: 1,
                                    paddingTop: '2%',
                                    paddingBottom: '2%',
                                    marginLeft: '2%'}}>
                                    <TouchableOpacity style={{
                                    display: 'flex', 
                                    flexDirection: 'row', 
                                    width: '100%', 
                                    justifyContent: 'center',
                                    }}
                                    onPress={() => {
                                        if (newFileName !== file.fileName.split('.')[0] && newFileName !== '') {
                                            renameFile()
                                            setAdd(false)
                                        } else setAdd(false)
                                    }}
                                    >
                                        <Text style={{fontSize: 15, color: 'black', fontWeight: '600'}}>Save</Text>
                                    </TouchableOpacity>
                            </View>
                            <View style={{width: '40%',
                                    borderColor: '#777',
                                    borderRadius: 25,
                                    backgroundColor: 'white',
                                    borderWidth: 1,
                                    paddingTop: '2%',
                                    paddingBottom: '2%',
                                    marginLeft: '2%'}}>
                                    <TouchableOpacity style={{
                                    display: 'flex', 
                                    flexDirection: 'row', 
                                    width: '100%', 
                                    justifyContent: 'center',
                                    }}
                                    onPress={() => setAdd(false)}
                                    >
                                        <Text style={{fontSize: 15, color: 'black', fontWeight: '600'}}>Cancel</Text>
                                    </TouchableOpacity>
                            </View>
                        </View>
                    </View>            
                    : expanded ? 

                    <Modal animationType='slide' presentationStyle='pageSheet'>
                        <View style={{ paddingTop: '10%', backgroundColor: 'rgb(23 23 23)', height: '100%', width: '100%'}}>
                            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: '5%', paddingTop: '5%', width: '100%'}}>
                                <Pressable onPress={() => setExpanded(false)}>
                                <FontAwesomeIcon icon={faXmark} color={'white'} size={30}/>
                                </Pressable>
                            </View>
                            <View style={{height: '60%', marginTop: '20%'}}>
                                <Image source={{uri: `${fileURL}`}} style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
                            </View>
                        </View>
                    </Modal>

                    :
                        <>
                            {((file.fileName.split('.')[1] === 'jpg' || file.fileName.split('.')[1] === 'png' || file.fileName.split('.')[1] === 'JPG' || file.fileName.split('.')[1] === 'PNG' || file.fileName.split('.')[1] === 'jpeg' || file.fileName.split('.')[1] === 'JPEG')) ? 
                                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '10%', marginBottom: '10%'}}>
                                    {fileURL ? 
                                        <Pressable width={300} height={150} onPress={() => setExpanded(true)}>
                                            <Image source={{uri: `${fileURL}`}} style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
                                        </Pressable>
                                    : 
                                        <View style={{height: 150}}>
                                            <FontAwesomeIcon icon={faImage} color='white' size={125}/>
                                            <Text style={{color: 'white', textAlign: 'center', marginTop: 15, fontSize: 10}}>Fetching Image...</Text>
                                        </View>
                                    }
                                </View>
                            :(file.fileName.split('.')[1] === 'pdf') ? 
                                <></>
                            : <></>
                            }
                            <View style={(file.fileName.split('.')[1] !== 'jpg' && file.fileName.split('.')[1] !== 'png' && file.fileName.split('.')[1] !== 'PNG' && file.fileName.split('.')[1] !== 'JPG' && file.fileName.split('.')[1] !== 'jpeg' && file.fileName.split('.')[1] !== 'JPEG') ? {height: '65%', width: '90%', marginTop: '5%'} : {height: '40%', width: '90%'}}>
                                
                                <Text style={{fontSize: 22, fontWeight: 'bold', color: 'white', marginTop: '5%'}} numberOfLines={3}>{newFileName}</Text>

                                <TouchableOpacity style={{ marginTop: '10%'}} onPress={() => setAdd(true)}>
                                    <Text style={{fontSize: 18, color: 'white'}}>Rename File</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ marginTop: '10%'}} onPress={() => setMoveFile(true)}>
                                    <Text style={{fontSize: 18, color: 'white'}}>Move File To...</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ marginTop: '10%'}} onPress={() =>
                                    setPreDelete(true)}>
                                    <Text style={{fontSize: 18, color: 'red'}}>Delete File</Text>
                                </TouchableOpacity>
                            </View>

                            {/* button that links to a non jpg or png file */}
                            {(file.fileName.split('.')[1] !== 'jpg' && file.fileName.split('.')[1] !== 'png' && file.fileName.split('.')[1] !== 'PNG' && file.fileName.split('.')[1] !== 'JPG' && file.fileName.split('.')[1] !== 'jpeg' && file.fileName.split('.')[1] !== 'JPEG') ? 
                                <>  
                                    {file.fileName.includes('URL for:') 
                                        ? 
                                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                        <View style={{width: '70%',
                                                borderColor: '#777',
                                                borderRadius: 25,
                                                backgroundColor: 'white',
                                                borderWidth: 1,
                                                paddingTop: '2%',
                                                paddingBottom: '2%',
                                                marginLeft: '2%',
                                                paddingLeft: '2%',
                                                paddingRight: '3%'}}>
                                                <TouchableOpacity style={{
                                                display: 'flex', 
                                                flexDirection: 'row', 
                                                width: '100%', 
                                                justifyContent: 'space-around',
                                                paddingLeft: '20%',
                                                paddingRight: '20%'
                                                }}
                                                disabled={fileURL ? false : true}
                                                onPress={() => Linking.openURL(navigateURL)}
                                                >
                                                    <Text style={{fontSize: 20, color: 'black', fontWeight: '600'}}>Go To URL</Text>
                                                    {fileURL ? <FontAwesomeIcon icon={faArrowUpRightFromSquare} size={20} style={{marginTop: '1%'}}/> : <></>}
                                                </TouchableOpacity>
                                        </View>
                                    </View>
                                    : fileObj.documentType === 'm4a' ? 
                                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '5%'}}>
                                            <View style={{width: '70%',
                                                    borderColor: '#777',
                                                    borderRadius: 25,
                                                    backgroundColor: 'white',
                                                    borderWidth: 1,
                                                    paddingTop: '2%',
                                                    paddingBottom: '2%',
                                                    marginLeft: '2%',
                                                    paddingLeft: '12%',
                                                    paddingRight: '12%'}}>
                                                    <TouchableOpacity style={{
                                                    display: 'flex', 
                                                    flexDirection: 'row', 
                                                    width: '100%', 
                                                    justifyContent: 'space-around',

                                                    }}
                                                    disabled={fileURL ? false : true}
                                                    onPress={() => {
                                                        if (!playing) playSound()
                                                        else pauseSound()
                                                    }}
                                                    >
                                                        <Text style={{fontSize: 20, color: 'black', fontWeight: '600'}}>{fileURL && !playing ? 'Play Sound' : fileURL && playing ? 'Pause Sound' : 'Fetching File...'}</Text>
                                                        {fileURL ? <FontAwesomeIcon icon={playing ? faPause : faPlay} size={20} style={{marginTop: '1%'}}/> : <></>}
                                                    </TouchableOpacity>
                                            </View>
                                        </View>
                                    : 
                                        <></>}
                                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '5%'}}>
                                        <View style={{width: '70%',
                                                borderColor: '#777',
                                                borderRadius: 25,
                                                backgroundColor: 'white',
                                                borderWidth: 1,
                                                paddingTop: '2%',
                                                paddingBottom: '2%',
                                                marginLeft: '2%',
                                                paddingLeft: '2%',
                                                paddingRight: '3%'}}>
                                                <TouchableOpacity style={{
                                                display: 'flex', 
                                                flexDirection: 'row', 
                                                width: '100%', 
                                                justifyContent: 'space-around',

                                                }}
                                                disabled={fileURL ? false : true}
                                                onPress={() => Linking.openURL(fileURL)}
                                                >
                                                    <Text style={{fontSize: 20, color: 'black', fontWeight: '600'}}>{fileURL ? 'View File In Browser' : 'Fetching File...'}</Text>
                                                    {fileURL ? <FontAwesomeIcon icon={faArrowUpRightFromSquare} size={20} style={{marginTop: '1%'}}/> : <></>}
                                                </TouchableOpacity>
                                        </View>
                                    </View>
                                </>
                            : <></>}


                            {/* button for downloading the file on the phones storage */}
                            <View style={(file.fileName.split('.')[1] !== 'jpg' && file.fileName.split('.')[1] !== 'png' && file.fileName.split('.')[1] !== 'jpg' && file.fileName.split('.')[1] !== 'png' && file.fileName.split('.')[1] !== 'PNG' && file.fileName.split('.')[1] !== 'JPG' && file.fileName.split('.')[1] !== 'jpeg' && file.fileName.split('.')[1] !== 'JPEG') ? {display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '5%'} : {display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '25%'}}>
                                <View style={{width: '70%',
                                        borderColor: '#777',
                                        borderRadius: 25,
                                        backgroundColor: 'white',
                                        borderWidth: 1,
                                        paddingTop: '2%',
                                        paddingBottom: '2%',
                                        marginLeft: '2%'}}>
                                        <TouchableOpacity style={{
                                        display: 'flex', 
                                        flexDirection: 'row', 
                                        width: '100%', 
                                        justifyContent: 'center',
                                        }}
                                        onPress={downloadFileFunction}
                                        >
                                            <Text style={{fontSize: 20, color: 'black', fontWeight: '600'}}>Download Or Share File</Text>
                                        </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    }
            </View>
    </View>
    }
</>
</Modal>
                
                : <></>}
                    
            </>
    )

   
}
export default FocusedFileComp
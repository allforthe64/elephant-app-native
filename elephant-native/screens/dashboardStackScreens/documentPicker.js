import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native'
import FileRow from '../../components/fileRow'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import { format } from 'date-fns'
import { addfile, updateStaging, updateUser } from '../../storage'
import { firebaseAuth } from '../../firebaseConfig'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { storage } from '../../firebaseConfig'
import {ref, uploadBytes} from 'firebase/storage'
import { userListener } from '../../storage'
import { useToast } from 'react-native-toast-notifications'

const FilePicker = () => {

    const [files, setFiles] = useState([])
    const [userInst, setUserInst] = useState()
    const [loading, setLoading] = useState(false)

    const currentUser = firebaseAuth.currentUser.uid
    const auth = firebaseAuth
    const toast = useToast()

    //get the current user 
    useEffect(() => {
        if (auth) {
        try {
            const getCurrentUser = async () => {
            const unsubscribe = await userListener(setUserInst, false, currentUser)
        
            return () => unsubscribe()
            }
            getCurrentUser()
        } catch (err) {console.log(err)}
        } else console.log('no user yet')
        
    }, [auth])

    const selectFile = async () => {
        let updatedFiles = [...files]
        try {
            const files = await DocumentPicker.getDocumentAsync({copyToCacheDirectory: false, multiple: true})

            //map over incoming files and push them all into the file arr
            files.assets.map(file => /* console.log(file) */updatedFiles.push({name: file.name, uri: file.uri, size: file.size, fileType: file.name.split('.')[1]}))
            setFiles(updatedFiles)
        } catch (err) {
            console.log(err)
        }
        
    }

    const selectImage = async () => {
        let updatedFiles = [...files]
        // No permissions request is necessary for launching the image library
        let img = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!img.canceled) {
            updatedFiles.push({name: img.assets[0].fileName, uri: img.assets[0].uri, size: img.assets[0].fileSize, fileType: img.assets[0].fileName.split('.')[1]})
            setFiles(updatedFiles)
        }
    };

    const renderFiles = () => {
        return files.map((file, index) => {
            return (
                <FileRow file={file} files={files} index={index} key={index} deleteFunc={filterFiles}/>
            )
        })
    }

    const filterFiles = (input, target) => {

        const arr = []
    
        input.map(el => {
            if (JSON.stringify(el) !== JSON.stringify(target)) arr.push(el)
        })
    
        setFiles(arr)
    }
    
    const saveFiles = async () => {
        
        setLoading(true)
        let uploadSize = 0

        const references =  await Promise.all(files.map(async (el) => {

            //increase the upload size
            uploadSize += el.size

            //check for files with the same name and increase the version number
            let versionNo = 0
            userInst.fileRefs.forEach(fileRef => {
                if (fileRef.fileName === el.name && fileRef.fileName.split('.')[1] === el.name.split('.')[1]) {
                    versionNo ++
                }
            })

            //generate formatted date for file name
            const formattedDate = format(new Date(), `yyyy-MM-dd:hh:mm:ss::${Date.now()}`)

            //create blob and upload it into firebase storage
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
                    xhr.open('GET', el.uri, true)
                    xhr.send(null)
                })
    
                const filename = `${currentUser}/${formattedDate}`
                const fileRef = ref(storage, filename)
                uploadBytes(fileRef, blob)
                
                //generate references
                const reference = await addfile({...el, name: el.name, user: currentUser, timeStamp: formattedDate, version: versionNo})
                
                return reference

            } catch (err) {
                console.log(err)
            }

        }))

        try {

            //increase the ammount of storage space being used and add the new references into the user's fileRefs
            const newSpaceUsed = userInst.spaceUsed + uploadSize
            const newUser = {...userInst, spaceUsed: newSpaceUsed, fileRefs: [...userInst.fileRefs, ...references]}
            await updateUser(newUser)

            //reset the form
            setLoading(false)
            const empty = []
            setFiles(empty)
            toast.show('File upload successful', {
                type: 'success'
            }) 
        } catch (error) {console.log(error)}
          
    }

    const insets = useSafeAreaInsets()

  return (
    <View style={styles.container}>
        <Image style={styles.bgImg } source={require('../../assets/elephant-dashboard.jpg')} />
        <View style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            paddingTop: insets.top,
            paddingBottom: insets.bottom
        }}>
            <Text style={styles.bigHeader}>Files to upload:</Text>
                {loading ? 
                    <View style={styles.noFileCon}>
                        <Text style={styles.bigHeader}>Uploading Files...</Text>
                    </View>
                :   
                    <>
                        {files.length === 0 ? 
                            <View style={styles.noFileCon}>
                                <Text style={styles.bigHeader}>No Files Selected</Text>
                            </View>
                        :
                            <View style={styles.scrollCon}>
                                <ScrollView>
                                    {renderFiles()}
                                </ScrollView>
                            </View>
                        }
                    </>
                }
            <View style={styles.buttonCon}>

                <View style={styles.buttonWrapperSm}>
                    <TouchableOpacity onPress={() => selectFile()}>
                    <Text style={styles.input}>Select File</Text>
                    </TouchableOpacity>
                </View>

                
                <View style={styles.buttonWrapperSm}>
                    <TouchableOpacity onPress={() => selectImage()}>
                    <Text style={styles.input}>Select Photo</Text>
                    </TouchableOpacity>
                </View>
                {/* <Button title='Select File' onPress={() => selectFile()}/>
                <Button title='Select Photo' onPress={()=> selectImage()}/> */}
            </View>
            <View style={styles.wrapperContainer}>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => saveFiles()}>
                    <Text style={styles.input}>Upload Files</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    bigHeader: {
        color: 'white',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: '700',
        marginBottom: '8%'
      },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(23,23,23)',
        height: '100%'
    },
    bgImg: {
        objectFit: 'scale-down',
        opacity: .15,
        transform: [{scaleX: -1}]
    },
    buttonCon: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: '12%',
        width: '100%'
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
    buttonWrapperSm: {
        width: '40%',
        borderColor: '#777',
        borderRadius: 25,
        backgroundColor: 'white',
        borderWidth: 1,
        paddingTop: '2%',
        paddingBottom: '2%',
    },
    input: {
        textAlign: 'center',
        fontSize: 15,
        width: '100%',
    },
    scrollCon: {
        height: '60%',
        width: '95%',
        borderBottomWidth: 1,
        borderColor: 'white',
        marginBottom: '10%'
    },
    noFileCon: {
        height: '60%',
        width: '95%',
        borderBottomWidth: 1,
        borderColor: 'white',
        marginBottom: '10%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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

export default FilePicker
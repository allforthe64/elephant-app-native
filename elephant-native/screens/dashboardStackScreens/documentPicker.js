import React, {useState} from 'react'
import {View, Text, Button, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native'
import FileRow from '../../components/fileRow'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import { firebase } from '../../firebaseConfig'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { addfile, updateStaging } from '../../storage'
import { firebaseAuth } from '../../firebaseConfig'

const FilePicker = () => {

    const [files, setFiles] = useState([])
    const [success, setSuccess] = useState(false)

    const currentUser = firebaseAuth.currentUser.uid

    const selectFile = async () => {
        let updatedFiles = [...files]
        try {
            const file = await DocumentPicker.getDocumentAsync({copyToCacheDirectory: false})

            updatedFiles.push({name: file.assets[0].name, uri: file.assets[0].uri, size: file.assets[0].size, fileType: file.assets[0].name.split('.')[1]})
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

        //create new formatted date for file
        const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'")
        

        const references =  await Promise.all(files.map(async (el) => {


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
    
                const filename = `${formattedDate}/${el.name}`
                const ref = firebase.storage().ref().child(filename)
    
                await ref.put(blob)
                const reference = await addfile(el)
                
                return reference

            } catch (err) {
                console.log(err)
            }

        }))

        console.log('references: ', references)

        updateStaging(references, currentUser)

        const empty = []
        setFiles(empty)
        setSuccess(true)
          
    }

  return (
    <View style={styles.container}>
        <Image style={styles.bgImg } source={require('../../assets/elephant-dashboard.jpg')} />
        <View style={styles.innerContainer}>
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
            <Text style={styles.bigHeader}>Files to upload:</Text>
            {files.length === 0 ? 
                <View style={styles.noFileCon}>
                    <Text style={styles.bigHeader}>No Files Uploaded</Text>
                </View>
            :
                <View style={styles.scrollCon}>
                    <ScrollView>
                        {renderFiles()}
                    </ScrollView>
                </View>
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
    innerContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        paddingTop: '10%',
        paddingBottom: '10%'
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
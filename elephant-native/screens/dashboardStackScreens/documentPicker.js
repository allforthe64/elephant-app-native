import React, {useState} from 'react'
import {View, Text, Button, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native'
import FileRow from '../../components/fileRow'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'

const FilePicker = () => {

    const [files, setFiles] = useState([])

    const selectFile = async () => {
        let updatedFiles = [...files]
        try {
            const file = await DocumentPicker.getDocumentAsync({copyToCacheDirectory: false})

            updatedFiles.push({name: file.assets[0].name, uri: file.assets[0].uri, size: file.assets[0].size})
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
            updatedFiles.push({name: img.assets[0].fileName, uri: img.assets[0].uri, size: img.assets[0].fileSize})
            setFiles(updatedFiles)
        }
    };

    const renderFiles = () => {
        return files.map((file, index) => {
            return (
                <FileRow file={file} files={files} index={index} deleteFunc={filterFiles}/>
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

  return (
    <View style={styles.container}>
        <Image style={styles.bgImg } source={require('../../assets/elephant-dashboard.jpg')} />
        <View style={styles.innerContainer}>
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
                    <TouchableOpacity onPress={() => console.log('saving files...')}>
                    <Text style={styles.input}>Save All</Text>
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
})

export default FilePicker
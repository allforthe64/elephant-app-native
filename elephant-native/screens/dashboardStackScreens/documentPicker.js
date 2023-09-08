import React, {useState} from 'react'
import {View, Text, Button, StyleSheet} from 'react-native'
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
                <View key={index} style={styles.fileRow}>
                    <Text style={styles.file} numberOfLines={1}>{file.name}</Text>
                    <Button title='Delete' onPress={() => filterFiles(files, file)}/>
                </View>
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
        <View style={styles.buttonCon}>
            <Button title='Select File' onPress={() => selectFile()}/>
            <Button title='Select Photo' onPress={()=> selectImage()}/>
        </View>
        <View style={styles.fileContainer}>
            {renderFiles()}
        </View>
        <Button title='Upload Files' />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonCon: {
        display: 'flex',
        flexDirection: 'row'
    },
    fileContainer: {
        borderWidth: 1,
        width: '100%', 
        height: '50%',
        marginTop: '10%',
        marginBottom: '10%'
    },
    fileRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: '5%',
        paddingRight: '5%'
    },
    file: {
        color: 'black',
        width: '50%'
    }
})

export default FilePicker
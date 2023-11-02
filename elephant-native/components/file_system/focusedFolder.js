import { StyleSheet, Text, View } from 'react-native'
import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import Folder from './folder'
import File from './file'

const FocusedFolder = ({folder, clear, getTargetFolder}) => {
    console.log(folder)

  return (
    <View style={styles.container}>
        <View style={styles.title}>
            <Text style={styles.header}>{folder.name}</Text>
            <TouchableOpacity style={{marginLeft: '10%'}} onPressOut={() => clear(null)}>
                <FontAwesomeIcon icon={faXmark} size={35} color='white' />
            </TouchableOpacity>
        </View>
        <View>
            <ScrollView >
                {folder.folders.map((folder, i) => {return <Folder key={folder + i} getTargetFolder={getTargetFolder} folderName={folder.fileName} />})}
                {folder.files.map((file, i) => {return <File key={file + i} fileName={file.fileName} />})}
            </ScrollView> 
        </View>
    </View>
  )
}

export default FocusedFolder

const styles = StyleSheet.create({
    container:{
        height: '100%',
        paddingTop: '5%',
        paddingBottom: '5%'
    },
    title: {
        display: 'flex', 
        flexDirection: 'row',
        paddingTop: '2.5%',
        paddingBottom: '2.5%',
        marginBottom: '15%'
    },
    header: {
        color: 'white',
        fontSize: 30,
        fontWeight: '500',
        marginLeft: '35%',
        width: '50%'
    }
})
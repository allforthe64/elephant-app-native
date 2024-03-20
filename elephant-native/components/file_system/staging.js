import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import FocusedFileComp from './focusedFile'
import File from './file'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Staging = ({staging, reset, folders, deleteFile, renameFile, moveFile, userFiles}) => {

    const [focusedFile, setFocusedFile] = useState()

    const insets = useSafeAreaInsets()

    useEffect(() => {
        if (focusedFile) {
            const newFile = userFiles.filter(fileRef => fileRef.fileId === focusedFile.fileId)
            setFocusedFile(newFile[0])
        }

    }, [userFiles])

  return (
    <>
        {focusedFile ?
                <FocusedFileComp file={focusedFile} focus={setFocusedFile} deleteFile={deleteFile} renameFileFunction={renameFile} folders={folders} handleFileMove={moveFile}/>
        :
        <View style={{
                height: '100%',
                paddingTop: '5%',
                paddingBottom: '5%',
                position: 'absolute',
                top: 0,
                backgroundColor: 'rgba(0, 0, 0, .8)',
                paddingTop: insets.top,
                paddingBottom: insets.bottom
            }}>
            <View style={styles.title}>
                <Text style={styles.header}>Files In Staging</Text>
                <TouchableOpacity style={{marginLeft: '10%'}} onPressOut={() => reset(false)}>
                    <FontAwesomeIcon icon={faXmark} size={35} color='white' />
                </TouchableOpacity>
            </View>
            <View style={{height: '80%', paddingBottom: '5%'}}>
                {staging.length > 0 ? 
                    <ScrollView>
                        {staging.map((file, i) => {
                            return <File key={file + i}  file={file} focus={setFocusedFile}/>
                        })}        
                    </ScrollView> 
                    : <Text style={{color: 'white', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto'}}>No Files In Staging!</Text>
                }
            </View>
        </View>}
    </>
  )
}

export default Staging

const styles = StyleSheet.create({
    title: {
        display: 'flex', 
        flexDirection: 'row',
        marginBottom: '15%'
    },
    header: {
        color: 'white',
        fontSize: 30,
        fontWeight: '500',
        marginLeft: '25%',
        width: '60%',
    }
})
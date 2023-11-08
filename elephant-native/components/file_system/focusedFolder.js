import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faXmark } from '@fortawesome/free-solid-svg-icons'
import { ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native-gesture-handler'
import Folder from './folder'
import File from './file'
import FocusedFileComp from './focusedFile'
import { faFolder } from '@fortawesome/free-solid-svg-icons'

const FocusedFolder = ({folder, folders, clear, getTargetFolder, addFolder, renameFolder, moveFolder, deleteFolder, deleteFile, renameFile, moveFile}) => {


    const [nestedFolder, setNestedFolder] = useState()
    const [loading, setLoading] = useState(true)
    const [add, setAdd] = useState(false)
    const [newFolderName, setNewFolderName] = useState('')
    const [focusedFile, setFocusedFile] = useState()

    //get the folder above this one so the user can navigate up a level
    useEffect(() => {
        const getNestedFolder = () => {
            const targetFolder = folders.filter(f => {
            if(f.id === folder.folder.nestedUnder) return f})
            return targetFolder
        }   
        const targetFolder = getNestedFolder()
        setLoading(false)
        setNestedFolder(targetFolder)

    }, [folder])

    //navigate up a level in the folder tree
    const navigateUp = () => {
        const targetFolder = folders.filter(f => {
            if(f.id === folder.folder.nestedUnder) return f}
        ) 
        getTargetFolder(targetFolder[0])
    }

  return (
    <View style={styles.container}>
        {loading ? <></> 
        : focusedFile ?
            <FocusedFileComp file={focusedFile} focus={setFocusedFile} deleteFile={deleteFile} renameFileFunction={renameFile} folders={folders} handleFileMove={moveFile} setFocusedFile={setFocusedFile}/>
        :
            <>
                <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.backButtonContainer} onPress={folder.folder.nestedUnder === '' ? () => clear(null) : () => navigateUp()}>
                            <FontAwesomeIcon icon={faArrowLeft} color='white' size={20} />
                            <Text style={styles.smallHeader}>Back To {nestedFolder.length > 0 ? nestedFolder[0].fileName : 'Home'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPressOut={() => clear(null)}>
                            <FontAwesomeIcon icon={faXmark} size={30} color='white' />
                        </TouchableOpacity>
                </View>
                    <View style={styles.title}>
                        <Text style={styles.header}>{folder.folder.fileName}</Text>
                    </View>
                    <View style={{height: '60%'}}>
                        <ScrollView >
                            {folder.folders.map((f, i) => {return <Folder key={f + i} getTargetFolder={getTargetFolder} folders={folders} renameFolder={renameFolder} moveFolderFunc={moveFolder} folder={f} deleteFolder={deleteFolder}/>})}
                            {folder.files.map((file, i) => {return <File key={file + i} focus={setFocusedFile} file={file} />})}
                        </ScrollView> 
                    </View>
                        {add ? 
                            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                                    <FontAwesomeIcon icon={faFolder} size={30} color='white'/>
                                    <TextInput value={newFolderName} style={{color: 'white', fontSize: 20, fontWeight: 'bold', borderBottomColor: 'white', borderBottomWidth: 2, width: '40%'}} onChangeText={(e) => setNewFolderName(e)} autoFocus/>
                                    <View style={{width: '25%',
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
                                                addFolder(newFolderName, folder.folder.id)
                                                setNewFolderName('')
                                                setAdd(false)
                                            }}
                                            >
                                                <Text style={{fontSize: 15, color: 'black', fontWeight: '600'}}>Save</Text>
                                            </TouchableOpacity>
                                    </View>
                                </View>
                                : 
                                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                <FontAwesomeIcon icon={faFolder} size={30} color='white'/>
                                <View style={{width: '50%',
                                            borderColor: '#777',
                                            borderRadius: 25,
                                            backgroundColor: 'white',
                                            borderWidth: 1,
                                            paddingTop: '2%',
                                            paddingBottom: '2%',
                                            marginBottom: '10%',
                                            marginLeft: '2%'}}>
                                        <TouchableOpacity style={{
                                            display: 'flex', 
                                            flexDirection: 'row', 
                                            width: '100%', 
                                            justifyContent: 'center',
                                        }}
                                            onPress={() => setAdd(true)}
                                        >
                                            <Text style={{fontSize: 15, color: 'black', fontWeight: '600'}}>Add New Folder</Text>
                                        </TouchableOpacity>
                                </View>
                            </View>
                        }
            </>
        }
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
        justifyContent: 'flex-end',
        paddingTop: '2.5%',
        paddingBottom: '2.5%',
        paddingRight: '5%',
        marginBottom: '15%'
    },
    buttonContainer: {
        width: '100%', 
        display: 'flex', 
        flexDirection: 'row', 
        paddingLeft: '4%', 
        marginBottom: '10%'
    },
    backButtonContainer: {
        display: 'flex', 
        flexDirection: 'row', 
        width: '78%', 
        paddingTop: '2%'
    },
    header: {
        color: 'white',
        fontSize: 30,
        fontWeight: '500',
        position: 'absolute',
        textAlign: 'center',
        width: '100%',
        paddingTop: '2.5%',
        paddingRight: '5%'
    },
    smallHeader: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
        width: '100%',
        paddingLeft: '2.5%',
    }
})
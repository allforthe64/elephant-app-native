import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faXmark } from '@fortawesome/free-solid-svg-icons'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import Folder from './folder'
import File from './file'

const FocusedFolder = ({folder, folders, clear, getTargetFolder, deleteFolder}) => {


    const [nestedFolder, setNestedFolder] = useState()
    const [loading, setLoading] = useState(true)

    //get the folder above this one so the user can navigate up a level
    useEffect(() => {
        const getNestedFolder = () => {
            const targetFolder = folders.filter(f => {
                console.log(f.id)
            if(f.id === folder.folder.nestedUnder) return f})
            return targetFolder
        }   
        const targetFolder = getNestedFolder()
        setLoading(false)
        setNestedFolder(targetFolder)

    }, [folder])

    //navigate up a level in the folder tree
    const navigateUp = () => {
        console.log(folders)
        const targetFolder = folders.filter(f => {
            if(f.id === folder.folder.nestedUnder) return f}
        ) 
        getTargetFolder(targetFolder[0])
    }

  return (
    <View style={styles.container}>
        {loading ? <></> 
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
                    <View>
                        <ScrollView >
                            {folder.folders.map((f, i) => {return <Folder key={f + i} getTargetFolder={getTargetFolder} folder={f} deleteFolder={deleteFolder}/>})}
                            {folder.files.map((file, i) => {return <File key={file + i} fileName={file.fileName} />})}
                        </ScrollView> 
                    </View>
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
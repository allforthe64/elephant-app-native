import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRight, faFolder } from '@fortawesome/free-solid-svg-icons';

const Folder = ({folder, getTargetFolder, pressable}) => {
  return (
    <TouchableOpacity style={styles.folder} onPress={() => getTargetFolder(folder)}>
        <View style={styles.folderTitle}>
            <FontAwesomeIcon icon={faFolder} color={'white'} size={32} />
            <Text style={styles.folderName}>{folder.fileName}</Text>
        </View>
        <FontAwesomeIcon icon={faArrowRight} size={26} color={'white'} style={styles.folderArrow}/>
    </TouchableOpacity>
  )
}

export default Folder

const styles = StyleSheet.create({

    //filing styles
    folder: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingRight: '2%',
        flexDirection: 'row',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderBottomWidth: '2px',
        borderBottomColor: 'white',
        width: '90%',
        paddingBottom: '1.5%',
        paddingLeft: '4%',
        marginBottom: '8%'
    },
    folderTitle: {
      display: 'flex',
      flexDirection: 'row',
      width: '80%',
    },
    folderName: {
      color: 'white',
      textAlign: 'center',
      fontSize: 22,
      fontWeight: '500',
      paddingTop: '3%',
      marginLeft: '6%'
    },
    folderArrow: {
    marginTop: 'auto'
    }
})
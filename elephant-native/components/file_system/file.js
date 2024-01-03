import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';

const File = ({file, focus}) => {
  return (
    <TouchableOpacity style={styles.file} onPress={() => focus(file)}>
        <View style={styles.fileTitle}>
            <FontAwesomeIcon icon={faFile} color={'white'} size={32} />
            <Text numberOfLines={1} style={styles.fileName}>{file.fileName}</Text>
        </View>
    </TouchableOpacity>
  )
}

export default File

const styles = StyleSheet.create({

    //filing styles
    file: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: '2%',
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    width: '90%',
    paddingBottom: '1.5%',
    marginBottom: '8%'
    },
    fileTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    },
    fileName: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
    paddingTop: '4%',
    width: '70%'
    }
})
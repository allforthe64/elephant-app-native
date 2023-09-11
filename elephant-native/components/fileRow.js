import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native'
import React from 'react'

const FileRow = ({file, files, index, deleteFunc}) => {
  return (
    <View key={index} style={styles.fileRow}>
        <Text style={styles.file} numberOfLines={1}>{file.name}</Text>
        <TouchableOpacity title='Delete' onPress={() => deleteFunc(files, file)}>
            <Text style={styles.pressable}>Delete</Text>
        </TouchableOpacity>
    </View>
  )
}

export default FileRow

const styles = StyleSheet.create({
    fileRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: '5%',
        paddingRight: '5%',
        marginBottom: '7%'
    },
    file: {
        color: 'white',
        width: '65%',
        fontSize: 15,
        fontWeight: '600',
    },
    pressable: {
        color: 'red',
        fontSize: 15,
        fontWeight: '500'
    }
})
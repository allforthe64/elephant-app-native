import { StyleSheet, Text, View } from 'react-native'
import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import Folder from './folder'
import File from './file'

const Staging = ({staging, reset}) => {

  return (
    <View style={styles.container}>
        <View style={styles.title}>
            <Text style={styles.header}>Files In Staging</Text>
            <TouchableOpacity style={{marginLeft: '10%'}} onPressOut={() => reset(false)}>
                <FontAwesomeIcon icon={faXmark} size={35} color='white' />
            </TouchableOpacity>
        </View>
        <View>
            <ScrollView>
                {staging.map((file, i) => {return <File key={file + i}  fileName={file.fileName}/>})}        
            </ScrollView> 
        </View>
    </View>
  )
}

export default Staging

const styles = StyleSheet.create({
    container:{
        height: '100%',
        paddingTop: '5%',
        paddingBottom: '5%'
    },
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
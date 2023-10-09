import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'

const Notepad = () => {

    const [subject, setSubject] = useState('')
    const [location, setLocation] = useState('')
    const [body, setBody] = useState('')

    const saveNote = () => {
        console.log('note saved')
    }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
          <TextInput onChangeText={(e) => setBody(e)}
                    value={body}
                    placeholder={'Add a note...'}
                    style={styles.noteBody}
                    editable
                    multiline
                    numberOfLines={2}
                    placeholderTextColor='grey'
                    autoFocus={true}
                    />
        <View style={styles.wrapperContainer}>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity onPress={() => saveNote()}>
                    <Text style={styles.input}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgb(23,23,23)'
    }, 
    noteBody: {
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 50,
        fontSize: 18,
        textAlignVertical: 'top',
        width: '100%',
        height: '75%'
    },
    wrapperContainer: {
      width: '30%',
      position: 'absolute',
      top: '65%',
      right: '5%'
    },
    buttonWrapper: {
      width: '100%',
      borderColor: '#777',
      borderRadius: 25,
      backgroundColor: 'black',
      borderWidth: 1,
      paddingTop: '2%',
      paddingBottom: '2%',
    },
    input: {
      textAlign: 'center',
      fontSize: 18,
      width: '100%',
      color: 'white'
    },
})

export default Notepad
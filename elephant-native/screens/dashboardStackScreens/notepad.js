import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native'

const Notepad = () => {

    const [subject, setSubject] = useState('')
    const [location, setLocation] = useState('')
    const [body, setBody] = useState('')

    const saveNote = () => {
        console.log('note saved')
    }

  return (
    <View style={styles.container}>
        <Text style={styles.bigHeader}>Add A Note:</Text>
        <View style={styles.form}>
            <Text style={styles.subheading}>Note subject:</Text>
            <TextInput onChangeText={(e) => setSubject(e)}
                value={subject}
                placeholder={'Subject'}
                style={styles.formInput}
                />
            <Text style={styles.subheading}>Add a location:</Text>
            <TextInput onChangeText={(e) => setLocation(e)}
                value={location}
                placeholder={'Location'}
                style={styles.formInput}
                />
            <Text style={styles.subheading}>Note Body:</Text>
            <TextInput onChangeText={(e) => setBody(e)}
                value={body}
                placeholder={'Notes:'}
                style={styles.noteBody}
                editable
                multiline
                numberOfLines={8}
                />
        </View>
        <View style={styles.wrapperContainer}>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => saveNote()}>
                        <Text style={styles.input}>Save Note</Text>
                    </TouchableOpacity>
                </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: 'rgb(23,23,23)'
    }, 
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },     
    bigHeader: {
      color: 'white',
      fontSize: 45,
      textAlign: 'center',
      fontWeight: '700',
      marginTop: '2.5%',
      marginBottom: '5%'
    },
    subheading: {
        color: 'white',
        textAlign: 'center',
        fontSize: 25,
        fontWeight: '500',
        width: '90%',
        textAlign: 'left',
        marginBottom: '2%'
      },
    formInput: {
      backgroundColor: 'white',
      paddingLeft: 4,
      paddingRight: 4,
      paddingTop: 2,
      paddingBottom: 2,
      fontSize: 18,
      width: '90%',
      marginBottom: '10%'
    },
    noteBody: {
        backgroundColor: 'white',
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: 18,
        textAlignVertical: 'top',
        width: '90%'
    },
    wrapperContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: '5%'
      },
      buttonWrapper: {
        width: '80%'
      },
      input: {
        borderWidth: 1,
        borderColor: '#777',
        padding: 8,
        margin: 10,
        backgroundColor: 'white',
        width: 'full',
        textAlign: 'center',
        fontSize: 20,
        borderRadius: 25
      },
})

export default Notepad
import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Keyboard, KeyboardAvoidingView } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheck, faPencil } from '@fortawesome/free-solid-svg-icons'

const Notepad = () => {

    const [open, setOpen] = useState(true)
    const [body, setBody] = useState('')
    const ref = useRef(null)


    const saveNote = () => {
        setOpen(false)
    }

    const startEdit = () => {
      setOpen(true)
    }

    const addToStorage = () => {
      console.log('Adding note to storage')
    }

    useEffect(() => {
      if (open === false) Keyboard.dismiss() 
      else ref.current.focus() 
    },[open])


  return (
    <KeyboardAvoidingView behavior="padding">
          <TextInput onChangeText={(e) => setBody(e)}
                      value={body}
                      placeholder={'Add a note...'}
                      style={open ? styles.noteBody : styles.noteBodyFull}
                      editable={open ? true : false}
                      multiline
                      numberOfLines={2}
                      placeholderTextColor='grey'
                      ref={ref}
                      autoFocus
                      />
        <View style={open ? styles.wrapperContainer : styles.wrapperContainerFull}>
           {!open && 
              <View style={styles.buttonWrapperText}>
                <TouchableOpacity onPress={() => addToStorage()}>
                  <Text style={styles.input}>Add To Storage</Text>
                </TouchableOpacity>
              </View>
            }
            <View style={open ? styles.buttonWrapper : styles.buttonWrapperFull}>
                <TouchableOpacity onPress={() => {open === false ? startEdit() : saveNote()}}>
                  {open ? (
                      <FontAwesomeIcon icon={faCheck} size={40} color='white'/>
                    )
                    : (
                      <FontAwesomeIcon icon={faPencil} size={40} color='white'/>
                    )
                  }
                </TouchableOpacity>
            </View>
        </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
    noteBody: {
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 70,
        fontSize: 18,
        textAlignVertical: 'top',
        width: '100%',
        height: '75%'
    },
    noteBodyFull: {
      backgroundColor: 'white',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
      paddingBottom: 60,
      fontSize: 18,
      textAlignVertical: 'top',
      width: '100%',
      height: '100%'
  },
    wrapperContainer: {
      width: '100%',
      position: 'absolute',
      top: '58%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingRight: '5%',
    },

    wrapperContainerFull: {
      width: '100%',
      position: 'absolute',
      top: '88%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: '5%'
    },
    buttonWrapper: {
      width: '16%',
      borderColor: '#777',
      borderRadius: 100,
      backgroundColor: 'black',
      borderWidth: 1,
      paddingLeft: '2%',
      paddingTop: '2%',
      paddingBottom: '2%'
    },
    buttonWrapperFull: {
      width: '18%',
      borderColor: '#777',
      borderRadius: 100,
      backgroundColor: 'black',
      borderWidth: 1,
      paddingLeft: '3.5%',
      paddingTop: '3%',
      paddingBottom: '3%'
    },
    buttonWrapperText: {
      width: '45%',
      height: '65%',
      borderColor: '#777',
      borderRadius: 100,
      backgroundColor: 'black',
      borderWidth: 1,
      paddingTop: '2%',
      marginRight: '5%'
    },
    input: {
      textAlign: 'center',
      fontSize: 18,
      width: '100%',
      color: 'white'
    },
})

export default Notepad
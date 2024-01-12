import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Keyboard, KeyboardAvoidingView, Modal, Pressable, ScrollView } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheck, faPencil, faXmark, faFolder } from '@fortawesome/free-solid-svg-icons'
import { ref as refFunction, uploadBytes} from 'firebase/storage'
import { format } from 'date-fns'
import { firebaseAuth, storage } from '../../firebaseConfig';
import { addfile, userListener, updateStaging } from '../../storage'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Notepad = () => {

    const [open, setOpen] = useState(true)
    const [body, setBody] = useState('')
    const ref = useRef(null)
    const [preAdd, setPreAdd] = useState(false)
    const [destination, setDestination] = useState()
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(false)

    //get the auth user context object
    const auth = firebaseAuth

    //get the current user 
    useEffect(() => {
      setLoading(true) //prevent component to attempting to render files/folders before they exist
      const getCurrentUser = async () => {
        const unsubscribe = await userListener(setCurrentUser, false, auth.currentUser.uid)

        return () => unsubscribe()
      }
      getCurrentUser()
    }, [auth])

    //once a current user has been pushed into state, allow component to render files/folders
    useEffect(() => {
      if (currentUser) setLoading(false)
    }, [currentUser])  


    saveNote = () => {
      setOpen(false)
    
    }

    const startEdit = () => {
      setOpen(true)
    }

    const addToStorage = async () => {

      const formattedDate = format(new Date(), "yyyy-MM-dd:hh:mm:ss")
      const fileName = `Note from: ${formattedDate}.txt`

      let versionNo = 0
      currentUser.fileRefs.forEach(fileRef => {
        if (fileRef.fileName === fileName && fileRef.fileName.split('.')[1] === fileName.split('.')[1]) {
          versionNo ++
      }
      })

      console.log(versionNo)

      try {
        const textFile = new Blob([`${body}`], {
          type: "text/plain;charset=utf-8",
       });
        const fileUri = `${currentUser.uid}/${formattedDate}`
        const fileRef = refFunction(storage, fileUri)
        uploadBytes(fileRef, textFile)


        const reference = await addfile({
          name: fileName,
          fileType: 'txt',
          size: textFile.size,
          uri: `${fileUri}`,
          user: currentUser.uid,
          timeStamp: formattedDate,
          version: versionNo
      }, destination)
      updateStaging([reference], currentUser.uid)
      setBody(null)
      setDestination(null)
      } catch (err) {
        console.log(err)
      }
    }

    useEffect(() => {
      if (open === false) Keyboard.dismiss() 
      else ref.current.focus() 
    },[open])

    const insets = useSafeAreaInsets() 

  return (
    <>
      {preAdd ? 

        <Modal animationType='slide' presentationStyle='pageSheet'>
          <View style={{ paddingTop: '10%', backgroundColor: 'rgb(23 23 23)', height: '100%', width: '100%'}}>
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: '5%', paddingTop: '10%',     width: '100%'}}>
                  <Pressable onPress={() => {
                    setPreAdd(false)
                    setDestination(null)
                    }}>
                  <FontAwesomeIcon icon={faXmark} color={'white'} size={30}/>
                  </Pressable>
              </View>
              <View style={{width: '100%', height: '95%', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 25, color: 'white', textAlign: 'center', fontWeight: '800', marginBottom: '10%'}}>Select folder to save to:</Text>

              <View style={{width: '100%', height: '55%'}}>
                        <ScrollView>
                        {currentUser.files.map((f, i) => {
                            return (
                                <Pressable key={i} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '5%'}} onPress={() => setDestination(f.id)}>
                                    <View style={f.id === destination ? {borderBottomWidth: 2, width: '85%', backgroundColor: 'white', display: 'flex', flexDirection: 'row', paddingLeft: '2.5%', paddingTop: '2%'} : {borderBottomWidth: 2, width: '85%', borderBottomColor: 'white', display: 'flex', flexDirection: 'row', paddingLeft: '2.5%', paddingTop: '2%'}}>
                                    <FontAwesomeIcon icon={faFolder} size={30} color={f.id === destination ? 'black' : 'white'}/>
                                    <Text style={f.id === destination ? {color: 'black', fontSize: 30, marginLeft: '5%'} : {color: 'white', fontSize: 30, marginLeft: '5%'}}>{f.fileName}</Text>
                                    </View>
                                </Pressable>)
                            }
                        )}
                        {/* 
                        
                            IF EVENTUALLY THE USER WILL BE ABLE TO MOVE A FILE TO THE HOMEPAGE, THIS IS WHERE THAT COULD WOULD BE

                        <Pressable style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '5%'}} onPress={() => setDestination('home')}>
                                <View style={destination === 'home' ? {borderBottomWidth: 2, width: '85%', backgroundColor: 'white', display: 'flex', flexDirection: 'row', paddingLeft: '2.5%', paddingTop: '2%'} : {borderBottomWidth: 2, width: '85%', borderBottomColor: 'white', display: 'flex', flexDirection: 'row', paddingLeft: '2.5%', paddingTop: '2%'}}>
                                <FontAwesomeIcon icon={faFolder} size={30} color={destination === 'home' ? 'black' : 'white'}/>
                                <Text style={destination === 'home' ? {color: 'black', fontSize: 30, marginLeft: '5%'} : {color: 'white', fontSize: 30, marginLeft: '5%'}}>Home</Text>
                                </View>
                            </Pressable> */}
                        </ScrollView>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                            <View style={{width: '50%',
                              borderColor: '#777',
                              borderRadius: 25,
                              backgroundColor: 'white',
                              borderWidth: 1,
                              paddingTop: '2%',
                              paddingBottom: '2%',
                              marginTop: '7%',
                              marginBottom: '10%',
                              marginLeft: '2%'}}>
                              <TouchableOpacity onPress={() => {
                                setPreAdd(false)
                                addToStorage()}} style={{
                              display: 'flex', 
                              flexDirection: 'row', 
                              width: '100%', 
                              justifyContent: 'center',
                              }}>
                                  <Text style={{fontSize: 15, color: 'black', fontWeight: '600'}}>Save to Folder</Text>
                              </TouchableOpacity>
                          </View>
                        </View>
                </View>
                <Text style={{color: 'white', fontSize: 20}}>Or</Text>
                <View style={{width: '50%',
                    borderColor: '#777',
                    borderRadius: 25,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    paddingTop: '2%',
                    paddingBottom: '2%',
                    marginTop: '10%',
                    marginBottom: '10%',
                    marginLeft: '2%'}}>
                    <TouchableOpacity onPress={() => {
                      setDestination(null)
                      addToStorage()
                      setPreAdd(false)
                    }} style={{
                    display: 'flex', 
                    flexDirection: 'row', 
                    width: '100%', 
                    justifyContent: 'center',
                    }}>
                        <Text style={{fontSize: 15, color: 'black', fontWeight: '600'}}>Save to staging</Text>
                    </TouchableOpacity>
                </View>


              </View>
          </View>
        </Modal>
        
      : <>
        <KeyboardAvoidingView behavior="padding">
            <TextInput onChangeText={(e) => setBody(e)}
                        value={body}
                        placeholder={'Add a note...'}
                        style={open ? {
                            backgroundColor: 'white',
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingTop: insets.top,
                            paddingBottom: insets.bottom,
                            fontSize: 18,
                            textAlignVertical: 'top',
                            width: '100%',
                            height: '75%'
                        } : {
                          backgroundColor: 'white',
                          paddingLeft: 10,
                          paddingRight: 10,
                          paddingTop: insets.top,
                          paddingBottom: insets.bottom,
                          fontSize: 18,
                          textAlignVertical: 'top',
                          width: '100%',
                          height: '100%'
                      }}
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
                  <TouchableOpacity onPress={() => setPreAdd(true)}>
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
        </>
      } 
    </>
  )
}

const styles = StyleSheet.create({
    /* noteBody: {
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        fontSize: 18,
        textAlignVertical: 'top',
        width: '100%',
        height: '75%'
    },
    noteBodyFull: {
      backgroundColor: 'white',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      fontSize: 18,
      textAlignVertical: 'top',
      width: '100%',
      height: '100%'
  }, */
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
      top: '85%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: '5%',
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
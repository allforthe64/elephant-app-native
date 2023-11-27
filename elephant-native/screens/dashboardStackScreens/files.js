import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

import { useState, useEffect } from 'react';

import { userListener, updateUser, getUser } from '../../storage';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';

import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Folder from '../../components/file_system/folder';
import { firebaseAuth } from '../../firebaseConfig';
import FocusedFolder from '../../components/file_system/focusedFolder';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBox, faFolder } from '@fortawesome/free-solid-svg-icons';
import Staging from '../../components/file_system/staging';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Files({navigation: { navigate }}) {

  //initialize state 
  const [currentUser, setCurrentUser] = useState()
  const [staging, setStaging] = useState([])
  const [stagingMode, setStagingMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [focusedFolder, setFocusedFolder] = useState()
  const [add, setAdd] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')


  //get the auth user context object
  const auth = firebaseAuth

  //get the current user 
  useEffect(() => {
    setLoading(true) //prevent component to attempting to render files/folders before they exist
    if (auth) {
      try {
        const getCurrentUser = async () => {
          const unsubscribe = await userListener(setCurrentUser, setStaging, auth.currentUser.uid)
    
          return () => unsubscribe()
        }
        getCurrentUser()
      } catch (err) {console.log(err)}
    } else console.log('no user yet')
    
  }, [auth])

  //once a current user has been pushed into state, allow component to render files/folders
  useEffect(() => {
    if (currentUser) setLoading(false)
  }, [currentUser])  

  //get the files and folders nested under a particular folder
  const getTargetFolder = (input) => {
    const targetFiles = currentUser.fileRefs.filter(file => {if(file.flag === input.id) return file})
    const targetFolders = currentUser.files.filter(file => {if(file.nestedUnder === input.id) return file})
    setFocusedFolder({folder: input, files: targetFiles, folders: targetFolders})
  }

  //function to handle editing the user
  const editUser = async (mode, input, index) => {
    if (mode === 'file') {
      if (index === 'delete' || index === 'rename' || index === 'move') {
        //update the user with the new file refs array sent through the input param
        const updatedUser = {...currentUser, fileRefs: input}
        await updateUser(updatedUser)
      }
    }
    else if (mode === 'folder') {
      //remove the file ref from the existing file refs and return the array
      //set the updatedUsers's fileref field to the newRefs array
      //update the user using the updatedUser object
      //reset the delete array
      if (index === 'delete') {
        const updatedUser = {...currentUser, files: input.newFolders, fileRefs: input.refsToKeep} 
        await updateUser(updatedUser)
      } else if (index === 'rename' || index === 'move') {
          //get index of the target folder to be renamed
          //edit the entry of the current files based on the index and preserve the order of the array
          //update the user
          const index = currentUser.files.map(file => file.id).indexOf(input.id)
          let newFiles = [...currentUser.files]
          newFiles[index] = input
          const updatedUser = {...currentUser, files: newFiles}
          await updateUser(updatedUser)
      } else if (index === 'add') {
        console.log('current user in function: ', currentUser)
        //add the new file to the user
        const newFiles = [...currentUser.files, input]
        const updatedUser = {...currentUser, files: newFiles}
        await updateUser(updatedUser)
      }
    }
  }

  //filter for all files that don't match the incoming file id
  const deleteFile = (target) => {
    const newFiles = currentUser.fileRefs.filter(file => {if (file.fileId !== target) return file})
    editUser('file', newFiles, 'delete')
  }

  //filter for all of the files that don't match the inoming file id, return the new file if the id is a match
  //input will contain fileRef object with the new filename
  const renameFile = (input) => {
    console.log(input)
    const newFiles = currentUser.fileRefs.map(file => {
      if (file.fileId === input.fileId) {return input} else return file
    })
    editUser('file', newFiles, 'rename')
  }
  
  //filter for all of the files that don't match the inoming file id, return the new file if the id is a match
  //input will contain fileRef object with new flag
  const moveFile = (input) => {
    const newFiles = currentUser.fileRefs.map(file => {
      if (file.fileId === input.fileId) {return input} else return file
    })
    editUser('file', newFiles, 'move')
  }

  //delete folder by filtering for folders that don't match the target
  //filter for all fileRefs that don't have a flag matching the target
  const deleteFolder = (target) => {
    const refsToKeep = currentUser.fileRefs.filter(ref => ref.flag !== target)
    const newFolders = currentUser.files.filter(file => file.id !== target)
    editUser('folder', {refsToKeep: refsToKeep, newFolders: newFolders}, 'delete')
  }

  //call the edit user function with a new folder object containing the new folder name
  const renameFolder = (target) => {
    editUser('folder', target, 'rename')
  }

  //call the edit user function with a new folder object containing the new folder nestedUnder property
  const moveFolder = (input) => {
    editUser('folder', input, 'move')
  }

  //add a folder
  const addFolder = (folderName, targetNest) => {
    //if the incoming targetNest is empty string, create the new folder under the home directory
    if (targetNest === '') {
      const newFile = {
        id: currentUser.files.length + 1,
        fileName: folderName,
        nestedUnder: ''
      }

      editUser('folder', newFile, 'add')
      setNewFolderName('')
      setAdd(false)
    } else {           //if the incoming targetNest has a value, create the new folder with the nestedUnder property set to targetNest
      const newFile = {
        id: currentUser.files.length + 1,
        fileName: folderName,
        nestedUnder: targetNest
      }

      editUser('folder', newFile, 'add')
    }
  }

  const insets = useSafeAreaInsets()

  return ( 
      <View style={styles.container}>
        <Image style={styles.bgImg} source={require('../../assets/elephant-dashboard.jpg')} />
        {!loading && currentUser ? 
          <View style={focusedFolder ? {
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, .8)',
            position: 'absolute',
            paddingTop: insets.top,
            paddingBottom: insets.bottom
            } : {
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, .8)',
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            position: 'absolute'
          }}>
              {focusedFolder ? <FocusedFolder folder={focusedFolder} renameFolder={renameFolder} moveFolder={moveFolder} addFolder={addFolder} deleteFolder={deleteFolder} folders={currentUser.files} clear={setFocusedFolder} getTargetFolder={getTargetFolder} deleteFile={deleteFile} renameFile={renameFile} moveFile={moveFile}/> 
              : stagingMode ? <Staging reset={setStagingMode} staging={staging} folders={currentUser.files} deleteFile={deleteFile} renameFile={renameFile} moveFile={moveFile}/> 
              :
              (
                  <View>
                    <View style={styles.header}>
                      <TouchableOpacity style={{display: 'flex', flexDirection: 'row'}} onPress={() => setStagingMode(true)}>
                        <Text style={styles.subheading}>Go To Staging</Text>
                        <FontAwesomeIcon icon={faBox} color='white' size={40}/>
                      </TouchableOpacity>
                    </View>
                    <View style={{height: '65%', marginBottom: '5%'}}>
                      <ScrollView>
                        {currentUser.files.map((file, i) => {
                          if (file.nestedUnder === '') {
                            return <Folder key={i + file.fileName} files={currentUser.files} renameFolder={renameFolder} pressable={true} moveFolderFunc={moveFolder} folders={currentUser.files} folder={file} getTargetFolder={getTargetFolder} deleteFolder={deleteFolder}/>
                          }
                        })}
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
                                  onPress={() => addFolder(newFolderName, '')}
                                >
                                    <Text style={{fontSize: 15, color: 'black', fontWeight: '600'}}>Save</Text>
                                </TouchableOpacity>
                        </View>
                      </View>
                    : 
                    <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                      <View style={{display: 'flex', flexDirection: 'row'}}>
                        <FontAwesomeIcon icon={faFolder} size={30} color='white'/>
                        <View style={{width: '50%',
                                  borderColor: '#777',
                                  borderRadius: 25,
                                  backgroundColor: 'white',
                                  borderWidth: 1,
                                  paddingTop: '2%',
                                  paddingBottom: '2%',
                                  marginBottom: '7%',
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
                      <View style={{width: '60%',
                                borderColor: '#777',
                                borderRadius: 25,
                                backgroundColor: 'white',
                                borderWidth: 1,
                                paddingTop: '2%',
                                paddingBottom: '2%',
                                paddingRight: '8%',
                                paddingLeft: '8%',
                                marginLeft: '2%'}}>
                          <TouchableOpacity onPress={() => navigate('Upload A File')} style={{
                                display: 'flex', 
                                flexDirection: 'row', 
                                width: '100%', 
                                justifyContent: 'space-around',
                              }}>
                              <FontAwesomeIcon icon={faFolder} size={20}/>
                              <Text style={{fontSize: 15, color: 'black', fontWeight: '600'}}>Get Document</Text>
                          </TouchableOpacity>
                      </View>
                    </View>
                    }
                  </View>
                )
              }
          </View>
                    
        : <>
            <Text style={{color: 'white'}}>Loading...</Text>
          </>
        }
      <StatusBar style="auto" />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigHeader: {
    color: 'white',
    fontSize: 40,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: '2.5%'
  },
  subheading: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 22,
    marginTop: 'auto',
    marginBottom: 'auto',
    marginRight: '2%'
  },
  header: {
    display: 'flex', 
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    width: '90%', 
    marginLeft: 'auto', 
    marginRight: 'auto',
    marginBottom: '10%',
  },
  wrapperContainer: {
    flex: 1,
    alignItems: 'center'
  },
  buttonWrapper: {
    paddingTop: '5%',
    width: '50%'
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: '50%'
  },
  bgImg: {
    objectFit: 'scale-down',
    opacity: .9,
  },
});
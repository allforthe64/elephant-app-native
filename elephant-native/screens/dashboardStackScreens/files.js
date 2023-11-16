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

export default function Files() {

  //initialize state 
  const [currentUser, setCurrentUser] = useState()
  const [staging, setStaging] = useState([])
  const [stagingMode, setStagingMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [focusedFolder, setFocusedFolder] = useState()
  const [add, setAdd] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')


  //get the auth user context object
  const {authUser} = useContext(AuthContext)

  //get the current user 
  useEffect(() => {
    setLoading(true) //prevent component to attempting to render files/folders before they exist
    if (authUser !== undefined) {
      try {
        const getCurrentUser = async () => {
          const unsubscribe = await userListener(setCurrentUser, setStaging, authUser)
    
          return () => unsubscribe()
        }
        getCurrentUser()
      } catch (err) {console.log(err)}
    } else console.log('no user yet')
    
  }, [authUser])

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

  const renameFile = (input) => {
    const newFiles = currentUser.fileRefs.map(file => {
      if (file.fileId === input.fileId) {return input} else return file
    })
    editUser('file', newFiles, 'rename')
  }
  
  const moveFile = (input) => {
    const newFiles = currentUser.fileRefs.map(file => {
      if (file.fileId === input.fileId) {return input} else return file
    })
    editUser('file', newFiles, 'move')
  }

  const deleteFolder = (target) => {
    const refsToKeep = currentUser.fileRefs.filter(ref => ref.flag !== target)
    const newFolders = currentUser.files.filter(file => file.id !== target)
    editUser('folder', {refsToKeep: refsToKeep, newFolders: newFolders}, 'delete')
  }

  const renameFolder = (target) => {
    editUser('folder', target, 'rename')
  }

  const moveFolder = (input) => {
    editUser('folder', input, 'move')
  }

  const addFolder = (folderName, targetNest) => {
    if (targetNest === '') {
      const newFile = {
        id: currentUser.files.length + 1,
        fileName: folderName,
        nestedUnder: ''
      }

      editUser('folder', newFile, 'add')
      setNewFolderName('')
      setAdd(false)
    } else {
      const newFile = {
        id: currentUser.files.length + 1,
        fileName: folderName,
        nestedUnder: targetNest
      }

      editUser('folder', newFile, 'add')
    }
  }

  return ( 
      <View style={styles.container}>
        <Image style={styles.bgImg} source={require('../../assets/elephant-dashboard.jpg')} />
        {!loading && currentUser ? 
          <View style={focusedFolder ? styles.focusedModal : styles.modal}>
              {focusedFolder ? <FocusedFolder folder={focusedFolder} renameFolder={renameFolder} moveFolder={moveFolder} addFolder={addFolder} deleteFolder={deleteFolder} folders={currentUser.files} clear={setFocusedFolder} getTargetFolder={getTargetFolder} deleteFile={deleteFile} renameFile={renameFile} moveFile={moveFile}/> 
              : stagingMode ? <Staging reset={setStagingMode} staging={staging}/> 
              :
              (
                  <View>
                    <View style={styles.header}>
                      <TouchableOpacity style={{display: 'flex', flexDirection: 'row'}} onPress={() => setStagingMode(true)}>
                        <Text style={styles.subheading}>Go To Staging</Text>
                        <FontAwesomeIcon icon={faBox} color='white' size={40}/>
                      </TouchableOpacity>
                    </View>
                    <View style={{height: '65%', marginBottom: '10%'}}>
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
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                      <FontAwesomeIcon icon={faFolder} size={30} color='white'/>
                      <View style={{width: '50%',
                                borderColor: '#777',
                                borderRadius: 25,
                                backgroundColor: 'white',
                                borderWidth: 1,
                                paddingTop: '2%',
                                paddingBottom: '2%',
                                marginBottom: '10%',
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
  modal: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, .8)',
    paddingTop: '5%',
    position: 'absolute'
  },
  focusedModal: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, .8)',
    position: 'absolute'
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
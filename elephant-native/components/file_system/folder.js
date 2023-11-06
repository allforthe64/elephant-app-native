import { StyleSheet, Text, View, TouchableOpacity, Modal, Pressable, TextInput } from 'react-native';
import React, {useState} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisVertical, faFolder, faXmark } from '@fortawesome/free-solid-svg-icons';

const Folder = ({folder, getTargetFolder, deleteFolder, renameFolder}) => {

  const [visible, setVisible] = useState(false)
  const [preDelete, setPreDelete] = useState(false)
  const [editName, setEditName] = useState(false)
  const [newName, setNewName] = useState(folder.fileName)

  //call the delete folder function from the main component and hide both modals
  const deleteFolderFunction = () => {
    deleteFolder(folder.id)
    setPreDelete(false)
    setVisible(false)
  }

  //pass an object containing data from the current file obj + the new filename to the main component 
  const handleNameChange = () => {
    const newFolder = {
      ...folder,
      fileName: newName
    }
    renameFolder(newFolder)
    setEditName(false)
  }

  return (
    <View style={{position: 'relative'}}>
      {visible ?
          <Modal animationType='slide' presentationStyle='pageSheet'>
              {preDelete ? 
                <Modal animationType='slide' presentationStyle='pageSheet' >
                    <View style={{height: '100%', width: '100%', backgroundColor: 'rgb(23 23 23)'}}>
                    
                      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: '5%', paddingTop: '10%', width: '100%'}}>
                        <Pressable onPress={() => setPreDelete(false)}>
                          <FontAwesomeIcon icon={faXmark} color={'white'} size={30}/>
                        </Pressable>
                      </View>
                    <View style={{width: '100%', height: '95%', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{fontSize: 22, color: 'white', textAlign: 'center'}}>Are you sure you want to delete {folder.fileName} and all of its contents?</Text>

                      <View style={{width: '50%',
                            borderRadius: 25,
                            backgroundColor: 'red',
                            paddingTop: '2%',
                            paddingBottom: '2%',
                            marginTop: '10%',
                            marginLeft: '2%'}}>
                        <TouchableOpacity onPress={deleteFolderFunction} style={{
                          display: 'flex', 
                          flexDirection: 'row', 
                          width: '100%', 
                          justifyContent: 'center',
                        }}>
                            <Text style={{fontSize: 15, color: 'white', fontWeight: '600'}}>Delete</Text>
                        </TouchableOpacity>
                      </View>

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
                        <TouchableOpacity onPress={() => setPreDelete(false)} style={{
                          display: 'flex', 
                          flexDirection: 'row', 
                          width: '100%', 
                          justifyContent: 'center',
                        }}>
                            <Text style={{fontSize: 15, color: 'black', fontWeight: '600'}}>Cancel</Text>
                        </TouchableOpacity>
                      </View>


                    </View>
                  </View>
                </Modal>
                : 
                  <View style={{ paddingTop: '10%', backgroundColor: 'rgb(23 23 23)', height: '100%'}}>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: '5%'}}>
                      <Pressable onPress={() => {
                          setEditName(false)
                          setVisible(false)
                        }}>
                        <FontAwesomeIcon icon={faXmark} color={'white'} size={30}/>
                      </Pressable>
                    </View>
                    {editName ? <>
                        <TextInput value={newName} style={{color: 'white', fontSize: 40, fontWeight: 'bold', borderBottomColor: 'white', borderBottomWidth: 2, width: '80%', marginTop: '5%', marginLeft: '5%'}} onChangeText={(e) => setNewName(e)} autoFocus/>
                        <View style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginTop: '4%'}}>
                          <View style={{width: '40%',
                            borderColor: '#777',
                            borderRadius: 25,
                            backgroundColor: 'white',
                            borderWidth: 1,
                            paddingTop: '2%',
                            paddingBottom: '2%',
                            marginTop: '7%',
                            marginBottom: '10%',
                            marginLeft: '2%'}}>
                            <TouchableOpacity onPress={handleNameChange} style={{
                              display: 'flex', 
                              flexDirection: 'row', 
                              width: '100%', 
                              justifyContent: 'center',
                            }}>
                                <Text style={{fontSize: 15, color: 'black', fontWeight: '600'}}>Save</Text>
                            </TouchableOpacity>
                          </View>

                          <View style={{width: '40%',
                            borderColor: '#777',
                            borderRadius: 25,
                            backgroundColor: 'white',
                            borderWidth: 1,
                            paddingTop: '2%',
                            paddingBottom: '2%',
                            marginTop: '7%',
                            marginBottom: '10%',
                            marginLeft: '2%'}}>
                            <TouchableOpacity onPress={() => setEditName(false)} style={{
                              display: 'flex', 
                              flexDirection: 'row', 
                              width: '100%', 
                              justifyContent: 'center',
                            }}>
                                <Text style={{fontSize: 15, color: 'black', fontWeight: '600'}}>Cancel</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                    </> 
                    :
                      <View style={{paddingLeft: '5%'}}>
                        <Text style={{fontSize: 40, fontWeight: 'bold', color: 'white', marginTop: '5%'}}>{folder.fileName}</Text>
                        <TouchableOpacity style={{ marginTop: '10%'}} onPress={() => setEditName(true)}>
                          <Text style={{fontSize: 20, color: 'white'}}>Rename Folder</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginTop: '10%'}}>
                          <Text style={{fontSize: 20, color: 'white'}}>Move Folder To...</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginTop: '10%'}} onPress={() =>
                          setPreDelete(true)}>
                          <Text style={{fontSize: 20, color: 'red'}}>Delete Folder</Text>
                        </TouchableOpacity>
                      </View>
                    }
                  </View>
                }
          </Modal>
      : <></>}
      <View style={visible ? styles.folderVisibleMenu : styles.folder}>
        <TouchableOpacity onPress={() => getTargetFolder(folder)} style={{width: '85%'}}>
            <View style={styles.folderTitle}>
                <FontAwesomeIcon icon={faFolder} color={'white'} size={32} />
                <Text style={styles.folderName}>{folder.fileName}</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setVisible(prev => !prev)} style={visible ? {backgroundColor: 'rgba(38, 38, 38, .75)', width: '15%', display: 'flex', justifyContent: 'center', paddingBottom: '1%', flexDirection: 'row'} : {width: '15%', display: 'flex', justifyContent: 'center', flexDirection: 'row', paddingBottom: '1%'}}>
          <FontAwesomeIcon icon={faEllipsisVertical} size={26} color={'white'} style={styles.folderArrow}/>
        </TouchableOpacity>
    </View>
    </View>
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
    folderVisibleMenu: {
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
      marginLeft: '5%'
    },
    folderArrow: {
    marginTop: 'auto'
    }
})
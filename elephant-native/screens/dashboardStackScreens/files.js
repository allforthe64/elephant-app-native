import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/authContext';

import { userListener } from '../../storage';

import { ScrollView } from 'react-native-gesture-handler';
import Folder from '../../components/file_system/folder';
import { firebaseAuth } from '../../firebaseConfig';
import FocusedFolder from '../../components/file_system/focusedFolder';

export default function Files() {

  //initialize state 
  const [currentUser, setCurrentUser] = useState()
  const [staging, setStaging] = useState([])
  const [loading, setLoading] = useState(true)
  const [focusedFolder, setFocusedFolder] = useState()

  //get the auth user context object
  const auth = firebaseAuth

  //get the current user 
  useEffect(() => {
    setLoading(true) //prevent component to attempting to render files/folders before they exist
    const getCurrentUser = async () => {
      const unsubscribe = await userListener(setCurrentUser, setStaging, auth.currentUser)

      return () => unsubscribe()
    }
    getCurrentUser()
  }, [])

  //once a current user has been pushed into state, allow component to render files/folders
  useEffect(() => {
    if (currentUser) setLoading(false)
  }, [currentUser]) 

  const getTargetFolder = (targetName, nested) => {
    const targetFiles = currentUser.fileRefs.filter(file => {if(file.flag === targetName) return file})
    const targetFolders = currentUser.files.filter(file => {if(file.nestedUnder === targetName) return file})
    setFocusedFolder({name: targetName, files: targetFiles, folders: targetFolders})
  }

  console.log('current user: ', auth.currentUser)

  return ( 
      <View style={styles.container}>
        <Image style={styles.bgImg} source={require('../../assets/elephant-dashboard.jpg')} />
        {!loading ? 
          <View style={focusedFolder ? styles.focusedModal : styles.modal}>
              {focusedFolder ? <FocusedFolder folder={focusedFolder} clear={setFocusedFolder} getTargetFolder={getTargetFolder}/> 
              : (
                  <View>
                    <ScrollView>
                      {currentUser.files.map((file, i) => {
                        if (file.nestedUnder === '') {
                          return <Folder key={i + file.fileName} pressable={true} folderName={file.fileName} getTargetFolder={getTargetFolder}/>
                        }
                      })}
                    </ScrollView>
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
    paddingTop: '30%',
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
    fontSize: 18
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
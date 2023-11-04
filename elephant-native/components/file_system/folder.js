import { StyleSheet, Text, View, TouchableOpacity, Modal, Pressable } from 'react-native';
import React, {useState} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisVertical, faFolder, faXmark } from '@fortawesome/free-solid-svg-icons';

const Folder = ({folder, getTargetFolder}) => {

  const [visible, setVisible] = useState(false)

  return (
    <View style={{position: 'relative'}}>
      {visible ?
      <View style={{width: '90%', marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', position: 'absolute', top: '55%', right: '5%', zIndex: 10}}>
          <Modal animationType='slide' presentationStyle='pageSheet'>
            <View style={{ paddingTop: '10%', backgroundColor: 'rgb(23 23 23)', paddingLeft: '5%', height: '100%', borderWidth: 1, borderColor: 'red'}}>
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: '5%'}}>
                <Pressable onPress={() => setVisible(false)}>
                  <FontAwesomeIcon icon={faXmark} color={'white'} size={30}/>
                </Pressable>
              </View>
              <Text style={{fontSize: '40px', fontWeight: 'bold', color: 'white', marginTop: '5%'}}>{folder.fileName}</Text>
              <TouchableOpacity style={{ marginTop: '10%'}}>
                <Text style={{fontSize: '20px', color: 'white'}}>Rename Folder</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginTop: '10%'}}>
                <Text style={{fontSize: '20px', color: 'white'}}>Delete Folder</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginTop: '10%'}}>
                <Text style={{fontSize: '20px', color: 'white'}}>Move Folder To...</Text>
            </TouchableOpacity>
            </View>
          </Modal>
      </View>
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
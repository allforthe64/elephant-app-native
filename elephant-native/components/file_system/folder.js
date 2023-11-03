import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, {useState} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisVertical, faFolder } from '@fortawesome/free-solid-svg-icons';

const Folder = ({folder, getTargetFolder, pressable}) => {

  const [visible, setVisible] = useState(false)

  return (
    <View>
      <View style={visible ? styles.folderVisibleMenu : styles.folder}>
        <TouchableOpacity onPress={() => getTargetFolder(folder)} style={{width: '95%'}}>
            <View style={styles.folderTitle}>
                <FontAwesomeIcon icon={faFolder} color={'white'} size={32} />
                <Text style={styles.folderName}>{folder.fileName}</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setVisible(prev => !prev)}>
          <FontAwesomeIcon icon={faEllipsisVertical} size={26} color={'white'} style={styles.folderArrow}/>
        </TouchableOpacity>
    </View>
    {visible ?
      <View style={{width: '90%', height: 100, marginLeft: 'auto', marginRight: 'auto', borderWidth: 2, borderColor: 'red', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', position: 'fixed'}}>
          <View style={{position: 'absolute', width: '50%', height: '100%', backgroundColor: 'white'}}>
            <Text>Rename Folder</Text>
            <Text>Delete Folder</Text>
            <Text>Move Folder To</Text>
          </View>
      </View>
      : <></>}
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
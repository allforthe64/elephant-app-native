import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faMicrophone, faQrcode, faPencil, faFolder, faFile } from '@fortawesome/free-solid-svg-icons';

export default function DashCollectContainer({ navigate }) {

  return (
        <View style={styles.container}>

            <View style={styles.column}>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => navigate('Add Local File')} style={{display: 'flex', flexDirection: 'row'}}>
                        <FontAwesomeIcon icon={faFolder} size={30}/>
                        <Text style={styles.input}>Get Document</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => navigate('Camera')} style={{display: 'flex', flexDirection: 'row'}}>
                    <FontAwesomeIcon icon={faCamera} size={30}/>
                        <Text style={styles.input}>Camera</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => navigate('Record Audio')} style={{display: 'flex', flexDirection: 'row'}}>
                    <FontAwesomeIcon icon={faMicrophone} size={30}/>
                        <Text style={styles.input}>Record Audio</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => navigate('QR Scanner')} style={{display: 'flex', flexDirection: 'row'}}>
                    <FontAwesomeIcon icon={faQrcode} size={30}/>
                        <Text style={styles.input}>QR Scanner</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => navigate('Notepad')} style={{display: 'flex', flexDirection: 'row'}}>
                    <FontAwesomeIcon icon={faPencil} size={30}/>
                        <Text style={styles.input}>Notepad</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => navigate('Scan Document')} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                    <FontAwesomeIcon icon={faFile} size={30}/>
                        <Text style={styles.input}>Scan Document</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </View>
    
  );
}

const styles = StyleSheet.create({

  container: {
    height: '40%',
    display: 'flex',
    flexDirection: 'row', 
    justifyContent: 'space-around'
  },
  column: {
    width: '85%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },    
  bigHeader: {
    color: 'white',
    fontSize: 45,
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 25,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '2%',
    paddingBottom: '2%'
  },
  input: {
    /* padding: 8, */
    textAlign: 'center',
    fontSize: 20,
    paddingTop: '1%',
    marginLeft: '5%'
  }
});
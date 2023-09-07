import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faMicrophone, faQrcode, faPencil, faFile, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function DashCollectContainer({ navigate }) {

  return (
        <View style={styles.container}>

            <View style={styles.column}>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => navigate('Files')}>
                        <FontAwesomeIcon icon={faFile} size={50} style={{marginLeft: '25%'}}/>
                        <Text style={styles.input}>Add Local File</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => navigate('Camera')}>
                    <FontAwesomeIcon icon={faCamera} size={50} style={{marginLeft: '10%'}}/>
                        <Text style={styles.input}>Camera</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => navigate('Files')}>
                    <FontAwesomeIcon icon={faMicrophone} size={50} style={{marginLeft: '28%'}}/>
                        <Text style={styles.input}>Audio recorder</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={styles.column}>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => navigate('Files')}>
                    <FontAwesomeIcon icon={faQrcode} size={50} style={{marginLeft: '33%'}}/>
                        <Text style={styles.input}>Qr Code Scanner</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => navigate('Notepad')}>
                    <FontAwesomeIcon icon={faPencil} size={50} style={{marginLeft: '13%'}}/>
                        <Text style={styles.input}>Notepad</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => navigate('Files')}>
                    <FontAwesomeIcon icon={faEnvelope} size={50} style={{marginLeft: '33%'}}/>
                        <Text style={styles.input}>Connect to Email</Text>
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
    width: '45%',
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
    paddingTop: '3%'
  },
  input: {
    padding: 8,
    width: 'full',
    textAlign: 'center',
    fontSize: 20,
  }
});
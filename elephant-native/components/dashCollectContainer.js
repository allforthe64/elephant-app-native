import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faMicrophone, faQrcode, faPencil, faFolder, faFile } from '@fortawesome/free-solid-svg-icons';

export default function DashCollectContainer({ navigate }) {

  return (
        <View style={styles.container}>

            <View style={styles.column}>
                <View style={styles.buttonWrapper}>
                  <TouchableOpacity onPress={() => navigate('Camera')} style={{display: 'flex', flexDirection: 'row'}}>
                      <FontAwesomeIcon icon={faCamera} size={50} />
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => navigate('Record Audio')} style={{display: 'flex', flexDirection: 'row'}}>
                      <FontAwesomeIcon icon={faMicrophone} size={50}/>
{/*                         <Text style={styles.input}>Record Audio</Text> */}
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => navigate('QR Scanner')} style={{display: 'flex', flexDirection: 'row'}}>
                      <FontAwesomeIcon icon={faQrcode} size={50}/>
                        {/* <Text style={styles.input}>QR Scanner</Text> */}
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => navigate('Notepad')} style={{display: 'flex', flexDirection: 'row'}}>
                      <FontAwesomeIcon icon={faPencil} size={50}/>
                        {/* <Text style={styles.input}>Notepad</Text> */}
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => navigate('Scan Document')} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                      <FontAwesomeIcon icon={faFile} size={50}/>
                        {/* <Text style={styles.input}>Scan Document</Text> */}
                    </TouchableOpacity>
                </View>
            </View>
            
        </View>
    
  );
}

const styles = StyleSheet.create({

  container: {
    height: '100%',
    width: '20%',
    display: 'flex',
    flexDirection: 'row', 
  },
  column: {
    width: '100%',
    paddingTop: '2%',
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
  buttonWrapper: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    /* padding: 8, */
    textAlign: 'center',
    fontSize: 20,
    paddingTop: '1%',
    marginLeft: '5%'
  }
});
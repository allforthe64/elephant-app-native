import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { firebaseAuth } from '../../firebaseConfig';
import DashCollectContainer from '../../components/dashCollectContainer';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

export default function DashMain({navigation: { navigate }}) {

  const auth = firebaseAuth
  const {authUser} = useContext(AuthContext)

  if (!authUser) {
    navigate('Home')
  }

  try {
    fetch('http://192.168.1.60:3000/api/hello').then(res => res.json()).then(data => console.log(data.message))
  } catch (err) {
    console.log(err)
  }

  return (
    <View>
        <Image style={styles.bgImg} source={require('../../assets/elephant-dashboard.jpg')} />
        <View style={styles.buttonContainer}>
            
              <View style={styles.buttonWrapper}>
                <TouchableOpacity onPress={() => navigate('Files')} style={styles.file}>
                    <Text style={styles.input}>My Files</Text>
                    <FontAwesomeIcon icon={faFolder} size={18} style={{marginLeft: '3%', marginTop: '1%'}}/>
                </TouchableOpacity>
              </View>

            <Text style={styles.subheading}>Collect Data:</Text>
            <DashCollectContainer navigate={navigate}/>

            <View style={styles.wrapperContainer}>
              <View style={styles.buttonWrapperLogout}>
                    <TouchableOpacity onPress={async () => {
                      auth.signOut()
                      await AsyncStorage.setItem('loggedIn', JSON.stringify(false))
                      navigate('Home')
                      }}>
                        <Text style={styles.inputLogout}>Sign Out</Text>
                    </TouchableOpacity>
              </View>
            </View>
        </View>
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
  buttonContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, .6)',
    paddingTop: '5%',
    position: 'absolute',
    display: 'flex',
  },
  bigHeader: {
    color: 'white',
    fontSize: 45,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: '5%'
  },
  subheading: {
    color: 'white',
    textAlign: 'center',
    fontSize: 35,
    fontWeight: '600',
    marginBottom: '5%'
  },
  wrapperContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: '10%'
  },
  buttonWrapper: {
    width: '50%',
    borderColor: '#777',
    borderRadius: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    paddingTop: '2%',
    paddingBottom: '2%',
    marginTop: '10%',
    marginBottom: '10%',
    marginLeft: '2%'
  },
  buttonWrapperLogout: {
    width: '75%',
    borderRadius: 25,
    backgroundColor: 'red',
    borderWidth: 1,
    paddingTop: '2%',
    paddingBottom: '2%',
  },
  input: {
    textAlign: 'left',
    fontSize: 18,
    marginRight: '3%'
  },
  inputLogout: {
    textAlign: 'center',
    fontSize: 18,
    width: '100%',
    color: 'white'
  },
  file: {
    display: 'flex', 
    flexDirection: 'row', 
    width: '100%', 
    justifyContent: 'center'},
  bgImg: {
    objectFit: 'scale-down',
    opacity: .9,
  },
});
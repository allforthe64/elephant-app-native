import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { firebaseAuth } from '../../firebaseConfig';
import DashCollectContainer from '../../components/dashCollectContainer';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFolder, faCamera } from '@fortawesome/free-solid-svg-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashMain({navigation: { navigate }}) {

  const auth = firebaseAuth

  //if the user is not logged in, take them back to the homepage
  useEffect(() => {
    if (!auth.currentUser) {
      navigate('Home')
    }
  }, [])

  const insets = useSafeAreaInsets()

  console.log(auth.currentUser)

  return (
    <View>
        <Image style={styles.bgImg} source={require('../../assets/elephant-dashboard.jpg')} />
        <View style={styles.buttonContainer}>
          <View style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: '5%', paddingTop: insets.top, paddingBottom: insets.bottom}}>
              <View style={{width: '21%', backgroundColor: 'white', paddingTop: '3%', paddingBottom: '3%', borderRadius: 1000}}>
                <TouchableOpacity onPress={() => navigate('Camera')} style={styles.file}>
                    <FontAwesomeIcon icon={faCamera} size={50} />
                </TouchableOpacity>
              </View>
          </View>

            <Text style={styles.subheading}>Collect Other Data:</Text>
            <DashCollectContainer navigate={navigate}/>


            <View style={styles.wrapperContainer}>
              <View style={styles.buttonWrapper}>
                <TouchableOpacity onPress={() => navigate('Files')} style={styles.file}>
                    <Text style={styles.input}>My Files</Text>
                    <FontAwesomeIcon icon={faFolder} size={30} style={{marginLeft: '3%', marginTop: '1%'}}/>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonWrapperLogout}>
                    <TouchableOpacity onPress={async () => {
                      auth.signOut()
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
    marginBottom: '10%'
  },
  wrapperContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingTop: '5%'
  },
  buttonWrapper: {
    width: '80%',
    borderColor: '#777',
    borderRadius: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    paddingTop: '2%',
    paddingBottom: '2%',
    marginTop: '10%',
    marginBottom: '8%',
    marginLeft: '2%'
  },
  buttonWrapperLogout: {
    width: '45%',
    borderRadius: 25,
    backgroundColor: 'red',
    borderWidth: 1,
    paddingTop: '2%',
    paddingBottom: '2%',
  },
  input: {
    textAlign: 'left',
    fontSize: 26,
    fontWeight: '500',
    marginRight: '3%'
  },
  inputLogout: {
    textAlign: 'center',
    fontSize: 12,
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
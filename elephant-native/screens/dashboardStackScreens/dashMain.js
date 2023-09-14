import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { firebaseAuth } from '../../firebaseConfig';
import DashCollectContainer from '../../components/dashCollectContainer';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';

export default function DashMain({navigation: { navigate }}) {

  const auth = firebaseAuth
  const {authUser} = useContext(AuthContext)

  if (!authUser) {
    navigate('Home')
  }

  return (
    <View>
        <Image style={styles.bgImg} source={require('../../assets/elephant-dashboard.jpg')} />
        <View style={styles.buttonContainer}>
          <Text style={styles.bigHeader}>Welcome to your dashboard</Text>
            <Text style={styles.subheading}>Collect Data:</Text>
            <DashCollectContainer navigate={navigate}/>
            <View style={styles.wrapperContainer}>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity onPress={() => navigate('Files')}>
                        <Text style={styles.input}>View Your Files</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapperLogout}>
                    <TouchableOpacity onPress={() => {
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
    paddingTop: '5%',
    position: 'absolute'
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
    fontWeight: '600'
  },
  wrapperContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: '10%'
  },
  buttonWrapper: {
    width: '45%',
    borderColor: '#777',
    borderRadius: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    paddingTop: '2%',
    paddingBottom: '2%',
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
    textAlign: 'center',
    fontSize: 18,
    width: '100%',
  },
  inputLogout: {
    textAlign: 'center',
    fontSize: 18,
    width: '100%',
    color: 'white'
  },
  bgImg: {
    objectFit: 'scale-down',
    opacity: .9,
  },
});
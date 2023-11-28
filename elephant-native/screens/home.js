import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Home({navigation}) {

  const [persist, setPersist] = useState()

  /* useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const loggedIn = await AsyncStorage.getItem('loggedIn')
      console.log('logged in: ', loggedIn)
      loggedIn !== 'false' ? setPersist(true) : setPersist(false)
    });

    return unsubscribe;
  }, [navigation]); */

  if (persist) {
    navigation.navigate('Dashboard')
  }

  const insets = useSafeAreaInsets()

  return (
      <View style={{
        flex: 1,
        backgroundColor: 'rgb(0, 0, 0)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: insets.top,
        paddingBottom: insets.bottom
      }}>
        <Image source={require('../assets/elephant-home.jpg')} style={styles.bgImg}/>
        <View style={styles.modal}>
          <Text style={styles.bigHeader}>Welcome to My Elephant App</Text>
          <Text style={styles.subheading}>Take control of your personal data</Text>
          <View style={styles.wrapperContainer}>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity onPress={() => navigation.navigate('Sign In/Sign Up')}>
                <Text style={styles.input}>Sign In/Sign Up</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity onPress={() => navigation.navigate('About')}>
                <Text style={styles.input}>More About Us</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{color: 'white', textAlign: 'center', width: '90%', marginBottom: '15%'}}>*A portion of all proceeds generated by My Elephant App will be donated to saving endangered Elephants around the globe</Text>  
        </View>
        <StatusBar style="auto" />
      </View>
  );
}

const styles = StyleSheet.create({
  bgImg: {
    objectFit: 'scale-down',
    opacity: .6
  },
  modal: {
    width: '90%',
    height: '60%',
    backgroundColor: 'rgba(0, 0, 0, .65)',
    paddingTop: '20%',
    paddingBottom: 10,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  bigHeader: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: '2.5%'
  },
  subheading: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: '6%'
  },
  wrapperContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%'
  },
  buttonWrapper: {
    width: '60%',
    borderColor: '#777',
    borderRadius: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    paddingTop: '2%',
    paddingBottom: '2%',
    marginTop: '5%'
  },
  input: {
    textAlign: 'center',
    fontSize: 14,
    width: '100%',
  }
});

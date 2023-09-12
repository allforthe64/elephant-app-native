import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';

export default function Home({navigation: { navigate }}) {

  const [clicked, setClicked] = useState('Not Clicked')

  const testHandler = () => {
    clicked === 'Not Clicked' ? setClicked('Clicked') : setClicked('Not Clicked')
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/elephant-home.jpg')} style={styles.bgImg}/>
      <View style={styles.modal}>
        <Text style={styles.bigHeader}>Welcome to My Elephant App</Text>
        <Text style={styles.subheading}>Take control of your personal data</Text>
        <View style={styles.wrapperContainer}>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={() => navigate('Sign In/Sign Up')}>
              <Text style={styles.input}>Sign In/Sign Up</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={() => navigate('About')}>
              <Text style={styles.input}>More About Us</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={{color: 'white', textAlign: 'center', width: '90%', marginBottom: '2%'}}>*A portion of all proceeds generated by My Elephant App will be donated to saving endangered Elephants around the globe</Text>  
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(0, 0, 0)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgImg: {
    objectFit: 'scale-down',
    opacity: .6
  },
  modal: {
    width: '90%',
    height: '75%',
    backgroundColor: 'rgba(0, 0, 0, .65)',
    paddingTop: '30%',
    paddingBottom: 10,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
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
    fontSize: 20,
    marginBottom: '10%'
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
    marginTop: '10%'
  },
  input: {
    textAlign: 'center',
    fontSize: 18,
    width: '100%',
  }
});

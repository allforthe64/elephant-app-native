import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image } from 'react-native';
import ContactForm from '../components/contact-form';
import { useState } from 'react';

export default function Contact({navigation: { navigate }}) {

  const [clicked, setClicked] = useState('Not Clicked')

  const testHandler = () => {
    clicked === 'Not Clicked' ? setClicked('Clicked') : setClicked('Not Clicked')
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/elephant-about.jpg')} style={styles.bgImg}/>
      <View style={styles.modal}>
        <ContactForm navigateFunc={navigate}/>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(0, 0, 0)'
  },
  modal: {
    width: '90%',
    backgroundColor: 'rgba(0, 0, 0, .5)',
    position: 'absolute',
    padding: 10
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
    paddingTop: '5%',
    width: '50%'
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: '50%'
  },
  bgImg: {
    objectFit: 'scale-down',
    opacity: .4,
  },
});
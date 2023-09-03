import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

export default function About({navigation: { navigate }}) {

  const [clicked, setClicked] = useState('Not Clicked')

  const testHandler = () => {
    clicked === 'Not Clicked' ? setClicked('Clicked') : setClicked('Not Clicked')
  }

  return (
    <ScrollView>
      <View style={styles.hero}>
        <Image source={require('../assets/elephant-about.jpg')} style={styles.bgImg}/>
        <View style={styles.heroModal}>
          <Text style={styles.bigHeader}>Welcome to My Elephant App (About Page)</Text>
        </View>
        <StatusBar style="auto" />
      </View>
      <View style={styles.container}>
      <View style={styles.wrapperContainer}>
          <Text style={styles.buttonHeading}>Ready To Get Started?</Text>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={() => navigate('Home')}>
              <Text style={styles.input}>Back To Home</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.buttonHeading1}>Want To Learn More?</Text>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity /* onPress={() => navigate('About')} */>
              <Text style={styles.input}>See How It Works</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    backgroundColor: 'rgb(0, 0, 0)',
    alignItems: 'center',
    justifyContent: 'center',
    height: 600,
    borderWidth: 2
  },
  heroModal: {
    width: '90%',
    height: '75%',
    backgroundColor: 'rgba(0, 0, 0, .5)',
    paddingTop: '30%',
    position: 'absolute'
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
    fontSize: 18
  },
  wrapperContainer: {
    flex: 1,
    alignItems: 'center'
  },
  buttonWrapper: {
    paddingTop: '3%',
    width: '60%'
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: '50%',
    backgroundColor: 'white',
    width: 'full',
    textAlign: 'center',
    fontSize: 18
  },
  bgImg: {
    objectFit: 'scale-down',
    opacity: .4,
  },


  container: {
    backgroundColor: 'rgb(41 37 36)',
    height: 500
  },
  buttonHeading: {
    fontSize: 30,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: '4%'
  },
  buttonHeading1: {
    fontSize: 30,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: '10%'
  }
});
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Touchable } from 'react-native';
import Accordion from '../components/accordion';

export default function About({navigation: { navigate }}) {

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
      <View style={{paddingLeft: '4%', paddingRight: '4%', marginBottom: 50}}>
        <Accordion />
      </View>
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
  },
  bgImg: {
    objectFit: 'scale-down',
    opacity: .4,
  },

  container: {
    backgroundColor: 'rgb(23 23 23)',
    paddingBottom: 50,
    paddingTop: 50
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
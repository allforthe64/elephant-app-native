import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useState } from 'react';

export default function App() {

  const [clicked, setClicked] = useState('Not Clicked')

  const testHandler = () => {
    clicked === 'Not Clicked' ? setClicked('Clicked') : setClicked('Not Clicked')
  }

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.bigHeader}>Welcome to My Elephant App</Text>
        <Text style={styles.subheading}>Take control of your personal data</Text>
        <View style={styles.wrapperContainer}>
          <View style={styles.buttonWrapper}>
            <Button title={'Sign In/Sign Up'} onPress={() => testHandler()}/>
          </View>
          <View style={styles.buttonWrapper}>
            <Button title={'Sign In/Sign Up'}/>
          </View>
        </View>
        <Text style={{color: 'white'}}>{clicked}</Text>  
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
  },
  modal: {
    width: '85%',
    height: '60%',
    backgroundColor: 'rgba(0, 0, 0, .5)',
    paddingTop: '30%'
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
    paddingTop: '5%',
    width: '50%'
  }
});

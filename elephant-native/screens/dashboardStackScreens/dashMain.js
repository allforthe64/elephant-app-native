import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';

export default function DashMain({navigation: { navigate }}) {

  return (
    <View>
        <ScrollView /* style={styles.container} */>
      <Image style={styles.bgImg} source={require('../../assets/elephant-dashboard.jpg')} />
      <View style={styles.fileContainer}>
        <Text style={styles.bigHeader}>Welcome to My Elephant App (Dashboard)</Text>
        <Text style={styles.bigHeader}>Welcome to My Elephant App (Dashboard)</Text>
        <Text style={styles.bigHeader}>Welcome to My Elephant App (Dashboard)</Text>
        <Text style={styles.bigHeader}>Welcome to My Elephant App (Dashboard)</Text>
        <Text style={styles.bigHeader}>Welcome to My Elephant App (Dashboard)</Text>
      </View>
      <StatusBar style="auto" />
    </ScrollView>
    <View style={styles.buttonWrapper}>
        <TouchableOpacity onPress={() => navigate('Collect Data')}>
            <Text style={styles.input}>Collect Data</Text>
        </TouchableOpacity>
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
  fileContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, .6)',
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
    position: 'absolute',
    bottom: '5%',
    alignSelf: 'flex-end',
    width: '50%'
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    backgroundColor: 'white',
    width: 'full',
    textAlign: 'center',
    fontSize: 15,
    borderRadius: 25
  },
  bgImg: {
    objectFit: 'scale-down',
    opacity: .9,
  },
});
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';

export default function CollectData() {

  return (
    <View style={styles.container}>
      <Image style={styles.bgImg} source={require('../../assets/elephant-dashboard.jpg')} />
      <View style={styles.modal}>
        <Text style={styles.bigHeader}>Welcome to My Elephant App (Collect Data)</Text>
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
    opacity: .9,
  },
});
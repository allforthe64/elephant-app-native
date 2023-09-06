import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import DashCollectContainer from '../../components/dashCollectContainer';

export default function DashMain({navigation: { navigate }}) {

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
    opacity: .9,
  },
});
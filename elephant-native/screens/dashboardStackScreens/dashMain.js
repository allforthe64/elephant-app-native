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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: '10%'
  },
  buttonWrapper: {
    width: '80%'
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    backgroundColor: 'white',
    width: 'full',
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 25
  },
  bgImg: {
    objectFit: 'scale-down',
    opacity: .9,
  },
});
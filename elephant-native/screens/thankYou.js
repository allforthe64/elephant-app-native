import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const ThankYou = ({navigation: {navigate}}) => {
  return (
    <View style={styles.container}>
      <Image style={styles.bgImg } source={require('../assets/elephant-dashboard.jpg')} />
      <View style={styles.innerContainer}>
        <Text style={styles.bigHeader}>Thanks for registering!</Text>
        <Text style={styles.subheading}>We've sent you a welcome email, so be sure to check your inbox &#40;and your spam too :0&#41;</Text>
        <View style={styles.wrapperContainer}>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity onPress={() => navigate('Sign In/Sign Up')} >
                    <Text style={styles.input}>Return to login</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
  )
}

export default ThankYou

const styles = StyleSheet.create({
    bigHeader: {
        color: 'white',
        fontSize: 30,
        textAlign: 'center',
        fontWeight: '700',
        marginBottom: '8%'
    },

    subheading: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
        width: '90%',
        fontWeight: '500',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(23,23,23)',
        height: '100%'
    },
    innerContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        paddingTop: '10%',
        paddingBottom: '10%'
    },
    bgImg: {
        objectFit: 'scale-down',
        opacity: .15,
        transform: [{scaleX: -1}]
    },
    wrapperContainer: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginBottom: '5%'
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
})
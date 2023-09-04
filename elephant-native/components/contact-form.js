import React, {useState, useEffect} from 'react'
import {View, ScrollView, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native'
import email from 'react-native-email'

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

const ContactForm = () => {

  const [fName, setfName] = useState('')
  const [lName, setlName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [position, setPosition] = useState('')
  const [message, setMessage] = useState('')
  const [validEmail, setValidEmail] = useState(null)
  const [validPhone, setValidPhone] = useState(null)

  //run regex check on email input
  useEffect(() => {
    const emailResult = EMAIL_REGEX.test(email)
    setValidEmail(emailResult)
  }, [email])

  //run regex check on phone input
  useEffect(() => {
    const phoneResult = PHONE_REGEX.test(phone)
    setValidPhone(phoneResult)
  }, [phone])

  const sendEmail = () => {

    if (!validEmail || !validPhone || email === '' || phone === '') {
      return false
    }

    console.log('running')

    const to = ['williamhrainey@gmail.com'] // string or array of email addresses
        email(to, {
            // Optional additional arguments
            subject: 'Show how to use',
            body: 'Some body right here',
            checkCanOpen: false // Call Linking.canOpenURL prior to Linking.openURL
        }).catch(console.error)
  }

  return (
    <ScrollView>
        <Text style={styles.bigHeader}>Contact Us</Text>
        <View style={styles.formCon}>
          <TextInput onChangeText={(e) => setfName(e)}
            value={fName}
            placeholder={'First Name'}
            style={styles.formInput}
            />
            <TextInput onChangeText={(e) => setlName(e)}
            value={lName}
            placeholder={'Last Name'}
            style={styles.formInput}
            />
            <TextInput onChangeText={(e) => setEmail(e)}
            value={email}
            placeholder={'Your Email'}
            style={(validEmail || email === '') ? styles.formInput : styles.invalid}
            />
            <Text style={(validEmail || email === '') ? {display: 'none'} : {display: 'flex', color: 'red', textAlign:'left', width: '90%', marginBottom: '2.2%'}}>Please Enter A Valid Email</Text>
            <TextInput onChangeText={(e) => setPhone(e)}
            value={phone}
            placeholder={'Phone Number'}
            style={(validPhone || phone === '') ? styles.formInput : styles.invalid}
            />
            <Text style={(validPhone || phone === '') ? {display: 'none'} : {display: 'flex', color: 'red', textAlign:'left', width: '90%', marginBottom: '2.2%'}}>Please Enter A Valid Phone Number</Text>
            <TextInput onChangeText={(e) => setPosition(e)}
            value={position}
            placeholder={'Professional Position (optional)'}
            style={styles.formInput}
            />
            <TextInput onChangeText={(e) => setMessage(e)}
            value={message}
            placeholder={'Enter a message'}
            style={styles.formInputMessage}
            editable
            multiline
            numberOfLines={5}
            />
            <TouchableOpacity onPress={() => sendEmail()}>
              <Text style={styles.button}>More About Us</Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    bigHeader: {
      color: 'white',
      fontSize: 40,
      textAlign: 'center',
      fontWeight: '700',
      marginBottom: '5%'
    },
    formInput: {
      backgroundColor: 'white',
      paddingLeft: 4,
      paddingRight: 4,
      paddingTop: 2,
      paddingBottom: 2,
      fontSize: 18,
      width: '90%',
      marginBottom: '10%'
    },
    formInputMessage: {
      backgroundColor: 'white',
      paddingLeft: 4,
      paddingRight: 4,
      paddingTop: 2,
      paddingBottom: 2,
      fontSize: 18,
      textAlignVertical: 'top',
      width: '90%'
    },
    invalid: {
      backgroundColor: 'white',
      paddingLeft: 4,
      paddingRight: 4,
      paddingTop: 2,
      paddingBottom: 2,
      fontSize: 18,
      width: '90%',
      marginBottom: '2%'
    },
    formCon: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: 20
    },
    button: {
      borderWidth: 1,
      borderColor: '#777',
      padding: 8,
      marginTop: '8%',
      width: '50%',
      backgroundColor: 'white',
      width: 'full',
      textAlign: 'center',
      fontSize: 18,
      borderRadius: 25
    },
})

export default ContactForm
import React, {useState, useEffect} from 'react'
import {View, ScrollView, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native'
import emailjs from '@emailjs/browser'
import {EMAILJS_API_KEY, EMAILJS_TEMPLATE_ID, EMAILJS_SERVICE_ID} from '../secrets'

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

const ContactForm = ({ navigateFunc }) => {

  const [fName, setfName] = useState('')
  const [lName, setlName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [position, setPosition] = useState('')
  const [message, setMessage] = useState('')
  const [validEmail, setValidEmail] = useState(null)
  const [validPhone, setValidPhone] = useState(null)
  const [success, setSuccess] = useState(false)

  //run regex check on email input
  useEffect(() => {
    const emailResult = EMAIL_REGEX.test(userEmail)
    setValidEmail(emailResult)
  }, [userEmail])

  //run regex check on phone input
  useEffect(() => {
    const phoneResult = PHONE_REGEX.test(phone)
    setValidPhone(phoneResult)
  }, [phone])

  const sendEmail = () => {

    if (!validEmail || !validPhone || userEmail === '' || phone === '') {
      return false
    }

    let templateParams = {
      sender_first_name: fName,
      sender_last_name: lName,
      sender_address: userEmail,
      sender_phone: phone,
      sender_position: position,
      message: message,
    };
    console.log('ENVIADOS: ', JSON.stringify(templateParams));
  
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_API_KEY).then(
      function (response) {
        console.log('SUCCESS!', response.status, response.text);
        setSuccess(true)
      },
      function (error) {
        console.log('FAILED...', error);
      }
    );

    setfName('')
    setlName('')
    setUserEmail('')
    setPhone('')
    setPosition('')
    setMessage('')
    setValidEmail(null)
    setValidPhone(null)

  }

  return (

    !success ? (
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
              <TextInput onChangeText={(e) => setUserEmail(e)}
              value={userEmail}
              placeholder={'Your Email'}
              style={(validEmail || userEmail === '') ? styles.formInput : styles.invalid}
              />
              <Text style={(validEmail || userEmail === '') ? {display: 'none'} : {display: 'flex', color: 'red', textAlign:'left', width: '90%', marginBottom: '2.2%'}}>Please Enter A Valid Email</Text>
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
    ) : (
      <View>
        <Text style={styles.bigHeaderMarginReduced}>Thanks for reaching out :&#41;</Text>
        <Text style={styles.subheading}>Our team is reviewing our message and will respond shorlty :0</Text>
        <View style={styles.buttonCon}>
          <TouchableOpacity onPress={() => navigateFunc('Home')}>
            <Text style={styles.button}>Back To Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
    
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
    bigHeaderMarginReduced: {
      color: 'white',
      fontSize: 40,
      textAlign: 'center',
      fontWeight: '700',
      marginBottom: '2%'
    },
    subheading: {
      color: 'white',
      textAlign: 'center',
      fontSize: 18,
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
    buttonCon: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: 20
    },
    button: {
      borderWidth: 1,
      borderColor: '#777',
      padding: 8,
      marginTop: '5%',
      backgroundColor: 'white',
      width: 'full',
      textAlign: 'center',
      fontSize: 18,
      borderRadius: 25
    }
})

export default ContactForm
import React, {useState} from 'react'
import {View, ScrollView, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native'

const ContactForm = () => {

  const [fName, setfName] = useState('')
  const [lName, setlName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [position, setPosition] = useState('')
  const [message, setMessage] = useState('')

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
            style={styles.formInput}
            />
            <TextInput onChangeText={(e) => setPhone(e)}
            value={phone}
            placeholder={'Phone Number'}
            style={styles.formInput}
            />
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
            <TouchableOpacity onPress={() => false}>
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
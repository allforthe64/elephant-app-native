import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native'
import React, {useState, useEffect, useContext} from 'react'
import { firebaseAuth } from '../firebaseConfig'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { AuthContext } from '../context/authContext'

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const Login = ({navigation: {navigate}}) => {
    const [userEmail, setUserEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [validEmail, setValidEmail] = useState(false)
    const [signUpMode, setSignUpMode] = useState(false)
    const auth = firebaseAuth

    const {setAuthUser} = useContext(AuthContext)


    useEffect(() => {
        const emailResult = EMAIL_REGEX.test(userEmail)
        setValidEmail(emailResult)
    }, [userEmail])

    const login = async () => {
        let response
        setLoading(true)
        try {
            response = await signInWithEmailAndPassword(auth, userEmail, password)
        } catch (err) {
            console.log(err)
            alert('Sign In failed: ', err.message)
        } finally {
            setLoading(false)
            setUserEmail('')
            setPassword('')
            navigate('Dashboard')
        }
    }

    const signUp = async () =>{
        setLoading(true)
        try {
            const response = await createUserWithEmailAndPassword(auth, userEmail, password)
            console.log(response)
            alert('Check your emails!')
        } catch (err) {
            console.log(err)
            alert('Sign Up Failed: ', err.message)
            return
        } finally {
            setLoading(false)
            setUserEmail('')
            setPassword('')
            navigate('Registration Complete')
        }
    }

  return (
    <View style={styles.container}>
        <Image style={styles.bgImg } source={require('../assets/elephant-dashboard.jpg')} />
        <View style={styles.innerContainer}>
            <Text style={styles.bigHeader}>{signUpMode ? 'Register account' : 'Sign in'}</Text>
            <View style={styles.formCon}>
                <Text style={styles.subheading}>Enter Email:</Text>
                <TextInput style={(validEmail || userEmail === '') ? styles.input : styles.inputInvalid} placeholder='Enter Email' autoCapitalize='none' placeholderTextColor={'rgb(0, 0, 0)'} value={userEmail} onChangeText={(e) => setUserEmail(e)}/>
                <Text style={(validEmail || userEmail === '') ? {display: 'none'} : styles.invalid}>Please Enter A Valid Email</Text>
                <Text style={styles.subheading}>Enter Password:</Text>
                <TextInput secureTextEntry={true} style={styles.input} placeholder='Enter Password' placeholderTextColor={'rgb(0, 0, 0)'} value={password} onChangeText={(e) => setPassword(e)}/>
            </View>
            <View style={styles.wrapperContainer}>
                <View style={styles.buttonWrapper}>
                    {signUpMode ? 
                        <TouchableOpacity onPress={() => signUp()}>
                            <Text style={styles.inputButton}>Register</Text>
                        </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => login()}>
                        <Text style={styles.inputButton}>Sign In</Text>
                    </TouchableOpacity>
                    }
                </View>
                <Text style={{color: 'white', width: '80%', textAlign: 'center'}}>
                    {signUpMode ? "Already have an account?" : "Don't have an Account?"}
                    <TouchableOpacity onPress={() => {
                            setUserEmail('')
                            setPassword('')
                            setSignUpMode(prev => !prev)
                        }}>
                        <Text style={styles.inputText}> Click here </Text>
                    </TouchableOpacity>
                    {signUpMode ? "to login." : "to Register for a new one."}
                </Text>
            </View>
        </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    bigHeader: {
        color: 'white',
        fontSize: 40,
        textAlign: 'center',
        fontWeight: '700',
        marginBottom: '8%'
    },

    subheading: {
        color: 'white',
        fontSize: 30,
        textAlign: 'left',
        width: '80%',
        fontWeight: '500',
        marginBottom: '8%'
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
    formCon: {
        width: '100%',
        height: '60%',
        marginBottom: '10%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    wrapperContainer: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginBottom: '8%'
    },
    buttonWrapper: {
        width: '60%',
        borderColor: '#777',
        borderRadius: 25,
        backgroundColor: 'white',
        borderWidth: 1,
        paddingTop: '2%',
        paddingBottom: '2%',
        marginBottom: '5%'
    },
    buttonWrapperSm: {
        width: '40%',
        borderColor: '#777',
        borderRadius: 25,
        backgroundColor: 'white',
        borderWidth: 1,
        paddingTop: '2%',
        paddingBottom: '2%',
    },
    input: {
        backgroundColor: 'white',
        width: '80%',
        fontSize: 18,
        paddingLeft: '2%',
        paddingTop: '2%',
        paddingBottom: '2%',
        marginBottom: '18.5%'
    },
    inputInvalid: {
        backgroundColor: 'white',
        width: '80%',
        fontSize: 18,
        paddingLeft: '2%',
        paddingTop: '2%',
        paddingBottom: '2%',
        marginBottom: '4%'
    },
    inputButton: {
        textAlign: 'center',
        fontSize: 15,
        width: '100%',
    },
    inputText: {
        textAlign: 'center',
        fontSize: 15,
        color: 'white',
        textDecorationColor: 'white',
        textDecorationLine: 'underline'
    },
    invalid: {
        display: 'flex', 
        color: 'red', 
        textAlign:'left', 
        width: '80%', 
        marginBottom: '10%'
    }
}) 
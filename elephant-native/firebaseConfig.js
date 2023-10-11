import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'

//configure firebase
const firebaseConfig = {
    apiKey: "AIzaSyBxOJmWONqaEABmUqbItzSLCNn4USBrGSA",
    authDomain: "elephant-app-22121.firebaseapp.com",
    projectId: "elephant-app-22121",
    storageBucket: "elephant-app-22121.appspot.com",
    messagingSenderId: "525718553886",
    appId: "1:525718553886:web:8a517b63afcbce967bf50f",
    measurementId: "G-PHXPHEHBQW"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export { firebase }
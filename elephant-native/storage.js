import {
    setDoc,
    getDoc,
    doc
} from 'firebase/firestore'
import { db } from '../elephant-native/firebaseConfig'

export async function getUser(user) {

    console.log(user)

    console.log('made it here')
    const docSnap = await getDoc(doc(db, 'users', user.localId))

    if (!docSnap.exists()) {
        const newUser = addUser(user)
        return newUser
    } else {
        return {...docSnap.data(), uid: user.localId}
    }
}

export function addUser(user) {
    console.log('this is the error')
    const userRef = setDoc(doc(db, 'users', user.localId), {
    email: user.email,
    displayName: user.email,
    folder1: {},
    folder2: {},
    folder3: {},
    folder4: {},
    folder5: {},
    staging: {},
    sharedWith: {}
})
}
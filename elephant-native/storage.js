import {
    setDoc,
    getDoc,
    addDoc,
    updateDoc,
    doc,
    collection
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
    const userRef = setDoc(doc(db, 'users', user.localId), {
    email: user.email,
    displayName: user.email,
    folder1: {},
    folder2: {},
    folder3: {},
    folder4: {},
    folder5: {},
    staging: [],
    sharedWith: {}
})
}

export async function addfile(file) {

    const fileRef = await addDoc(collection(db, 'files'), {
        fileName: file.name,
        documentType: file.fileType,
        size: file.size,
        uri: file.uri
    })

    const reference = {
        fileId: fileRef.id,
        fileName: file.name
    }

    return reference
}

export const updateStaging = async (files, currentUser) => {

    console.log('files: ', files)

    const docSnap = await getDoc(doc(db, 'users', currentUser))

    let staging = []

    docSnap.staging ? staging = [...docSnap.staging, ...files] : staging = [...files]

    console.log('staging: ', staging)

    updateDoc(doc(db, 'users', currentUser),
        {
            staging: staging
        }
    )

}
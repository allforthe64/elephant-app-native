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
    files: ['File 1', 'File 2', 'File 3', 'File 4', 'File 5'],
    fileRefs: [],
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
        fileName: file.name,
        flag: 'Staging'
    }

    return reference
}

export const updateStaging = async (files, currentUser) => {

    console.log('files: ', files)

    const docSnap = await getDoc(doc(db, 'users', currentUser))

    let fileArr = []

    docSnap.fileRefs ? fileArr = [...docSnap.fileRefs, ...files] : fileArr = [...files]

    console.log('fileArr: ', fileArr)

    updateDoc(doc(db, 'users', currentUser),
        {
            fileRefs: fileArr
        }
    )

}
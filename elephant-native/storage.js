import {
    setDoc,
    getDoc,
    addDoc,
    updateDoc,
    doc,
    collection,
    onSnapshot
} from 'firebase/firestore'
import { db } from '../elephant-native/firebaseConfig'

import { getStorage, ref, getDownloadURL } from 'firebase/storage'

const storage = getStorage()

const BUCKET_URL = 'gs://elephantapp-21e34.appspot.com'

export async function getUser(user) {
    
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
    files: [{id: 1, fileName: 'File 1', nestedUnder: ''}, {id: 2, fileName: 'File 2', nestedUnder: ''}, {id: 3, fileName: 'File 3', nestedUnder: ''}, {id: 4, fileName: 'File 4', nestedUnder: ''}, {id: 5, fileName: 'File 5', nestedUnder: ''}],
    fileRefs: [],
    sharedWith: {}
})
}

export async function updateUser(updatedUser) {
    const userRef = doc(db, 'users', updatedUser.uid)
    await updateDoc(userRef, {...updatedUser})
}

export async function userListener(setCurrentUser, setStaging, user) {
    console.log('user inside function: ', user)
    const unsub = onSnapshot(doc(db, 'users', user), (doc) => {
        try {
            //filter file references from the current user that are in staging
            const stagingRefs = doc.data().fileRefs.filter(el => el.flag === 'Staging')
            if (setStaging) setStaging(stagingRefs)
            setCurrentUser({...doc.data(), uid: user})
        } catch (err) {console.log(err)}
    })

    return unsub
}

export async function addfile(file, destination) {

    console.log('incoming: ', file)

    const fileRef = await addDoc(collection(db, 'files'), {
        fileName: file.name,
        documentType: file.fileType,
        linksTo: file.linksTo,
        size: file.size,
        uri: BUCKET_URL + '/' + file.name
    })

    const reference = {
        fileId: fileRef.id,
        fileName: file.name,
        flag: destination ? destination : 'Staging'
    }

    return reference
}

export const updateStaging = async (files, currentUser) => {

    console.log('files: ', files)

    const docSnap = await getDoc(doc(db, 'users', currentUser))

    console.log(docSnap.data().fileRefs)

    let fileArr = []

    docSnap.data().fileRefs ? fileArr = [...docSnap.data().fileRefs, ...files] : fileArr = [...files]

    console.log('fileArr: ', fileArr)

    updateDoc(doc(db, 'users', currentUser),
        {
            fileRefs: fileArr
        }
    )

}

export const getFile = async (fileId) => {
    const docSnap = await getDoc(doc(db, 'files', fileId))
    console.log(docSnap.data())
    return {...docSnap.data()}
}

export const getFileDownloadURL = async (docURL) => {
    const fileURL = await getDownloadURL(ref(storage, docURL)).then(url => {return url})
    return fileURL
}
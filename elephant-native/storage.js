import {
    setDoc,
    getDoc,
    addDoc,
    updateDoc,
    doc,
    collection,
    onSnapshot,
    deleteDoc
} from 'firebase/firestore'
import { db } from '../elephant-native/firebaseConfig'

import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import { deleteFile } from './cloudStorage'

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
    files: [{id: 1, fileName: 'My House', nestedUnder: ''}, {id: 2, fileName: 'Financial', nestedUnder: ''}, {id: 3, fileName: 'Personal/Medical', nestedUnder: ''}, {id: 4, fileName: 'Pictures/Videos', nestedUnder: ''}, {id: 5, fileName: 'Work', nestedUnder: ''}, {id: 6, fileName: 'Hobbies', nestedUnder: ''}, {id: 7, fileName: 'Basement/Mech', nestedUnder: 1}, {id: 8, fileName: 'Garage', nestedUnder: 1}, {id: 9, fileName: 'Kitchen', nestedUnder: 1}, {id: 10, fileName: 'Main Floor', nestedUnder: 1}, {id: 11, fileName: 'Second Floor', nestedUnder: 1}, {id: 12, fileName: 'Structure', nestedUnder: 1}, {id: 13, fileName: 'Mortgage', nestedUnder: 2}, {id: 14, fileName: 'Insurance', nestedUnder: 2}, {id: 15, fileName: 'Tax Info', nestedUnder: 2}, {id: 16, fileName: 'Banking', nestedUnder: 2}, {id: 17, fileName: 'Friends', nestedUnder: 4}, {id: 18, fileName: 'Family', nestedUnder: 4}, {id: 19, fileName: 'Pets', nestedUnder: 4}, {id: 20, fileName: 'Vacations', nestedUnder: 4}, {id: 21, fileName: 'Events', nestedUnder: 4}, {id: 22, fileName: 'Receipts', nestedUnder: 15}, {id: 23, fileName: 'Returns', nestedUnder: 15}],
    fileRefs: [],
    sharedWith: {},
    passcodeAuthenticated: false,
    spaceUsed: 0
})
}

export async function updateUser(updatedUser) {
    console.log(updatedUser)
    const userRef = doc(db, 'users', updatedUser.uid)
    await updateDoc(userRef, {...updatedUser})
}

export async function userListener(setCurrentUser, setStaging, user) {
    console.log(user)
    const unsub = onSnapshot(doc(db, 'users', user), (doc) => {
        try {
            //filter file references from the current user that are in staging
            console.log(doc.data())
            const stagingRefs = doc.data().fileRefs.filter(el => el.flag === 'Staging')
            if (setStaging) setStaging(stagingRefs)
            setCurrentUser({...doc.data(), uid: user})
        } catch (err) {console.log(err)}
    })

    return unsub
}

export async function addfile(file, destination) {


    try {
        let fileRef
        if (file.linksTo) {
            fileRef = await addDoc(collection(db, 'files'), {
                fileName: file.name,
                documentType: file.fileType,
                linksTo: file.linksTo,
                size: file.size,
                uri: file.name.split('.')[1] === 'doc' || file.name.split('.')[1] === 'docx' ? BUCKET_URL + '/' + file.timeStamp + '^&' + file.user
                : BUCKET_URL + '/' + file.user + '/' + file.timeStamp,
                version: file.version
            })
        } else {
            fileRef = await addDoc(collection(db, 'files'), {
                fileName: file.name,
                documentType: file.fileType,
                size: file.size,
                uri: file.name.split('.')[1] === 'doc' || file.name.split('.')[1] === 'docx' ? BUCKET_URL + '/' + file.timeStamp + '^&' + file.user
                : BUCKET_URL + '/' + file.user + '/' + file.timeStamp,
                version: file.version
            })
        }

        const reference = {
            fileId: fileRef.id,
            fileName: file.name,
            flag: destination ? destination : 'Staging',
            version: file.version,
            size: file.size
        }

        return reference
    } catch (error) {
        console.log('error within storage: ', error)
    }
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
    return {...docSnap.data()}
}

export const deleteFileObj = async (id) => {
    const file = await getDoc(doc(db, 'files', id))
    deleteFile(file.data().uri)
    await deleteDoc(doc(db, 'files', id))
}

export const updateFileObj = async (input) => {
    console.log(input)
    const fileRef = doc(db, 'files', input.fileId)
    console.log(fileRef)
    await updateDoc(fileRef, {...input})
}

export const getFileDownloadURL = async (docURL) => {
    const fileURL = await getDownloadURL(ref(storage, docURL)).then(url => {return url})
    return fileURL
}
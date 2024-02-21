import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner'
import UrlEditor from '../../components/urlEditor'
import { ScrollView } from 'react-native-gesture-handler'
import { addfile, updateUser } from '../../storage'
import { firebaseAuth } from '../../firebaseConfig'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { storage } from '../../firebaseConfig'
import {ref, uploadBytes} from 'firebase/storage'
import {format} from 'date-fns'
import { userListener } from '../../storage'
import { useToast } from 'react-native-toast-notifications'

const Scanner = () => {

    try {
        const [hasPermissions, setHasPermissions] = useState(false)
        const [scanData, setScanData] = useState()
        const [urls, setUrls] = useState([])
        const [userInst, setUserInst] = useState()

        const toast = useToast()

        const currentUser = firebaseAuth.currentUser.uid

        //get the current user 
        useEffect(() => {
            if (currentUser) {
            try {
                const getCurrentUser = async () => {
                const unsubscribe = await userListener(setUserInst, false, currentUser)
            
                return () => unsubscribe()
                }
                getCurrentUser()
            } catch (err) {console.log(err)}
            } else console.log('no user yet')
            
        }, [currentUser])

        //get the current user 
        useEffect(() => {
            if (currentUser) {
            try {
                const getCurrentUser = async () => {
                const unsubscribe = await userListener(setUserInst, false, currentUser)
            
                return () => unsubscribe()
                }
                getCurrentUser()
            } catch (err) {console.log(err)}
            } else console.log('no user yet')
            
        }, [currentUser])

        useEffect(() => {
            (async() => {
                const {status} = await BarCodeScanner.requestPermissionsAsync()
                setHasPermissions(status === "granted")
            })()
        }, [])


        if (!hasPermissions) {
            return (
                <View style={styles.container}>
                    <Text>Please grant camera permissions to app.</Text>
                </View>
            )
        }

        const handleBarCodeScanned = ({data}) => {
            
            let arr = [...urls]
            setScanData(data)
            arr.push({data: data, title: ''})
            console.log('edited arr: ', arr)
            setUrls(arr)
        }

        const mapUrls = () => {
            return urls.map((url, index) => {
                return <UrlEditor url={url} editUrls={setUrls} key={index} index={index} deleteFunc={deleteUrl}/>
            })
        }

        const deleteUrl = (target) => {
            const arr = urls.filter(url => url != target)
            setUrls(arr)
        }

        
        const submit = async () => {

            let uploadSize = 0
            
            const references = await Promise.all(urls.map(async (el) => {

                //generate filename
                const fileName = el.title ? `URL for: ${el.title}.txt` : `URL for: ${el.data}.txt`

                //if files exist with this filename increase version number
                let versionNo = 0
                    userInst.fileRefs.forEach(fileRef => {
                    if (fileRef.fileName === fileName) {
                        versionNo ++
                    }
                })

                //generate formatted date
                const formattedDate = format(new Date(), `yyyy-MM-dd:hh:mm:ss::${Date.now()}`)

                //upload file
                const textFile = new Blob([`${el.data}`], {
                type: "text/plain;charset=utf-8",
                    });
                const fileUri = `${currentUser}/${formattedDate}`
                const fileRef = ref(storage, fileUri)

                uploadBytes(fileRef, textFile)

                const reference = await addfile({
                    name: fileName,
                    linksTo: el.data,
                    fileType: 'txt',
                    size: textFile.size,
                    user: currentUser, timeStamp: formattedDate, version: versionNo
                }, false)

                //increase the size of the upload
                uploadSize += textFile.size

                return reference   
            }))

            const newSpaceUsed = userInst.spaceUsed + uploadSize
            const newUser = {...userInst, spaceUsed: newSpaceUsed, fileRefs: [...userInst.fileRefs, ...references]}
            await updateUser(newUser)
            setUrls([])
            toast.show('File upload successful', {
                type: 'success'
            }) 
        }

        const insets = useSafeAreaInsets()

        console.log(urls)

    return (
        <View style={{
                backgroundColor: 'rgb(23,23,23)',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}>
            <Image style={styles.bgImg } source={require('../../assets/elephant-dashboard.jpg')} />
            {scanData ? 
                <View style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        position: 'absolute',
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom
                    }}>
                    <Text style={styles.bigHeader}>Currently Captured QR URLS:</Text>
                    <View style={styles.scrollCon}>
                        <ScrollView contentContainerStyle={styles.scroll}>
                            {mapUrls()}
                        </ScrollView>
                    </View> 
                    <View style={styles.wrapperContainer}>
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity onPress={() => setScanData(undefined)}>
                            <Text style={styles.input}>Scan Another Code</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.wrapperContainer}>
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity onPress={() => submit()}>
                            <Text style={styles.input}>Save All</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            :
                <BarCodeScanner 
                style={StyleSheet.absoluteFillObject}
                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                onBarCodeScanned={scanData !== undefined ? undefined : handleBarCodeScanned }
                />
            }
        </View>
    )

    } catch (error) {
        console.log(error)
    }
}

export default Scanner

const styles = StyleSheet.create({
    bigHeader: {
        color: 'white',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: '700',
        marginBottom: '8%'
      },
    scrollCon: {
        height: '60%',
        width: '95%',
        borderBottomWidth: 1,
        borderColor: 'white',
        marginBottom: '10%'
    },
    scroll: {
        paddingTop: '2%',
        display: 'flex',
        alignItems: 'center'
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
    },
    input: {
    textAlign: 'center',
    fontSize: 15,
    width: '100%',
    },
    bgImg: {
        objectFit: 'scale-down',
        opacity: .15,
        transform: [{scaleX: -1}]
    },
})
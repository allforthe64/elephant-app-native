import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner'
import UrlEditor from '../../components/urlEditor'
import { ScrollView } from 'react-native-gesture-handler'
import { addfile, updateStaging } from '../../storage'
import { firebaseAuth } from '../../firebaseConfig'
import { firebase } from '../../firebaseConfig'

const Scanner = () => {

    const [hasPermissions, setHasPermissions] = useState(false)
    const [scanData, setScanData] = useState()
    const [urls, setUrls] = useState([])

    const currentUser = firebaseAuth.currentUser.uid

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
        arr.push(data)
        setUrls(arr)
    }

    const mapUrls = () => {
        return urls.map((url, index) => {
            console.log(url)
            return <UrlEditor url={url} key={index} deleteFunc={deleteUrl}/>
        })
    }

    const deleteUrl = (target) => {
        const arr = urls.filter(url => url != target)
        setUrls(arr)
    }

    const submit = async () => {


        const references = await Promise.all(urls.map(async (el, i) => {

            const textFile = new Blob([`${el}`], {
            type: "text/plain;charset=utf-8",
                });
            const fileUri = `${i} + foobar.txt`
            const ref = firebase.storage().ref().child(fileUri)
            await ref.put(textFile)


            const reference = await addfile({
                name: `URL for: ${el}.txt`,
                fileType: 'txt',
                size: textFile.size,
                uri: `${fileUri}`
            }, false)

            return reference
        }))
        updateStaging(references, currentUser)
        setUrls([])
    }

  return (
    <View style={styles.container}>
        <Image style={styles.bgImg } source={require('../../assets/elephant-dashboard.jpg')} />
        {scanData ? 
            <View style={styles.innerContainer}>
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
}

export default Scanner

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgb(23,23,23)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        paddingTop: '10%',
        paddingBottom: '10%'
    },
    innerContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        position: 'absolute'
    },
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
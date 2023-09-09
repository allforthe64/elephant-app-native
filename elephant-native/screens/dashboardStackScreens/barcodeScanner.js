import { StyleSheet, Text, View, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner'
import UrlEditor from '../../components/urlEditor'
import { height } from '@mui/system'
import { ScrollView } from 'react-native-gesture-handler'

const Scanner = () => {

    const [hasPermissions, setHasPermissions] = useState(false)
    const [scanData, setScanData] = useState()
    const [urls, setUrls] = useState([])

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

    console.log(urls)

  return (
    <View style={styles.container}>
        {scanData ? 
            <View style={styles.container}>
                <Button title='Scan Again?' onPress={() => setScanData(undefined)} /> 
                <ScrollView style={styles.scrollCon} height={200}>
                    {mapUrls()}
                </ScrollView>
                <Button title='Save All'/>
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    scrollCon: {
        borderWidth: 1,
        height: '20%'
    }
})
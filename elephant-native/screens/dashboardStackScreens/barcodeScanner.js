import { StyleSheet, Text, View, Button, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner'
import * as FileSystem from 'expo-file-system'
import { shareAsync } from 'expo-sharing'

const Scanner = () => {

    const [hasPermissions, setHasPermissions] = useState(false)
    const [scanData, setScanData] = useState()
    const [urls, setUrls] = useState()

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

    console.log('Scan data outside of bar code scanner function: ', scanData)

  return (
    <View style={styles.container}>
        {scanData ? 
            <View>
                <Button title='Scan Again?' onPress={() => setScanData(undefined)} /> 
                <Image source={{uri: scanData}} style={{borderWidth: 1}}/>
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
        alignItems: 'center'
    }
})
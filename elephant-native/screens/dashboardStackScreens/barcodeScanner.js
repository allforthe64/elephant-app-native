import { StyleSheet, Text, View, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner'

const Scanner = () => {

    const [hasPermissions, setHasPermissions] = useState(false)
    const [scanData, setScanData] = useState()

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
        setScanData(data)
        console.log(`data: `, data)
    }

    console.log(scanData)

  return (
    <View style={styles.container}>
      <BarCodeScanner 
      style={StyleSheet.absoluteFillObject}
      barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
      onBarCodeScanned={scanData !== undefined ? undefined : handleBarCodeScanned }
      />
      {scanData !== undefined && <Button title='Scan Again?' onPress={() => setScanData(undefined)} />}
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
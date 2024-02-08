import React, { useState, useEffect } from 'react'
import { Image } from 'react-native'
import DocumentScanner from 'react-native-document-scanner-plugin'
import { Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const DocScanner = () => {

  try {
    const [scannedImageArray, setScannedImageArray] = useState();
    const [scanning, setScanning] = useState(true)
    const width = Dimensions.get('window').width;

    const scanDocument = async () => {
      setScanning(true)
      // start the document scanner
      const { scannedImages } = await DocumentScanner.scanDocument()
    
      // get back an array with scanned image file paths
      if (scannedImages.length > 0) {
        // set the img src, so we can view the first scanned image
        if (scannedImageArray.length > 0) {
          setScannedImageArray([...scannedImageArray, ...scannedImages])
        }else {
          setScannedImageArray(scannedImages)
        }
      }
      setScanning(false)
    }

    useEffect(() => {
      // call scanDocument on load
      scanDocument()
    }, []);

    return (
      <>
      {scanning ? 
        <></>
      :

        <View style={{ flex: 1 }}>
          <View style={{height: '75%'}}>
            <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={true}
                data={scannedImageArray}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ index }) => (
                    <View>
                        <Image
                          resizeMode="contain"
                          style={{ width: '100%', height: '100%' }}
                          source={{ uri: scannedImageArray[index] }}
                        />
                    </View>
                )}
            />
          </View>
          <View style={{width: '25%',
                  borderColor: '#777',
                  borderRadius: 25,
                  backgroundColor: 'white',
                  borderWidth: 1,
                  paddingTop: '2%',
                  paddingBottom: '2%',
                  marginLeft: '2%'}}>
                <TouchableOpacity style={{
                  display: 'flex', 
                  flexDirection: 'row', 
                  width: '100%', 
                  justifyContent: 'center',
                }}
                  onPress={() => scanDocument()}
                >
                    <Text style={{fontSize: 15, color: 'black', fontWeight: '600'}}>Scan More Documents</Text>
                </TouchableOpacity>
          </View>
        </View> 
      }
      </>
    )
  } catch (err) {
    alert(err)
  }
  
}

export default DocScanner

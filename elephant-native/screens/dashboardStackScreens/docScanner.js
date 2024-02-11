import React, { useState, useEffect } from 'react'
import { Image, Platform, PermissionsAndroid, Dimensions } from 'react-native'
import DocumentScanner from 'react-native-document-scanner-plugin'
import { useToast } from 'react-native-toast-notifications'

const DocScanner = () => {

  try {

  
  const [scannedImageArray, setScannedImageArray] = useState();

  const toast = useToast()

  const width = Dimensions.get('window').width

  const scanDocument = async () => {

    // prompt user to accept camera permission request if they haven't already
    if (Platform.OS === 'android' && await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    ) !== PermissionsAndroid.RESULTS.GRANTED) {
      toast.show('File upload successful', {
        type: 'error'
      }) 
      return
    }

    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument()
  
    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      // set the img src, so we can view the first scanned image
      setScannedImageArray(scannedImages)
    }
  }

  useEffect(() => {
    // call scanDocument on load
    scanDocument()
  }, []);

  return (
    <>
      {scannedImageArray ? 
        <View style={{ flex: 1 }}>
            <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={true}
                data={scannedImageArray}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ index }) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <Image 
                          source={{uri: scannedImageArray[index]}}
                        />
                    </View>
                )}
            />
        </View>
      :
        <></>
      }
    </>
  )
  } catch (error) {
    alert(error)
  }
}

export default DocScanner

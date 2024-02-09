import React, { useState, useEffect } from 'react'
import { Image } from 'react-native'
import DocumentScanner from 'react-native-document-scanner-plugin'

const DocScanner = () => {
  const [scannedImageArray, setScannedImageArray] = useState();

  const scanDocument = async () => {
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
        <Image
          resizeMode="contain"
          style={{ width: '100%', height: '100%' }}
          source={{ uri: scannedImageArray[0] }}
        />
      :
        <></>
      }
    </>
  )
}

export default DocScanner

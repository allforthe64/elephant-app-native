import React, { useState, useEffect } from 'react'
import { Image, Platform, PermissionsAndroid, Dimensions, View, TouchableOpacity, Text } from 'react-native'
import DocumentScanner from 'react-native-document-scanner-plugin'
import Carousel from 'react-native-reanimated-carousel';
import { useToast } from 'react-native-toast-notifications'
import { createPdf } from 'react-native-images-to-pdf';
import RNBlobUtil from 'react-native-blob-util';

const DocScanner = () => {

  try {

  
  const [scannedImageArray, setScannedImageArray] = useState([]);

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
      if (scannedImageArray.length >= 1) {
        setScannedImageArray(prev => [...prev, ...scannedImages])
      } else {
        setScannedImageArray(scannedImages)
      }
    }
  }

  useEffect(() => {
    // call scanDocument on load
    scanDocument()
  }, []);

  //generate a pdf using the scanned images
  const generatePDF = async () => {
    return createPdf({
      pages: scannedImageArray.map(imagePath => ({imagePath})),
      outputPath: `file://${RNBlobUtil.fs.dirs.DocumentDir}/file.pdf`
    })
    .then(path => console.log(`PDF created successfully: ${path}`))
    .catch(error => console.log(`Failed to create PDF: ${error}`));
  }

  useEffect(() => {
    console.log('ScannedImageArray: ', scannedImageArray)
  }, scannedImageArray)

  return (
    <>
      {scannedImageArray ? 
        <View>
          {scannedImageArray.length > 1
            ?    
            <>
                <Carousel
                    loop
                    width={width}
                    style={{height: '75%', paddingRight: '5%'}}
                    data={scannedImageArray}
                    scrollAnimationDuration={1000}
                    onSnapToItem={(index) => console.log('current index:', index)}
                    renderItem={({ index }) => (
                        <View
                            style={{
                                flex: 1,
                                borderWidth: 1,
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%'
                            }}
                        >
                            <Image 
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              source={{uri: scannedImageArray[index]}}
                            />
                        </View>
                    )}
                    />
                <View style={{height: '25%'}}>
                  <View style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: '8%'
                    }}>
                      <View style={{
                        width: '60%',
                        borderColor: '#777',
                        borderRadius: 25,
                        backgroundColor: 'white',
                        borderWidth: 1,
                        paddingTop: '2%',
                        paddingBottom: '2%',
                      }}>
                          <TouchableOpacity onPress={() => scanDocument()}>
                          <Text style={{
                            textAlign: 'center',
                            fontSize: 15,
                            width: '100%',
                          }}>Scan More Documents</Text>
                          </TouchableOpacity>
                      </View>
                  </View>

                  <View style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: '8%'
                    }}>
                      <View style={{
                        width: '60%',
                        borderColor: '#777',
                        borderRadius: 25,
                        backgroundColor: 'white',
                        borderWidth: 1,
                        paddingTop: '2%',
                        paddingBottom: '2%',
                      }}>
                        <TouchableOpacity onPress={() => generatePDF()}>
                        <Text style={{
                          textAlign: 'center',
                          fontSize: 15,
                          width: '100%',
                        }}>Convert To PDF</Text>
                        </TouchableOpacity>
                    </View>
                  </View>
                </View>
            </>
              
            :
            <>
              <View style={{height: '65%', marginBottom: '10%'}} width={width}>
                <Image 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  source={{uri: scannedImageArray[0]}}
                />
              </View>  
              <View style={{height: '25%'}}>
              <View style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                marginBottom: '8%'
                }}>
                  <View style={{
                    width: '60%',
                    borderColor: '#777',
                    borderRadius: 25,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    paddingTop: '2%',
                    paddingBottom: '2%',
                  }}>
                      <TouchableOpacity onPress={() => scanDocument()}>
                      <Text style={{
                        textAlign: 'center',
                        fontSize: 15,
                        width: '100%',
                      }}>Scan More Documents</Text>
                      </TouchableOpacity>
                  </View>
              </View>
  
              <View style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                marginBottom: '8%'
                }}>
                  <View style={{
                    width: '60%',
                    borderColor: '#777',
                    borderRadius: 25,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    paddingTop: '2%',
                    paddingBottom: '2%',
                  }}>
                    <TouchableOpacity onPress={() => generatePDF()}>
                    <Text style={{
                      textAlign: 'center',
                      fontSize: 15,
                      width: '100%',
                    }}>Convert To PDF</Text>
                    </TouchableOpacity>
                </View>
              </View>
            </View>  
            </>      
          }  

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

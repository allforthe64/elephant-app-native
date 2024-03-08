/* import React, { useState, useEffect } from 'react'
import { Image, Platform, PermissionsAndroid, Dimensions, View, TouchableOpacity, Text } from 'react-native'
import DocumentScanner from 'react-native-document-scanner-plugin'
import Carousel from 'react-native-reanimated-carousel';
import { useToast } from 'react-native-toast-notifications'
import { createPdf } from 'react-native-images-to-pdf';
import RNBlobUtil from 'react-native-blob-util';
import { format } from 'date-fns';
import { firebaseAuth } from '../../firebaseConfig'
import { userListener } from '../../storage'
import { storage } from '../../firebaseConfig';
import {ref, uploadBytes} from 'firebase/storage'
import { addfile, updateUser } from '../../storage'

const DocScanner = () => {

  try {

  
  const [scannedImageArray, setScannedImageArray] = useState([]);
  const [userInst, setUserInst] = useState()

  const currentUser = firebaseAuth.currentUser.uid

  const toast = useToast()

  const width = Dimensions.get('window').width
  

  //get the current user 
  useEffect(() => {
    if (firebaseAuth) {
    try {
        const getCurrentUser = async () => {
        const unsubscribe = await userListener(setUserInst, false, currentUser)
    
        return () => unsubscribe()
        }
        getCurrentUser()
    } catch (err) {console.log(err)}
    } else console.log('no user yet')
    
  }, [firebaseAuth])

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
    const { scannedImages } = await DocumentScanner.scanDocument({
      letUserAdjustCrop: false
    })
  
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

    const formattedDate = format(new Date(), `yyyy-MM-dd:hh:mm:ss::${Date.now()}`)

    return createPdf({
      pages: scannedImageArray.map(imagePath => ({imagePath})),
      outputPath: `file://${RNBlobUtil.fs.dirs.DocumentDir}/file.pdf`
    })
    .then(path => uploadPDF(path))
    .catch(error => {
      console.log(`Failed to create PDF: ${error}`)
      alert(error)
    });
  }

  const uploadPDF = async (path) => {
    try {
      console.log('This is the path within the upload function: ', path)

      const modifiedPath = `file://${path}`

    //generate formatted date for file name
    const formattedDate = format(new Date(), `yyyy-MM-dd:hh:mm:ss::${Date.now()}`)

    //create blob and upload it into firebase storage
      const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.onload = () => {
              resolve(xhr.response) 
          }
          xhr.onerror = (e) => {
              reject(e)
              reject(new TypeError('Network request failed'))
          }
          xhr.responseType = 'blob'
          xhr.open('GET', modifiedPath, true)
          xhr.send(null)
      })
      
      const filename = `${currentUser}/${formattedDate}`
      const fileRef = ref(storage, filename)
      const result = await uploadBytes(fileRef, blob)

      console.log('this is the result object: ', result)
      
      //generate references
      const reference = await addfile({
        name: `${formattedDate}.pdf`,
        fileType: 'pdf',
        size: result.metadata.size,
        uri: path,
        user: currentUser,
        version: 0,
        timeStamp: formattedDate
      })
      
      const updatedUser = {...userInst, fileRefs: [...userInst.fileRefs, reference], spaceUsed: userInst.spaceUsed + result.metadata.size}
      updateUser(updatedUser)
      toast.show('Upload successful', {
          type: 'success'
      })
    } catch (error) {
      console.log('error within pdf upload function: ', error)
      alert('Error within pdf upload function: ', error)
    }

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
 */
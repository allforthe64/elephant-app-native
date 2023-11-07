import { View, Text, Modal, TouchableOpacity, Pressable } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import React, {useState} from 'react'

const FocusedFileComp = ({file, focus, deleteFile}) => {

    const [preDelete, setPreDelete] = useState(false)

  return (
        <Modal animationType='slide' presentationStyle='pageSheet'>
            {preDelete ? 
                <Modal animationType='slide' presentationStyle='pageSheet'>
                    <View style={{ paddingTop: '10%', backgroundColor: 'rgb(23 23 23)', height: '100%', width: '100%'}}>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: '5%', paddingTop: '10%',     width: '100%'}}>
                            <Pressable onPress={() => setPreDelete(false)}>
                            <FontAwesomeIcon icon={faXmark} color={'white'} size={30}/>
                            </Pressable>
                        </View>
                        <View style={{width: '100%', height: '95%', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 22, color: 'white', textAlign: 'center'}}>Are you sure you want to delete {file.fileName}?</Text>

                        <View style={{width: '50%',
                                borderRadius: 25,
                                backgroundColor: 'red',
                                paddingTop: '2%',
                                paddingBottom: '2%',
                                marginTop: '10%',
                                marginLeft: '2%'}}>
                            <TouchableOpacity onPress={() => {
                                setPreDelete(false)
                                focus(false)
                                deleteFile(file.fileId)
                            }} style={{
                            display: 'flex', 
                            flexDirection: 'row', 
                            width: '100%', 
                            justifyContent: 'center',
                            }}>
                                <Text style={{fontSize: 15, color: 'white', fontWeight: '600'}}>Delete</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{width: '50%',
                            borderColor: '#777',
                            borderRadius: 25,
                            backgroundColor: 'white',
                            borderWidth: 1,
                            paddingTop: '2%',
                            paddingBottom: '2%',
                            marginTop: '7%',
                            marginBottom: '10%',
                            marginLeft: '2%'}}>
                            <TouchableOpacity onPress={() => setPreDelete(false)} style={{
                            display: 'flex', 
                            flexDirection: 'row', 
                            width: '100%', 
                            justifyContent: 'center',
                            }}>
                                <Text style={{fontSize: 15, color: 'black', fontWeight: '600'}}>Cancel</Text>
                            </TouchableOpacity>
                        </View>


                        </View>
                    </View>
                </Modal>
            :
            <View style={{ paddingTop: '10%', backgroundColor: 'rgb(23 23 23)', height: '100%', width: '100%'}}>
                    {/*x button container */}
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: '5%'}}>
                      <Pressable onPress={() => focus(null)}>
                        <FontAwesomeIcon icon={faXmark} color={'white'} size={30}/>
                      </Pressable>
                    </View>
                    <View style={{paddingLeft: '5%'}}>
                    <Text style={{fontSize: 30, fontWeight: 'bold', color: 'white', marginTop: '5%'}}>{file.fileName}</Text>
                    <TouchableOpacity style={{ marginTop: '10%'}} onPress={() => alert('running rename function')}>
                        <Text style={{fontSize: 20, color: 'white'}}>Rename File</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: '10%'}} onPress={() => alert('running move function')}>
                        <Text style={{fontSize: 20, color: 'white'}}>Move File To...</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: '10%'}} onPress={() =>
                        setPreDelete(true)}>
                        <Text style={{fontSize: 20, color: 'red'}}>Delete File</Text>
                    </TouchableOpacity>
                </View>
            </View>
            }
        </Modal>
  )
}
export default FocusedFileComp
import { View, Text, Modal, TouchableOpacity, Pressable, TextInput } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faXmark, faFile } from '@fortawesome/free-solid-svg-icons'
import React, {useState} from 'react'

const FocusedFileComp = ({file, focus, deleteFile, renameFileFunction}) => {

    const [preDelete, setPreDelete] = useState(false)
    const [add, setAdd] = useState(false)
    const [newFileName, setNewFileName] = useState(file.fileName.split('.')[0]) 

    const renameFile = () => {
        const newFile = {
            ...file,
            fileName: newFileName + '.' + file.fileName.split('.')[1]
        }
        renameFileFunction(newFile)
    }

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
                    {add ?  
                            <>
                                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',  marginTop: '10%'}}>
                                    <FontAwesomeIcon icon={faFile} size={30} color='white'/>
                                    <TextInput value={newFileName} style={{color: 'white', fontSize: 20, fontWeight: 'bold', borderBottomColor: 'white', borderBottomWidth: 2, width: '70%', marginRight: '15%'}} onChangeText={(e) => setNewFileName(e)} autoFocus/>
                                </View>
                                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingRight: '5%', marginTop: '10%'}}>
                                    <View style={{width: '50%',
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
                                            onPress={() => {
                                                if (newFileName !== file.fileName.split('.')[0]) {
                                                    renameFile()
                                                    setNewFileName('')
                                                    setAdd(false)
                                                }
                                            }}
                                            >
                                                <Text style={{fontSize: 15, color: 'black', fontWeight: '600'}}>Save</Text>
                                            </TouchableOpacity>
                                    </View>
                                </View>
                            </>            
                            : 
                                <>
                                    <Text style={{fontSize: 30, fontWeight: 'bold', color: 'white', marginTop: '5%'}}>{file.fileName}</Text>
                                    <TouchableOpacity style={{ marginTop: '10%'}} onPress={() => setAdd(true)}>
                                        <Text style={{fontSize: 20, color: 'white'}}>Rename File</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ marginTop: '10%'}} onPress={() => alert('running move function')}>
                                        <Text style={{fontSize: 20, color: 'white'}}>Move File To...</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ marginTop: '10%'}} onPress={() =>
                                        setPreDelete(true)}>
                                        <Text style={{fontSize: 20, color: 'red'}}>Delete File</Text>
                                    </TouchableOpacity>
                                </>
                            }
                    </View>
            </View>
            }
        </Modal>
  )
}
export default FocusedFileComp
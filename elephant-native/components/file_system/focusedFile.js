import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'

const FocusedFileComp = ({file, focus}) => {
  return (
        <Modal animationType='slide' presentationStyle='pageSheet'>
            <View style={{backgroundColor: 'rgb(23, 23, 23)', height: '100%', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => focus(null)}>
                    <Text>{file.fileName}</Text>
                </TouchableOpacity>
            </View>
        </Modal>
  )
}
export default FocusedFileComp
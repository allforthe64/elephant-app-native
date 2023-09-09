import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import React, {useState} from 'react'

const UrlEditor = ({url, deleteFunc}) => {
    const [urlTitle, setUrlTitle] = useState('')
  return (
    <View style={styles.bigCon}>
        <View style={styles.container}>
            <TextInput value={urlTitle} onChangeText={(e) => setUrlTitle(e)} placeholder='Add title for url' placeholderTextColor={'rgb(0, 0, 0)'} style={styles.input} />
            <Text style={styles.url} numberOfLines={1}>{url}</Text>
        </View>
        <Button title='Delete' onPress={() => deleteFunc(url)}/>
    </View>
  )
}

export default UrlEditor

const styles = StyleSheet.create({
    bigCon: {
        marginBottom: '5%',
        borderWidth: 1,
        borderColor: 'red'
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingLeft: '7%',
        paddingRight: '7%'
    },
    input: {
        borderWidth: 1,
        width: '40%'
    },
    url: {
        width: '50%',
        overflow: 'hidden',
    }
})
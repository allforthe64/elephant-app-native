import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';

const Main = ({navigation: { navigate }}) => {
    const [clicked, setClicked] = useState('Not Clicked')

    const testHandler = () => {
      clicked === 'Not Clicked' ? setClicked('Clicked') : setClicked('Not Clicked')
    }
  
    return (
        <View style={styles.container}>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity onPress={() => navigate('Settings1')}>
                    <Text style={styles.input}>Item 1</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity onPress={() => navigate('Settings2')}>
                    <Text style={styles.input}>Item 2</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity onPress={() => navigate('Settings3')}>
                    <Text style={styles.input}>Item 3</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity onPress={() => navigate('Settings4')}>
                    <Text style={styles.input}>Item 4</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity onPress={() => navigate('Settings5')}>
                    <Text style={styles.input}>Item 5</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}
  
const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: 'rgb(23,23,23)',
    alignItems: 'center',
    justifyContent: 'space-evenly',
},
modal: {
    width: '85%',
    height: '60%',
    backgroundColor: 'rgba(0, 0, 0, .5)',
    paddingTop: '30%'
},
bigHeader: {
    color: 'white',
    fontSize: 40,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: '2.5%'
},
subheading: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18
},

buttonWrapper: {
    width: '44%',
    borderBottomWidth: .5,
    borderColor: 'white',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '2%'
},
input: {
    color: 'white',
    width: '50%',
    fontSize: 30,
    textAlign: 'center'
}
});

export default Main
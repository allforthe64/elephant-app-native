import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './settingsStackScreens/main';
import Screen1 from './settingsStackScreens/screen1';
import Screen2 from './settingsStackScreens/screen2';
import Screen3 from './settingsStackScreens/screen3';
import Screen4 from './settingsStackScreens/screen4';
import Screen5 from './settingsStackScreens/screen5';
import { AuthContext } from '../context/authContext';
import { useContext } from 'react';
const Stack = createStackNavigator()

export default function Settings({navigation: {navigate}}) {

  const {authUser} = useContext(AuthContext)

  if (!authUser) navigate('Home')

  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={Main} options={{headerShown: false}}/>
      <Stack.Screen name="Settings1" component={Screen1} />
      <Stack.Screen name="Settings2" component={Screen2} />
      <Stack.Screen name="Settings3" component={Screen3} />
      <Stack.Screen name="Settings4" component={Screen4} />
      <Stack.Screen name="Settings5" component={Screen5} />
    </Stack.Navigator> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(23,23,23)',
    alignItems: 'center',
    justifyContent: 'center',
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
  wrapperContainer: {
    flex: 1,
    alignItems: 'center'
  },
  buttonWrapper: {
    paddingTop: '5%',
    width: '50%'
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: '50%'
  }
});
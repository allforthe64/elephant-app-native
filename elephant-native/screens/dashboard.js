import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import DashMain from './dashboardStackScreens/dashMain';
import Files from './dashboardStackScreens/files';
import Notepad from './dashboardStackScreens/notepad';

const Stack = createStackNavigator()

export default function Dashboard() {

  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard-Main" component={DashMain} options={{headerShown: false}}/>
      <Stack.Screen name="Files" component={Files} />
      <Stack.Screen name="Notepad" component={Notepad} />
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
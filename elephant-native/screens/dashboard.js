import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import DashMain from './dashboardStackScreens/dashMain';
import Files from './dashboardStackScreens/files';
import Notepad from './dashboardStackScreens/notepad';
import CameraComponent from './dashboardStackScreens/camera';
import AudioRecorder from './dashboardStackScreens/audioRecorder';
import FilePicker from './dashboardStackScreens/documentPicker';
import BarcodeScanner from './dashboardStackScreens/barcodeScanner';
import Scanner from './dashboardStackScreens/barcodeScanner';
import DocScanner from './dashboardStackScreens/docScanner';

const Stack = createStackNavigator()

export default function Dashboard() {

  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashMain} options={{headerShown: false}}/>
      <Stack.Screen name="Files" component={Files} />
      <Stack.Screen name="Notepad" component={Notepad} />
      <Stack.Screen name="Camera" component={CameraComponent} />
      <Stack.Screen name="Record Audio" component={AudioRecorder} />
      <Stack.Screen name="Upload A File" component={FilePicker} />
      <Stack.Screen name='QR Scanner' component={Scanner} />
      <Stack.Screen name='Scan Document' component={DocScanner} />
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
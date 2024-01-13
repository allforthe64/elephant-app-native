import React from 'react'

import { AuthContextProvider } from './context/authContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Main from './screens/main';
import { ToastProvider } from 'react-native-toast-notifications';


export default function App() {


  return (
    <SafeAreaProvider>
      <AuthContextProvider>
        <ToastProvider placement='top' offsetTop={150} duration={2000}>
          <Main />
        </ToastProvider>
      </AuthContextProvider> 
    </SafeAreaProvider>
  );
}
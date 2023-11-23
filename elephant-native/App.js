import React from 'react'

import { AuthContextProvider } from './context/authContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Main from './screens/main';


export default function App() {

  return (
    <SafeAreaProvider>
      <AuthContextProvider>
        <Main />
      </AuthContextProvider> 
    </SafeAreaProvider>
  );
}
import React from 'react'

import { AuthContextProvider } from './context/authContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Main from './screens/main';
import { ToastProvider } from 'react-native-toast-notifications';

import { setNativeExceptionHandler, setJSExceptionHandler } from 'react-native-exception-handler';
import * as Sentry from '@sentry/react-native';


Sentry.init({
  dsn: 'https://d460ada50918758584a197b5b1d0793e@o4507346968772608.ingest.us.sentry.io/4507346971328512',
});

setNativeExceptionHandler((errorString) => {
  Sentry.captureException(new Error(errorString))
});

setJSExceptionHandler((error, isFatal) => {
  const sentryId = Sentry.captureException(new Error(error.name));
})



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
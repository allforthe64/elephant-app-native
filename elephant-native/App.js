import React from 'react'

import { AuthContextProvider } from './context/authContext';
import Main from './screens/main';


export default function App() {

  return (
      <AuthContextProvider>
        <Main />
      </AuthContextProvider> 
  );
}
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { firebaseAuth } from './firebaseConfig';

import Home from './screens/home';
import About from './screens/about';
import Contact from './screens/contact';
import Dashboard from './screens/dashboard';
import Settings from './screens/settings';
import Login from './screens/login';
import ThankYou from './screens/thankYou';

import { LoginContextProvider } from './context/loginContext';
import Main from './screens/main';

const Drawer = createDrawerNavigator();

export default function App() {

  const auth = firebaseAuth

  return (
      <LoginContextProvider>
        <Main />
      </LoginContextProvider> 
  );
}
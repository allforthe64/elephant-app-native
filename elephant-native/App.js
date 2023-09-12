import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import Home from './screens/home';
import About from './screens/about';
import Contact from './screens/contact';
import Dashboard from './screens/dashboard';
import Settings from './screens/settings';
import Login from './screens/login';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Sign In/Sign Up" component={Login} />
        <Drawer.Screen name="About" component={About} />
        <Drawer.Screen name="Contact" component={Contact} />
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        <Drawer.Screen name="Settings" component={Settings} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
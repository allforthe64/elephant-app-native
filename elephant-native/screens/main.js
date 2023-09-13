import React, {useContext} from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { firebaseAuth } from '../firebaseConfig';

import Home from './home';
import About from './about';
import Contact from './contact';
import Dashboard from './dashboard';
import Settings from './settings';
import Login from './login';
import ThankYou from './thankYou';
import { LoginContext } from '../context/loginContext';

const Drawer = createDrawerNavigator();

export default function App() {

  const auth = firebaseAuth

  const {loggedIn} = useContext(LoginContext)
  console.log(loggedIn)

  return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
              <Drawer.Screen name="Home" component={Home} />
              <Drawer.Screen name="About" component={About} />
              <Drawer.Screen name="Contact" component={Contact} />
              <Drawer.Screen name="Dashboard" component={Dashboard} options={!loggedIn ? {drawerItemStyle: {display: 'none'}, title: ''} : {drawerItemStyle: {display: 'flex'}, title: 'Dashboard'}} />
              <Drawer.Screen name="Settings" component={Settings} options={!loggedIn && {drawerItemStyle: {display: 'none'}, title: ''}} />
              <Drawer.Screen name="Sign In/Sign Up" component={Login}/>
              <Drawer.Screen name="Registration Complete" component={ThankYou} options={{drawerItemStyle: {height: 0}, title: ''}}/>
            </Drawer.Navigator>
        </NavigationContainer>
  );
}
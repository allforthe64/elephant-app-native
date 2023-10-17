import React, {useContext, useEffect} from 'react';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { firebaseAuth } from '../firebaseConfig';
import { Button } from 'react-native'

import Home from './home';
import About from './about';
import Contact from './contact';
import Dashboard from './dashboard';
import Settings from './settings';
import Login from './login';
import ThankYou from './thankYou';
import { AuthContext } from '../context/authContext';
import { onAuthStateChanged } from '@firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

export default function App() {

  const auth = firebaseAuth

  const {authUser, setAuthUser} = useContext(AuthContext)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        setAuthUser(user)
      })
    
  }, [])

  useEffect(() => {

    const getStorage = async () => {
      const currentUser = await AsyncStorage.getItem('loggedIn')
      console.log(currentUser)
      if (currentUser !== 'false') {
        console.log('in false loop')
        setAuthUser(currentUser)
      }
    }
    getStorage()
  }, [])

  console.log(auth)

  return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
              <Drawer.Screen name="Home" component={Home} options={authUser && {drawerItemStyle: {display: 'none'}, title: ''}}/>
              <Drawer.Screen name="About" component={About} />
              <Drawer.Screen name="Contact" component={Contact} />
              <Drawer.Screen name="Dashboard" component={Dashboard} options={!authUser && {drawerItemStyle: {display: 'none'}, title: ''}} />
              <Drawer.Screen name="Settings" component={Settings} options={!authUser && {drawerItemStyle: {display: 'none'}, title: ''}} />
              <Drawer.Screen name="Sign In/Sign Up" component={Login} options={authUser && {drawerItemStyle: {display: 'none'}, title: ''}}/>
              <Drawer.Screen name="Registration Complete" component={ThankYou} options={{drawerItemStyle: {height: 0}, title: ''}}/>
            </Drawer.Navigator>
        </NavigationContainer>
  );
}
import { createDrawerNavigator } from '@react-navigation/drawer';
import About from '../screens/about';
import Home from '../screens/home';

const Drawer = createDrawerNavigator();

export default function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="About" component={About} />
    </Drawer.Navigator>
  );
}


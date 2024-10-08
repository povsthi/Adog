import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn'; 
import Home from './screens/Home';
import ProfilePet from './screens/ProfilePet'; 
import Nots from './screens/Notfications'
import { HeaderLogo, HeaderRightIcon } from './components/Header'; 
import SplashScreen from './screens/SplashScreen';
import SettingsScreen from './screens/Settings';
import Register from './screens/Register';

const Stack = createStackNavigator();

const defaultScreenOptions = {
  headerTitle: () => <HeaderLogo />,
  headerStyle: {
    backgroundColor: '#212A75',
  },
};

function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={defaultScreenOptions}>
        <Stack.Screen 
          name="splash" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        /> 
        <Stack.Screen 
          name="signup" 
          component={SignUp} 
          options={{
            headerStyle: {
              ...defaultScreenOptions.headerStyle,
              paddingTop: 20,
            },
          }}
        />
        <Stack.Screen 
          name="signin" 
          component={SignIn} 
        />
        <Stack.Screen 
          name="register" 
          component={Register} 
        />
        <Stack.Screen 
          name="home" 
          component={Home} 
          options={{
            headerRight: () => <HeaderRightIcon name="bell" onPress={() => {}} />,
          }}
        />
        <Stack.Screen 
          name="notifications" 
          component={Nots} 
          options={{
            headerRight: () => <HeaderRightIcon name="arrow-left" onPress={() => {}} />,
          }}
        />
        <Stack.Screen
          name="profilepet"
          component={ProfilePet} 
          options={{
            headerRight: () => <HeaderRightIcon name="arrow-back" onPress={() => {}} />,
          }}
        />
         <Stack.Screen 
          name="settings" 
          component={SettingsScreen} 
          options={{
            headerRight: () => <HeaderRightIcon name="bell" onPress={() => {}} />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;



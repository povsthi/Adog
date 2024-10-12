import React from 'react';
import { Stack } from 'expo-router'
import { HeaderLogo, HeaderRightIcon } from '../components/Header'; 

export default function Layout() {
  return (
    <Stack
    screenOptions={{
        headerTitle: () => <HeaderLogo />,
        headerStyle: {
            backgroundColor: '#212A75',
        },
        
        headerTintColor: "#FFF"
    }}>
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

    </Stack>
  );
}


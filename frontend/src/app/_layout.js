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
                name="index" 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="signup" 
                component={SignUp} 
            />
            <Stack.Screen 
                name="signin" 
                component={SignIn} 
            />
            <Stack.Screen 
                name="dashboard" 
                component={DashboardLayout} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="petprofile" 
                component={ProfilePet} 
            />

    </Stack>
  );
}


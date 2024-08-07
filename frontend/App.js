import React from 'react';
import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

import Routes from './src/router';
import SignIn from './src/screens/SignIn'


export default function App() {
    let [fontsLoaded, fontError] = useFonts({
      Montserrat_400Regular,
      Montserrat_500Medium,
      Montserrat_700Bold
    });
  
    if (!fontsLoaded && !fontError) {
      return null;
    }

  return (
    <>
      <StatusBar style="light" backgroundColor="#000" translucent={false} />
      <Routes />
      
    </>
  );
}




import React from 'react';
import { Stack, useNavigationState } from 'expo-router';
import { HeaderLogo } from '../components/Header';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 

export default function Layout() {
  const router = useRouter(); 

  const handleNotificationPress = () => {
    router.push('/notifications'); 
  };

  const handleLogoPress = () => {
    router.push('/dashboard'); 
  };

  return (
    <Stack
      screenOptions={{
        headerTitle: () => (
          <TouchableOpacity onPress={handleLogoPress}>
            <HeaderLogo />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: '#212A75',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false, 
          headerRight: () => ( 
            <TouchableOpacity onPress={handleNotificationPress} style={{ marginRight: 10 }}>
              <Ionicons name="notifications-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          ),
        }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{
          headerTitleStyle: {
            marginTop: 100,
            padding: 100
          }
        }}
      />
      <Stack.Screen 
        name="signin" 
      />
      <Stack.Screen 
        name="dashboard" 
      />
      <Stack.Screen 
        name="petprofile" 
      />
      <Stack.Screen 
        name="notifications" 
      />
      <Stack.Screen 
        name="addanounce" 
      />
      <Stack.Screen 
        name="veterinarians" 
      />
    </Stack>
  );
} 













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

  return (
    <Stack
      screenOptions={{
        headerTitle: () => <HeaderLogo />,
        headerStyle: {
          backgroundColor: '#212A75',
        },
        headerTintColor: '#FFF',
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false, 
          headerRight: () => ( 
              <TouchableOpacity onPress={handleNotificationPress} style={{ marginRight: 10 }}>
                <Ionicons name="notifications-outline" size={24} color="#FFF" />
              </TouchableOpacity>
          ),
        }} 
      />
      <Stack.Screen 
        name="signup" 
      />
      <Stack.Screen 
        name="signin" 
      />
      <Stack.Screen 
        name="dashboard" 
        options={{ headerShown: false }} 
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












import { Tabs } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index" 
        options={{
          headerShown: false,
          title: "Início",
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused ? 'paw' : 'paw-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="search" 
        options={{
          headerShown: false,
          title: "Buscar",
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = 'search';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="add-pet" 
        options={{
          headerShown: false,
          title: "Adicionar Pet",
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused ? 'add-circle' : 'add-circle-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="favorites" 
        options={{
          headerShown: false,
          title: "Favoritos",
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused ? 'star' : 'star-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="settings" 
        options={{
          headerShown: false,
          title: "Configurações",
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused ? 'settings' : 'settings-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        }}
      />
    </Tabs>
  );
}
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Feather } from '@expo/vector-icons';

import Home from '../app/Home'; 
import Search from '../app/SearchScreen';
import AddPet from '../app/dashboard/AddPet';
import Favorites from '../app/Favorites';
import SettingsScreen from '../app/Settings';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'paw' : 'paw-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'AddPet') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'star' : 'star-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'menu';
            if (iconName === 'menu') {
              return <Feather name={iconName} size={size} color={color} />;
            } else {
              return <Ionicons name={iconName} size={size} color={color} />;
            }
          }
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="AddPet" component={AddPet} />
      <Tab.Screen name="Favorites" component={Favorites} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomNavigation;



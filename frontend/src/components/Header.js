import React from 'react';
import { Image, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const HeaderLogo = () => (
  <View style={styles.logoContainer}>
    <Image
      source={require('../../assets/LogoAdog.png')} 
      style={styles.logo}
      resizeMode="contain" 
    />
  </View>
);

const HeaderRightIcon = ({ name, onPress }) => (
  <TouchableOpacity style={styles.headerRight} onPress={onPress}>
    <Feather name={name} size={24} color="white" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  logo: {
    height: 40,  
    width: 150,
  },
  headerRight: {
    marginRight: 15,
  },
});

export { HeaderLogo, HeaderRightIcon };


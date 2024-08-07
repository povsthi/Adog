import React from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const HeaderLogo = () => (
  <Image source={require('../../assets/LogoAdog.png')} style={styles.logo} />
);

const HeaderRightIcon = ({ name, onPress }) => (
  <TouchableOpacity style={styles.headerRight} onPress={onPress}>
    <Feather name={name} size={24} color="white" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  logo: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  headerRight: {
    marginRight: 15,
  },
});

export { HeaderLogo, HeaderRightIcon };


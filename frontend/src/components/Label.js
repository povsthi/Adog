import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Label = ({ text }) => {
    return <Text style={styles.label}>{text}</Text>;
  };
  
  const styles = StyleSheet.create({
    label: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#000',
      marginBottom: 5,
    },
  });
  
  export default Label;
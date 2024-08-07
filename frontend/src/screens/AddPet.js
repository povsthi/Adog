import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import BottomNavigation from '../components/BottomNavigation';


const AddPet = () => {
  return (
    <View style={styles.container}>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
      </ScrollView>
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 15,
  },
});

export default AddPet;
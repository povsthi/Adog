import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import PetCard from '../../components/PetCard';


const Home = () => {
  const [pets, setPets] = useState([]);
  const fetchPets = async () => {
    try {
      const response = await fetch('http://192.168.2.107:3001/pets'); 
      const data = await response.json();
      setPets(data); 
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
    }
  };

  useEffect(() => {
    fetchPets(); 
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {pets.map((pet, index) => (
          <PetCard key={index} pet={pet} />
        ))}
      </ScrollView>
      
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

export default Home;




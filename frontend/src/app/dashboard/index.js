import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import PetCard from '../../components/PetCard';
import { useRouter } from 'expo-router';

const Home = () => {
  const [pets, setPets] = useState([]);
  const router = useRouter(); 

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

  const handlePetClick = (pet) => {
    router.push({
      pathname: '/petprofile',
      params: { pet }, 
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {pets.map((pet, index) => (
          <PetCard key={index} pet={pet} onPress={() => handlePetClick(pet)} /> 
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





import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import PetCard from '../../components/PetCard';
import { useRouter } from 'expo-router';
import { storeData } from '../storage';

const Home = () => {
  const [pets, setPets] = useState([]);
  const router = useRouter();

  const fetchPets = async () => {
    try {
      const response = await fetch('http://192.168.3.29:3001/pets'); 
      const data = await response.json();
      
      const mappedData = data.map((pet) => ({
        nome: pet.Nome,
        raca: pet.Raca,
        comportamento: pet.Comportamento,
        idade: pet.Idade,
        cidade: pet.Cidade,
        foto: pet.Foto, 
      }));
      
      setPets(mappedData);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
    }
  };

  useEffect(() => {
    fetchPets(); 
  }, []);

  const handlePetClick = async (pet) => {
    await storeData(pet);  
    router.push('/petprofile');  
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





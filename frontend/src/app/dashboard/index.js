import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import PetCard from '../../components/PetCard';
import { useRouter, useFocusEffect } from 'expo-router';
import { storeData } from '../storage';
import ipConf from '../ipconfig';
const Home = () => {
  const [pets, setPets] = useState([]);
  const router = useRouter();

  const fetchPets = async () => {
    try {
      const response = await fetch(`${ipConf()}/pets`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      console.log("Resposta da API:", data); 
      setPets(data);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPets();
    }, [])
  );

  const handlePetClick = async (pet) => {
    if (pet?.ID_Animal) {  
      await storeData(pet.ID_Animal);  
      router.push('/petprofile');
    } else {
      console.error('Pet ID não encontrado: ', pet);  
    }
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





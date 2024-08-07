import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import PetCard from '../components/PetCard';
import BottomNavigation from '../components/BottomNavigation';


const pets = [
  {
    nome: 'Logan',
    raca: 'Vira-lata',
    localizacao: 'Cataguases-MG',
    distance: '23 km',
    image: 'images.jpeg',
  },
  {
    nome: 'Pantera',
    raca: 'Pastor Alemão',
    localizacao: 'Leopoldina-MG',
    distancia: '5 km',
    image: 'images.jpeg',
  },
  {
    nome: 'Lya',
    raca: 'Golden Retriever',
    localizacao: 'Vista Alegre-MG',
    distancia: '16.3 km',
    image: 'images.jpeg',
  },
  {
    nome: 'Max',
    raca: 'Persa',
    localizacao: 'Leopoldina-MG',
    distancia: '16.3 km',
    image: 'images.jpeg',
  },
];

const Favorites = () => {
  return (
    <View style={styles.container}>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {pets.map((pet, index) => (
          <PetCard key={index} pet={pet} />
        ))}
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

export default Favorites;
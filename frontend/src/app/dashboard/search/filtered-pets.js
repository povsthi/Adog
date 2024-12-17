import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useSearchParams, useRouter } from 'expo-router'; 
import PetCard from '../../../components/PetCard'; 
import { storeData } from '../storage';

const FilteredPets = () => {
  const router = useRouter(); 
  const { pets } = useSearchParams(); 

  let petsList = [];
  try {
    petsList = pets ? JSON.parse(pets) : []; 
  } catch (error) {
    console.error('Erro ao processar a lista de pets:', error);
    petsList = [];
  }


  const handlePetClick = async (pet) => {
    if (pet?.ID_Animal) {
      await storeData(pet.ID_Animal); 
      router.push('/petprofile'); 
    } else {
      console.error('ID do Pet não encontrado:', pet);
    }
  };

  return (
    <View style={styles.container}>
      {petsList.length > 0 ? (
        <FlatList
          data={petsList}
          keyExtractor={(item) => item.ID_Animal.toString()} 
          renderItem={({ item }) => (
            <PetCard pet={item} onPress={() => handlePetClick(item)} /> 
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.noPetsText}>
          Nenhum pet encontrado com os filtros selecionados.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  noPetsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    marginTop: 20,
  },
});

export default FilteredPets;


import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet } from 'react-native';
import PetCard from '../../components/PetCard';

const SearchPets = () => {
  const [pets, setPets] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredPets, setFilteredPets] = useState([]);

  const fetchPets = async () => {
    try {
      const response = await fetch('http://192.168.2.107:3001/pets');
      const data = await response.json();
      setPets(data);
      setFilteredPets(data);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const filterPets = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = pets.filter((pet) =>
        pet.nome.toLowerCase().includes(text.toLowerCase()) ||
        pet.raca.toLowerCase().includes(text.toLowerCase()) ||
        (pet.cidade && pet.cidade.toLowerCase().includes(text.toLowerCase()))
      );
      setFilteredPets(filtered);
    } else {
      setFilteredPets(pets);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Pesquisar pets..."
        value={searchText}
        onChangeText={(text) => filterPets(text)}
      />
      <FlatList
        data={filteredPets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PetCard pet={item} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 50,
    borderColor: '#000080',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    margin: 15,
    fontSize: 16,
  },
  listContainer: {
    padding: 15,
  },
});

export default SearchPets;

import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PetCard from '../../components/PetCard';

const SearchPets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false); 

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      Alert.alert('Erro', 'Por favor, insira um nome para pesquisar.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/pets?nome=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setPets(data);
      } else {
        Alert.alert('Erro', 'Não foi possível realizar a pesquisa.');
      }
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao buscar os pets.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          { borderColor: isFocused ? '#4CAF50' : '#ccc' }, 
        ]}
      >
        <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Digite o nome do pet"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          placeholderTextColor="#aaa"
          onFocus={() => setIsFocused(true)} 
          onBlur={() => setIsFocused(false)}  
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : pets.length > 0 ? (
        <ScrollView style={styles.resultsContainer}>
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onPress={() => Alert.alert('Detalhes do Pet', `Você selecionou ${pet.Nome}`)}
            />
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noResultsText}>Nenhum pet encontrado.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
    paddingLeft: 10,
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingLeft: 30, 
    color: '#000',
  },
  resultsContainer: {
    marginTop: 10,
  },
  noResultsText: {
    marginTop: 20,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default SearchPets;





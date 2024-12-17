import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PetCard from '../../components/PetCard';
import ipConf from '../ipconfig';
import { useRouter } from 'expo-router';

const SearchPets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
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

  useEffect(() => {
    fetchPets();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      Alert.alert('Erro', 'Por favor, insira um nome para pesquisar.');
      return;
    }

  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          { borderColor: isFocused ? '#212A75' : '#ccc' },
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
        <Ionicons
          name="filter-outline"
          size={24}
          color="#212A75"
          style={styles.filterIcon}
          onPress={() => router.replace('/filter')} 
        />
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#212A75" />
      ) : pets.length > 0 ? (
        <ScrollView style={styles.resultsContainer}>
          {pets
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (val.Nome && typeof val.Nome === 'string' && val.Nome.toLowerCase().includes(searchTerm.toLowerCase())) {
                return val;
              }
            })
            .map((pet) => (
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
    color: '#212A75',
  },
  filterIcon: {
    marginLeft: 10,
    zIndex: 1,
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




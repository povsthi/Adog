import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PetCard from '../components/PetCard';
import ipConf from './ipconfig';
import { storeData } from './storage';
import { useRouter } from 'expo-router';

const FilterPets = () => {
  const [animalType, setAnimalType] = useState('');
  const [petSex, setPetSex] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [size, setSize] = useState('');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${ipConf()}/pets`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Resposta da API:', data);

      const filteredPets = data.filter((pet) => {
        return (
          (!animalType || pet.Tipo?.toLowerCase() === animalType.toLowerCase()) &&
          (!breed || pet.Raca?.toLowerCase().includes(breed.toLowerCase())) &&
          (!age || parseInt(pet.Idade, 10) === parseInt(age, 10)) &&
          (!petSex || pet.Sexo?.toLowerCase() === petSex.toLowerCase()) &&
          (!size || pet.Porte?.toLowerCase() === size.toLowerCase())
        );
      });

      setPets(filteredPets);
      if (filteredPets.length === 0) {
        Alert.alert('Nenhum pet encontrado', 'Tente modificar os filtros.');
      }
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
      Alert.alert('Erro', 'Não foi possível carregar os pets.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    if (!animalType) {
      Alert.alert('Erro', 'Por favor, selecione o tipo de animal.');
      return;
    }
    fetchPets();
  };

  const handlePetClick = async (pet) => {
      if (pet?.ID_Animal) {  
        await storeData(pet.ID_Animal);  
        router.push('/petprofile');
      } else {
        console.error('Pet ID não encontrado: ', pet);  
      }
    };

  return (
    <ScrollView style={styles.container}>
      {/* Seção de seleção de tipo de animal */}
      <Text style={styles.label}>Escolha o tipo de animal *</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          onPress={() => setAnimalType('Cachorro')}
          style={[styles.radioButton, animalType === 'Cachorro' && styles.selected]}
        >
          <Text style={styles.radioButtonText}>Cachorro</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setAnimalType('Gato')}
          style={[styles.radioButton, animalType === 'Gato' && styles.selected]}
        >
          <Text style={styles.radioButtonText}>Gato</Text>
        </TouchableOpacity>
      </View>

      {/* Seção de seleção de raça */}
      <Text style={styles.label}>Raça</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a raça"
        value={breed}
        onChangeText={setBreed}
      />

      {/* Seção de seleção de idade */}
      <Text style={styles.label}>Idade (anos)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Digite a idade"
        value={age}
        onChangeText={setAge}
      />

      {/* Seção de seleção de sexo */}
      <Text style={styles.label}>Sexo</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          onPress={() => setPetSex('M')}
          style={[styles.radioButton, petSex === 'M' && styles.selected]}
        >
          <Text style={styles.radioButtonText}>Macho</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPetSex('F')}
          style={[styles.radioButton, petSex === 'F' && styles.selected]}
        >
          <Text style={styles.radioButtonText}>Fêmea</Text>
        </TouchableOpacity>
      </View>

      {/* Seção de seleção de porte */}
      <Text style={styles.label}>Porte</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          onPress={() => setSize('Pequeno')}
          style={[styles.radioButton, size === 'Pequeno' && styles.selected]}
        >
          <Text style={styles.radioButtonText}>Pequeno</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSize('Médio')}
          style={[styles.radioButton, size === 'Médio' && styles.selected]}
        >
          <Text style={styles.radioButtonText}>Médio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSize('Grande')}
          style={[styles.radioButton, size === 'Grande' && styles.selected]}
        >
          <Text style={styles.radioButtonText}>Grande</Text>
        </TouchableOpacity>
      </View>

      {/* Botão de aplicação de filtros */}
      <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
        <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
      </TouchableOpacity>

      {/* Exibição de resultados */}
      {loading ? (
        <ActivityIndicator size="large" color="#212A75" />
      ) : (
        <ScrollView style={styles.resultsContainer}>
          {pets.length > 0 ? (
            pets.map((pet) => (
              <PetCard
                key={pet.ID_Animal}
                pet={pet}
                onPress={() => handlePetClick(pet)}
              />
            ))
          ) : (
            <Text style={styles.noResultsText}>Nenhum pet encontrado.</Text>
          )}
        </ScrollView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  radioButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  selected: {
    borderColor: '#212A75',
  },
  radioButtonText: {
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  applyButton: {
    marginTop: 10,
    backgroundColor: '#212A75',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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

export default FilterPets;

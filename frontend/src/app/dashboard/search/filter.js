import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRouter } from 'expo-router';

const Filter = () => {
  const [animalType, setAnimalType] = useState('');
  const [petSex, setPetSex] = useState('');
  const [breed, setBreed] = useState(null);
  const [breedOpen, setBreedOpen] = useState(false);
  const [breedItems, setBreedItems] = useState([]);
  const [age, setAge] = useState('');
  const [size, setSize] = useState('');
  const [loadingBreeds, setLoadingBreeds] = useState(false);
  const router = useRouter();


  const fetchBreeds = async (type) => {
    let url = '';
    if (type === 'cachorro') {
      url = 'https://api.thedogapi.com/v1/breeds';
    } else if (type === 'gato') {
      url = 'https://api.thecatapi.com/v1/breeds';
    }

    try {
      setLoadingBreeds(true);
      const response = await fetch(url);
      const data = await response.json();
      const breedOptions = data.map(breed => ({
        label: breed.name,
        value: breed.name,
      }));
      setBreedItems(breedOptions);
      setBreed(null); 
    } catch (error) {
      console.error('Erro ao buscar raças:', error);
      Alert.alert('Erro', 'Não foi possível carregar as raças.');
    } finally {
      setLoadingBreeds(false);
    }
  };

  useEffect(() => {
    if (animalType) {
      fetchBreeds(animalType);
    }
  }, [animalType]);

  const fetchFilteredPets = async () => {
    const porteMap = { P: 'pequeno', M: 'médio', G: 'grande' };
  
    const params = new URLSearchParams({
      tipo: animalType,              
      raca: breed,                  
      idade: age,                   
      sexo: petSex === 'Macho' ? 'M' : petSex === 'Femea' ? 'F' : '', 
      porte: porteMap[size],         
    });
  
    try {
      const response = await fetch(`${ipConf()}/pets/filtrar?${params.toString()}`);
      const data = await response.json();
  
      if (data.length > 0) {
        console.log('Pets filtrados:', data);
        router.push({
          pathname: '/dashboard/search/filtered-pets', 
          params: { pets: JSON.stringify(data) }, 
        });
      } else {
        alert('Nenhum pet encontrado com os filtros selecionados.');
      }
    } catch (error) {
      console.error('Erro ao buscar pets filtrados:', error);
      alert('Erro ao buscar os pets filtrados. Tente novamente mais tarde.');
    }
  };
  
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Seção de seleção de tipo de animal */}
        <Text style={styles.label}>Escolha o tipo de animal que procura *</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            onPress={() => setAnimalType('cachorro')}
            style={[styles.radioButton, animalType === 'cachorro' && styles.selected]}
          >
            <Text style={styles.radioButtonText}>Cachorro</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setAnimalType('gato')}
            style={[styles.radioButton, animalType === 'gato' && styles.selected]}
          >
            <Text style={styles.radioButtonText}>Gato</Text>
          </TouchableOpacity>
        </View>

        {/* Seção de seleção da raça com DropDownPicker */}
        <Text style={styles.label}>Raças disponíveis</Text>
        <DropDownPicker
          open={breedOpen}
          value={breed}
          items={breedItems}
          setOpen={setBreedOpen}
          setValue={setBreed}
          setItems={setBreedItems}
          placeholder={loadingBreeds ? 'Carregando raças...' : 'Selecione uma raça'}
          style={styles.dropdown}
          dropDownContainerStyle={{ borderColor: '#ccc' }}
          disabled={loadingBreeds}
        />

        {/* Seção de seleção de idade */}
        <Text style={styles.label}>Idade (de 0 a 20) *</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
          placeholder="Idade do pet"
        />

        {/* Seção de seleção do sexo do pet */}
        <Text style={styles.label}>Sexo do pet (opcional)</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            onPress={() => setPetSex('Macho')}
            style={[styles.radioButton, petSex === 'Macho' && styles.selected]}
          >
            <Text style={styles.radioButtonText}>Macho</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPetSex('Femea')}
            style={[styles.radioButton, petSex === 'Femea' && styles.selected]}
          >
            <Text style={styles.radioButtonText}>Fêmea</Text>
          </TouchableOpacity>
        </View>

        {/* Seção de seleção de porte */}
        <Text style={styles.label}>Porte *</Text>
        <View style={styles.sizeGroup}>
          <TouchableOpacity
            onPress={() => setSize('P')}
            style={[styles.sizeButton, size === 'P' && styles.selected]}
          >
            <Text style={styles.sizeText}>P</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSize('M')}
            style={[styles.sizeButton, size === 'M' && styles.selected]}
          >
            <Text style={styles.sizeText}>M</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSize('G')}
            style={[styles.sizeButton, size === 'G' && styles.selected]}
          >
            <Text style={styles.sizeText}>G</Text>
          </TouchableOpacity>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={fetchFilteredPets}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
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
  dropdown: {
    marginBottom: 10,
    borderColor: '#ccc',
  },
  sizeGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sizeButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  sizeText: {
    color: '#333',
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: '#212A75',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Filter;

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import BottomNavigation from '../components/BottomNavigation';
import CustomTextInput from '../components/CustomTextInput';
import ImageUploader from '../components/ImageUploader';

const AddPet = () => {
  const [nomePet, setNomePet] = useState('');
  const [tipoPet, setTipoPet] = useState('');
  const [raca, setRaca] = useState('');
  const [sexo, setSexo] = useState('');
  const [porte, setPorte] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [breeds, setBreeds] = useState([]);
  const [outroTipo, setOutroTipo] = useState('');

  useEffect(() => {
    fetch('https://api.thedogapi.com/v1/breeds')
      .then(response => response.json())
      .then(data => {
        const breedOptions = data.map(breed => ({
          label: breed.name,
          value: breed.name,
        }));
        setBreeds(breedOptions);
      })
      .catch(error => {
        console.error('Erro ao buscar raças:', error);
      });
  }, []);

  const RegistraPet = async () => {
    const petData = { 
      nomePet, 
      tipoPet: tipoPet === 'Outro' ? outroTipo : tipoPet,
      raca, 
      sexo, 
      porte, 
      dataNascimento 
    };
    try {
      const response = await fetch('http://200.18.141.196:3001/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      });

      if (response.ok) {
        console.log('Pet cadastrado com sucesso');
      } else {
        console.error('Erro ao cadastrar o pet');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  return (
    <View style={styles.container}>
      <CustomTextInput
        placeholder="Nome do Pet"
        value={nomePet}
        onChangeText={setNomePet}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tipoPet}
          onValueChange={(itemValue) => setTipoPet(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione o tipo do pet" value="" />
          <Picker.Item label="Cachorro" value="Cachorro" />
          <Picker.Item label="Gato" value="Gato" />
          <Picker.Item label="Outro" value="Outro" />
        </Picker>
      </View>
      {tipoPet === 'Outro' && (
        <CustomTextInput
          placeholder="Digite o tipo do pet"
          value={outroTipo}
          onChangeText={setOutroTipo}
        />
      )}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sexo}
          onValueChange={(itemValue) => setSexo(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione o sexo..." value="" />
          <Picker.Item label="Macho" value="Macho" />
          <Picker.Item label="Fêmea" value="Fêmea" />
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={raca}
          onValueChange={(itemValue) => setRaca(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione a raça do cão..." value="" />
          {breeds.map((breed) => (
            <Picker.Item key={breed.value} label={breed.label} value={breed.value} />
          ))}
        </Picker>
      </View>
      <CustomTextInput
        placeholder="Porte"
        value={porte}
        onChangeText={setPorte}
      />
      <CustomTextInput
        placeholder="Data de Nascimento"
        value={dataNascimento}
        onChangeText={setDataNascimento}
      />
      <TouchableOpacity onPress={RegistraPet}>
          <Text style={styles.button}>Cadastrar</Text>
        </TouchableOpacity>
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  button: {
    margin: 10,
    padding: 15,
    backgroundColor: '#212A75',
    borderRadius: 100,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  pickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
  },
  picker: {
    height: 40,
    color: 'black',
  },
});

export default AddPet;



import React, { useState } from 'react';
import { View, Text, TextInput, Picker, Button, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Filter = () => {
  const [animalType, setAnimalType] = useState('cachorro');
  const [petSex, setPetSex] = useState('Macho');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [size, setSize] = useState('P');

  return (
    <View style={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity style={styles.backButton}>
      
      </TouchableOpacity>


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

      {/* Seção de seleção de raças */}
      <Text style={styles.label}>Raças disponíveis</Text>
      <Picker
        selectedValue={breed}
        style={styles.picker}
        onValueChange={(itemValue) => setBreed(itemValue)}
      >
        <Picker.Item label="Raça 1" value="raca1" />
        <Picker.Item label="Raça 2" value="raca2" />
        <Picker.Item label="Raça 3" value="raca3" />
      </Picker>

      {/* Seção de seleção de idade */}
      <Text style={styles.label}>Idade (de 0 a 20) *</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
        placeholder="Idade do pet"
      />

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
      <TouchableOpacity style={styles.saveButton} onPress={() => alert('Informações salvas!')}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F6F8',
  },
  backButton: {
    marginTop: 20,
    paddingLeft: 10,
  },
  backText: {
    fontSize: 16,
    color: '#3498DB',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginVertical: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  radioButton: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#3498DB',
    width: '40%',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#3498DB',
  },
  radioButtonText: {
    color: '#2C3E50',
    fontSize: 14,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#3498DB',
    borderRadius: 10,
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#3498DB',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16,
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  sizeGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  sizeButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3498DB',
    borderRadius: 15,
    padding: 15,
    width: 60,
    alignItems: 'center',
  },
  sizeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  saveButton: {
    backgroundColor: '#3498DB',
    borderRadius: 15,
    paddingVertical: 15,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default Filter;
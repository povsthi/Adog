import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import CustomTextInput from '../../components/CustomTextInput';
import RNPickerSelect from 'react-native-picker-select';
import { launchImageLibrary } from 'react-native-image-picker';

const AddPet = () => {
  const [nomePet, setNomePet] = useState('');
  const [tipoPet, setTipoPet] = useState('');
  const [raca, setRaca] = useState('');
  const [sexo, setSexo] = useState('');
  const [porte, setPorte] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [breeds, setBreeds] = useState([]);
  const [outroTipo, setOutroTipo] = useState('');
  const [foto, setFoto] = useState(null); 

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
        console.error('Erro ao buscar raça:', error);
      });
  }, []);

  const selecionarFoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets) {
        setFoto(response.assets[0]); 
      }
    });
  };

  const RegistraPet = async () => {
    const petData = new FormData();
    petData.append('nomePet', nomePet);
    petData.append('tipoPet', tipoPet === 'Outro' ? outroTipo : tipoPet);
    petData.append('raca', raca);
    petData.append('sexo', sexo);
    petData.append('porte', porte);
    petData.append('dataNascimento', dataNascimento);

    if (foto) {
      petData.append('foto', {
        uri: foto.uri,
        type: foto.type,
        name: foto.fileName,
      });
    }

    try {
      const response = await fetch('http://192.168.2.107:3001/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: petData,
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
      <CustomTextInput placeholder="Nome do Pet" value={nomePet} onChangeText={setNomePet} />
      <RNPickerSelect
        onValueChange={(value) => setTipoPet(value)}
        items={[
          { label: 'Selecione o tipo do pet', value: '' },
          { label: 'Cachorro', value: 'Cachorro' },
          { label: 'Gato', value: 'Gato' },
          { label: 'Outro', value: 'Outro' },
        ]}
        placeholder={{ label: 'Selecione o tipo do pet', value: '' }}
        style={pickerStyles}
        value={tipoPet}
      />
      {tipoPet === 'Outro' && (
        <CustomTextInput placeholder="Digite o tipo do pet" value={outroTipo} onChangeText={setOutroTipo} />
      )}
      <RNPickerSelect
        onValueChange={(value) => setSexo(value)}
        items={[
          { label: 'Selecione o sexo...', value: '' },
          { label: 'Macho', value: 'Macho' },
          { label: 'Fêmea', value: 'Fêmea' },
        ]}
        placeholder={{ label: 'Selecione o sexo...', value: '' }}
        style={pickerStyles}
        value={sexo}
      />
      <RNPickerSelect
        onValueChange={(value) => setRaca(value)}
        items={[
          { label: 'Selecione a raça do cão...', value: '' },
          ...breeds,
        ]}
        placeholder={{ label: 'Selecione a raça do cão...', value: '' }}
        style={pickerStyles}
        value={raca}
      />
      <CustomTextInput placeholder="Porte" value={porte} onChangeText={setPorte} />
      <CustomTextInput placeholder="Data de Nascimento" value={dataNascimento} onChangeText={setDataNascimento} />

      <TouchableOpacity onPress={selecionarFoto}>
        <Text style={styles.button}>Selecionar Foto</Text>
      </TouchableOpacity>

      {foto && <Image source={{ uri: foto.uri }} style={{ width: 100, height: 100 }} />}

      <TouchableOpacity onPress={RegistraPet}>
        <Text style={styles.button}>Cadastrar</Text>
      </TouchableOpacity>

      
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
});

const pickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: '#333',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: '#333',
    paddingRight: 30,
  },
  placeholder: {
    color: '#999',
  },
});

export default AddPet;





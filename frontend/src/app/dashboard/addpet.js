import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import CustomTextInput from '../../components/CustomTextInput';
import RNPickerSelect from 'react-native-picker-select';
import { launchImageLibrary } from 'react-native-image-picker';

const formatData = (text) => {
  let data = text.replace(/\D/g, '');
  if (data.length > 8) {
    data = data.slice(0, 8);
  }
  data = data.replace(/(\d{2})(\d)/, '$1/$2');
  data = data.replace(/(\d{2})(\d)/, '$1/$2');
  return data;
};

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
  const [loading, setLoading] = useState(false);

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
      if (response.didCancel) {
        console.log('Usuário cancelou a seleção de imagem');
      } else if (response.errorMessage) {
        console.error('Erro ao selecionar imagem:', response.errorMessage);
      } else if (response.assets) {
        setFoto(response.assets[0]);
      }
    });
  };

  const validarFormulario = () => {
    if (!nomePet || !tipoPet || !raca || !sexo || !porte || !dataNascimento) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    return true;
  };

  const RegistraPet = async () => {
    if (!validarFormulario()) return;

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
      setLoading(true);
      const response = await fetch('http://localhost:3001/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: petData,
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Pet cadastrado com sucesso!');
        setNomePet('');
        setTipoPet('');
        setRaca('');
        setSexo('');
        setPorte('');
        setDataNascimento('');
        setOutroTipo('');
        setFoto(null);
      } else {
        const errorText = await response.text();
        console.error('Erro ao cadastrar o pet:', errorText);
        Alert.alert('Erro', 'Erro ao cadastrar o pet.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert('Erro', 'Erro na requisição.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.fotoContainer} onPress={selecionarFoto}>
        {foto ? (
          <Image source={{ uri: foto.uri }} style={styles.foto} />
        ) : (
          <Text style={styles.fotoPlaceholder}>+</Text>
        )}
      </TouchableOpacity>

      <CustomTextInput placeholder="Nome" value={nomePet} onChangeText={setNomePet} />
      <CustomTextInput placeholder="Idade" value={dataNascimento} onChangeText={text => setDataNascimento(formatData(text))} />

      <RNPickerSelect
        onValueChange={(value) => setTipoPet(value)}
        items={[ 
          { label: 'Cachorro', value: 'Cachorro' },
          { label: 'Gato', value: 'Gato' },
        ]}
        placeholder={{ label: 'Tipo de pet', value: '' }}
        style={pickerStyles}
        value={tipoPet}
      />

      <RNPickerSelect
        onValueChange={(value) => setPorte(value)}
        items={[
          { label: 'Pequeno', value: 'Pequeno' },
          { label: 'Médio', value: 'Médio' },
          { label: 'Grande', value: 'Grande' },
        ]}
        placeholder={{ label: 'Porte', value: '' }}
        style={pickerStyles}
        value={porte}
      />

      <RNPickerSelect
        onValueChange={(value) => setRaca(value)}
        items={breeds}
        placeholder={{ label: 'Raça', value: '' }}
        style={pickerStyles}
        value={raca}
      />

      <RNPickerSelect
        onValueChange={(value) => setSexo(value)}
        items={[
          { label: 'Macho', value: 'Macho' },
          { label: 'Fêmea', value: 'Fêmea' },
        ]}
        placeholder={{ label: 'Sexo', value: '' }}
        style={pickerStyles}
        value={sexo}
      />

      <CustomTextInput placeholder="Cidade" />
      <CustomTextInput placeholder="Rua" />

      <TouchableOpacity style={styles.button} onPress={RegistraPet} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  fotoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  foto: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  fotoPlaceholder: {
    fontSize: 24,
    color: '#ccc',
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#212A75',
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
    marginVertical: 10,
    width: '90%',
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
    marginVertical: 10,
    width: '90%',
  },
  placeholder: {
    color: '#999',
  },
});

export default AddPet;






import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import CustomTextInput from '../../components/CustomTextInput';
import DropDownPicker from 'react-native-dropdown-picker';
import { getUserId } from '../storage';
import ipConf from '../ipconfig';
import { uploadImage } from '../uploadImage';
import * as ImagePicker from 'expo-image-picker';

const AddPet = () => {
  const [nomePet, setNomePet] = useState('');
  const [tipoPet, setTipoPet] = useState('');
  const [raca, setRaca] = useState('');
  const [sexo, setSexo] = useState('');
  const [porte, setPorte] = useState('');
  const [comportamento, setComportamento] = useState('');
  const [idade, setIdade] = useState('');
  const [cidade, setCidade] = useState('');
  const [rua, setRua] = useState('');
  const [breeds, setBreeds] = useState([]);
  const [outroTipo, setOutroTipo] = useState('');
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [idUsuario, setIdUsuario] = useState(null);

  // Estados para gerenciar abertura dos menus DropDownPicker
  const [openTipo, setOpenTipo] = useState(false);
  const [openRaca, setOpenRaca] = useState(false);
  const [openPorte, setOpenPorte] = useState(false);
  const [openSexo, setOpenSexo] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setIdUsuario(id);
      console.log('ID do Usuário:', id);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchBreeds = async () => {
      let url = '';
      if (tipoPet === 'Cachorro') {
        url = 'https://api.thedogapi.com/v1/breeds';
      } else if (tipoPet === 'Gato') {
        url = 'https://api.thecatapi.com/v1/breeds';
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        const breedOptions = data.map(breed => ({
          label: breed.name,
          value: breed.name,
        }));
        setBreeds(breedOptions);
      } catch (error) {
        console.error('Erro ao buscar raça:', error);
      }
    };

    if (tipoPet) {
      fetchBreeds();
    }
  }, [tipoPet]);

  const selecionarFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0]);
    }
  };

  const validarFormulario = () => {
    if (!nomePet || !tipoPet || !raca || !sexo || !porte || !comportamento || !idade || !cidade || !rua) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    return true;
  };

  const RegistraPet = async () => {
    if (!validarFormulario()) return;

    console.log('Iniciando o registro do pet...');

    const petData = new FormData();
    petData.append('nome', nomePet);
    petData.append('tipo', tipoPet === 'Outro' ? outroTipo : tipoPet);
    petData.append('raca', raca);
    petData.append('sexo', sexo);
    petData.append('porte', porte);
    petData.append('comportamento', comportamento);
    petData.append('idade', idade);
    petData.append('cidade', cidade);
    petData.append('rua', rua);
    petData.append('fk_usuario_id', idUsuario);

    if (foto) {
      try {
        const imageUrl = await uploadImage(foto.uri);
        petData.append('foto', imageUrl);
      } catch (error) {
        console.error('Erro ao fazer upload da foto:', error);
        Alert.alert('Erro', 'Erro ao carregar a imagem.');
        return;
      }
    }

    try {
      setLoading(true);
      const response = await fetch(`${ipConf()}/pets`, {
        method: 'POST',
        body: petData
      });

      console.log('Resposta do servidor:', response);

      if (response.ok) {
        Alert.alert('Sucesso', 'Pet cadastrado com sucesso!');
        console.log('Cadastro realizado com sucesso.');
        setNomePet('');
        setTipoPet('');
        setRaca('');
        setSexo('');
        setPorte('');
        setIdade('');
        setCidade('');
        setRua('');
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
      <CustomTextInput placeholder="Idade" value={idade} onChangeText={setIdade} />

      <DropDownPicker
        open={openTipo}
        setOpen={setOpenTipo}
        items={[{ label: 'Cachorro', value: 'Cachorro' }, { label: 'Gato', value: 'Gato' }, { label: 'Outro', value: 'Outro' }]}
        value={tipoPet}
        setValue={setTipoPet}
        placeholder="Tipo de pet"
        containerStyle={styles.pickerContainer}
        style={styles.picker}
      />

      {tipoPet && tipoPet !== 'Outro' && (
        <DropDownPicker
          open={openRaca}
          setOpen={setOpenRaca}
          items={breeds}
          value={raca}
          setValue={setRaca}
          placeholder="Raça"
          containerStyle={styles.pickerContainer}
          style={styles.picker}
        />
      )}

      <DropDownPicker
        open={openPorte}
        setOpen={setOpenPorte}
        items={[{ label: 'Pequeno', value: 'Pequeno' }, { label: 'Médio', value: 'Médio' }, { label: 'Grande', value: 'Grande' }]}
        value={porte}
        setValue={setPorte}
        placeholder="Porte"
        containerStyle={styles.pickerContainer}
        style={styles.picker}
      />

      <DropDownPicker
        open={openSexo}
        setOpen={setOpenSexo}
        items={[{ label: 'Macho', value: 'Macho' }, { label: 'Fêmea', value: 'Fêmea' }]}
        value={sexo}
        setValue={setSexo}
        placeholder="Sexo"
        containerStyle={styles.pickerContainer}
        style={styles.picker}
      />

      <CustomTextInput placeholder="Comportamento" value={comportamento} onChangeText={setComportamento} />
      <CustomTextInput placeholder="Cidade" value={cidade} onChangeText={setCidade} />
      <CustomTextInput placeholder="Rua" value={rua} onChangeText={setRua} />

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
  pickerContainer: {
    width: '90%',
    marginBottom: 10,
  },
  picker: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
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

export default AddPet;









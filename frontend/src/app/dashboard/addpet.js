import React, { useState, useEffect } from 'react';
import { ScrollView, KeyboardAvoidingView, TouchableOpacity, Text, StyleSheet, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import CustomTextInput from '../../components/CustomTextInput';
import DropDownPicker from 'react-native-dropdown-picker';
import { getUserId } from '../storage';
import ipConf from '../ipconfig';
import uploadImage  from '../uploadImage';
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
  const [fotoUrl, setFotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [idUsuario, setIdUsuario] = useState(null);

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
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Acesso à galeria negado.');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setFoto(imageUri);
  
        try {
          const uploadedUrl = await uploadImage(imageUri);
          if (uploadedUrl) {
            setFotoUrl(uploadedUrl); 
            Alert.alert('Sucesso!', 'Imagem enviada com sucesso.');
          } else {
            throw new Error('A URL retornada está inválida.');
          }
        } catch (uploadError) {
          console.error('Erro ao fazer upload da imagem:', uploadError);
          Alert.alert('Erro', 'Não foi possível enviar a imagem. Tente novamente.');
          setFoto(null); 
        }
      } else {
        Alert.alert('Cancelado', 'Nenhuma imagem foi selecionada.');
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };
  

  const validarFormulario = () => {
    if (!nomePet || !tipoPet || !raca || !sexo || !porte || !comportamento || !idade || !foto || !cidade || !rua) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    return true;
  };

  const RegistraPet = async () => {
    if (!validarFormulario()) return;
  
    const petData = {
      nome: nomePet,
      tipo: tipoPet === 'Outro' ? outroTipo : tipoPet,
      raca: raca,
      sexo: sexo,
      porte: porte,
      comportamento: comportamento,
      idade: idade,
      foto: fotoUrl,  
      cidade: cidade,
      rua: rua,
      fk_usuario_id: idUsuario
    };

    console.log('Pet data:', petData);
  
    try {
      setLoading(true);
      const response = await fetch(`${ipConf()}/pets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(petData),
      });
  
      const json = await response.json();
      if (response.ok) {
        Alert.alert('Sucesso', 'Pet cadastrado com sucesso!');
        setNomePet('');
        setTipoPet('');
        setRaca('');
        setSexo('');
        setPorte('');
        setIdade('');
        setCidade('');
        setRua('');
        setOutroTipo('');
        setComportamento('');
        setFoto(null);
        setFotoUrl('');
      } else {
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
          items={[
            { label: 'Cachorro', value: 'Cachorro' },
            { label: 'Gato', value: 'Gato' },
            { label: 'Outro', value: 'Outro' },
          ]}
          value={tipoPet}
          setValue={setTipoPet}
          placeholder="Tipo de pet"
          containerStyle={[styles.pickerContainer, { zIndex: 4 }]}
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
            containerStyle={[styles.pickerContainer, { zIndex: 3 }]}
            style={styles.picker}
          />
        )}

        <DropDownPicker
          open={openPorte}
          setOpen={setOpenPorte}
          items={[
            { label: 'Pequeno', value: 'Pequeno' },
            { label: 'Médio', value: 'Médio' },
            { label: 'Grande', value: 'Grande' },
          ]}
          value={porte}
          setValue={setPorte}
          placeholder="Porte"
          containerStyle={[styles.pickerContainer, { zIndex: 2 }]}
          style={styles.picker}
        />

        <DropDownPicker
          open={openSexo}
          setOpen={setOpenSexo}
          items={[
            { label: 'Macho', value: 'Macho' },
            { label: 'Fêmea', value: 'Fêmea' },
          ]}
          value={sexo}
          setValue={setSexo}
          placeholder="Sexo"
          containerStyle={[styles.pickerContainer, { zIndex: 1 }]}
          style={styles.picker}
        />

        <CustomTextInput placeholder="Comportamento" value={comportamento} onChangeText={setComportamento} />
        <CustomTextInput placeholder="Cidade" value={cidade} onChangeText={setCidade} />
        <CustomTextInput placeholder="Rua" value={rua} onChangeText={setRua} />

        <TouchableOpacity style={styles.button} onPress={RegistraPet} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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









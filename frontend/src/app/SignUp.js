import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import CustomTextInput from '../components/CustomTextInput';
import RoundedButton from '../components/RoundedButton';
import Label from '../components/Label';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { storeUserId } from './storage';
import ipConf from './ipconfig';
import uploadImage from './uploadImage';

const SignUp = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [data, setDataNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [moradia, setMoradia] = useState('');
  const [foto, setFoto] = useState(null); 
  const [fotoUrl, setFotoUrl] = useState(''); 
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const router = useRouter();

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão de localização negada. Por favor, habilite as permissões de localização.');
        return;
      }
      const locationServicesEnabled = await Location.hasServicesEnabledAsync();
      if (!locationServicesEnabled) {
        Alert.alert('Erro', 'Os serviços de localização estão desativados. Habilite-os nas configurações do dispositivo.');
        return;
      }
      getCurrentLocation();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema ao solicitar permissões de localização.');
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível obter sua localização. Verifique suas configurações de localização.');
    }
  };

  const formatData = (text) => {
    let data = text.replace(/\D/g, '');

    if (data.length > 8) {
      data = data.slice(0, 8);
    }

    data = data.replace(/(\d{2})(\d)/, '$1/$2');
    data = data.replace(/(\d{2})(\d)/, '$1/$2');

    return data;
  };


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

        const uploadedUrl = await uploadImage(imageUri);
        setFotoUrl(uploadedUrl); 
        Alert.alert('Sucesso!', 'Imagem enviada com sucesso.');
      } else {
        Alert.alert('Cancelado', 'Nenhuma imagem foi selecionada.');
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const Cadastrar = async () => {
    if (!nome || !email || !senha || !confirmarSenha || !moradia || !fotoUrl) {
        Alert.alert('Erro', 'Todos os campos são obrigatórios!');
        return;
    }

    if (senha !== confirmarSenha) {
        Alert.alert('Erro!', 'Senhas diferentes');
        return;
    }

    if (location.latitude === null || location.longitude === null) {
      Alert.alert('Erro', 'Localização não disponível.');
      return;
    }

    const userObj = {
      nome,                  
      email,                
      senha,                 
      tipo: 'comum',         
      foto: fotoUrl,         
      data_nascimento: data, 
      morada: moradia,       
      latitude: location.latitude, 
      longitude: location.longitude, 
      usuario_tipo: 'usuário', 
    };
    

    try {
        const response = await fetch(`${ipConf()}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(userObj),
        });

        const json = await response.json();
        console.log(json);

        if (response.status === 201 && json.id) {
            await storeUserId(json.id.toString());
            router.replace('/dashboard');
        } else {
          router.replace('/dashboard');
        }
    } catch (err) {
        console.error('Erro no cadastro:', err);
        Alert.alert('Erro', 'Ocorreu um erro no cadastro.');
    }
};

  
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Adicione as suas informações</Text>

          <TouchableOpacity style={styles.fotoContainer} onPress={selecionarFoto}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.foto} />
            ) : (
              <Text style={styles.fotoPlaceholder}>+</Text>
            )}
          </TouchableOpacity>

          <Label text="Nome" />
          <CustomTextInput
            placeholder="Digite seu nome"
            value={nome}
            onChangeText={setNome}
          />

          <Label text="E-mail" />
          <CustomTextInput
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
          />

          <Label text="Data de Nascimento" />
          <CustomTextInput 
          placeholder="DD/MM/AAAA"
          value={data} 
          onChangeText={text => setDataNascimento(formatData(text))} 
          />

          <Label text="Tipo de Moradia" />
          <TouchableOpacity onPress={() => setMoradia('Casa')}>
            <Text
              style={[styles.option, moradia === 'Casa' && styles.selectedOption]}
            >
              Casa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMoradia('Apartamento')}>
            <Text
              style={[
                styles.option,
                moradia === 'Apartamento' && styles.selectedOption,
              ]}
            >
              Apartamento
            </Text>
          </TouchableOpacity>

          <Label text="Senha" />
          <CustomTextInput
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!showPassword}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="grey"
                />
              </TouchableOpacity>
            }
          />

          <Label text="Confirmar Senha" />
          <CustomTextInput
            placeholder="Confirme sua senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry={!showPassword}
          />

          <RoundedButton title="Cadastrar" onPress={Cadastrar} />
          <TouchableOpacity onPress={() => router.push('/signin')}>
            <Text style={styles.signInText}>Já tenho conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#F7F7F7',
    width: '100%',
    maxWidth: 400,
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  fotoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', 
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
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    textAlign: 'center',
  },
  selectedOption: {
    borderColor: '#000',
    backgroundColor: '#d3d3d3',
  },
  signInText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#308FF',
    textDecorationLine: 'underline',
  },
});

export default SignUp;



import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import * as Location from 'expo-location';
import CustomTextInput from '../components/CustomTextInput';
import RoundedButton from '../components/RoundedButton';
import Label from '../components/Label';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { storeUserId } from './storage';

const SignUp = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [data, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [moradia, setMoradia] = useState('');
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

  const formatCPF = (text) => {
    let cpf = text.replace(/\D/g, '');

    if (cpf.length > 11) {
        cpf = cpf.slice(0, 11);
    }

    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    return cpf;
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

  const Cadastrar = async () => { 
    if (!nome || !email || !senha || !confirmarSenha || !cpf || !moradia) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios!');
      return;
    }
  
    if (senha !== confirmarSenha) {
      Alert.alert('Erro!', 'Senhas diferentes');
      return;
    }
  
    const userObj = { nome, email, senha, cpf, moradia, latitude: location.latitude, longitude: location.longitude };
    const jsonBody = JSON.stringify(userObj);
    console.log(jsonBody);
  
    try {
      const response = await fetch('http://192.168.3.29:3001/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: jsonBody,
      });
  
      const json = await response.json();
      console.log("Resposta do servidor:", json);
  
      if (json.affectedRows && json.affectedRows > 0) {
        if (json.userId) {
          await storeUserId(json.id); 
        }
        router.replace('/dashboard');
      } else {
        Alert.alert('Erro', 'Falha no cadastro. Tente novamente.');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Erro', 'Ocorreu um erro no cadastro.');
    }
  };
  

  return (
    <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
          <Text style={styles.title}>Adicione as suas informações</Text>

          <Label text="Nome" />
          <CustomTextInput placeholder="Digite seu nome" value={nome} onChangeText={setNome} />

          <Label text="E-mail" />
          <CustomTextInput placeholder="Digite seu e-mail" value={email} onChangeText={setEmail} />

          <Label text="Data de Nascimento" />
          <CustomTextInput placeholder="DD/MM/AAAA" value={data} onChangeText={text => setDataNascimento(formatData(text))} />

          <Label text="Tipo de Moradia" />
          <TouchableOpacity onPress={() => setMoradia('Casa')}>
            <Text style={[styles.option, moradia === 'Casa' && styles.selectedOption]}>Casa</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMoradia('Apartamento')}>
            <Text style={[styles.option, moradia === 'Apartamento' && styles.selectedOption]}>Apartamento</Text>
          </TouchableOpacity>

          <Label text="CPF" />
          <CustomTextInput placeholder="Digite seu CPF" value={cpf} onChangeText={text => setCpf(formatCPF(text))} />

          <Label text="Senha" />
          <CustomTextInput
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!showPassword}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="grey" />
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
    borderColor: '#000000', 
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
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
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
    borderColor: '#000080',
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



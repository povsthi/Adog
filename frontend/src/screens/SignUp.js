import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import * as Location from 'expo-location';
import CustomTextInput from '../components/CustomTextInput';
import RoundedButton from '../components/RoundedButton';

const SignUp = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [data, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null });

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

  const Cadastrar = () => {
    if (!nome || !email || !senha || !confirmarSenha || !cpf) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios!');
      return;
    }
  
    if (senha !== confirmarSenha) {
      Alert.alert('Erro!', 'Senhas diferentes');
      return;
    }
  
    const userObj = { nome, email, senha, cpf, latitude: location.latitude, longitude: location.longitude };
    const jsonBody = JSON.stringify(userObj);
    console.log(jsonBody);
  
    fetch('http://192.168.2.107:3001/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: jsonBody,
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("Resposta do servidor:", json); // Verificar resposta
        if (json.affectedRows && json.affectedRows > 0) {
          console.log("Redirecionando para home...");
          navigation.navigate('home'); // Navegação
        } else {
          Alert.alert('Erro', 'Falha no cadastro. Tente novamente.');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <CustomTextInput label="Nome" placeholder="Digite seu nome" value={nome} onChangeText={setNome} />
        <CustomTextInput label="E-mail" placeholder="Digite seu e-mail" value={email} onChangeText={setEmail} />
        <CustomTextInput label="Data de Nascimento" placeholder="Digite sua data de nascimento" value={data} onChangeText={setDataNascimento} />
        <CustomTextInput label="CPF" placeholder="Digite seu CPF" value={cpf} onChangeText={setCpf} />
        <CustomTextInput label="Senha" placeholder="Digite sua senha" value={senha} onChangeText={setSenha} secureTextEntry />
        <CustomTextInput label="Confirmar Senha" placeholder="Confirme sua senha" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />
        <RoundedButton title="Cadastrar" onPress={Cadastrar} />
        <TouchableOpacity onPress={() => navigation.navigate('signin')}>
          <Text style={styles.signInText}>Já tenho conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    width: '100%',
  },
  signInText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#308FF',
    textDecorationLine: 'underline',
  },
});

export default SignUp;





import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service'; // Adiciona o geolocation
import CustomTextInput from '../components/CustomTextInput';
import RoundedButton from '../components/RoundedButton';

const SignUp = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [data, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [estado, setEstado] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null }); 

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permissão de Localização',
          message: 'Precisamos acessar sua localização para completar o cadastro.',
          buttonNeutral: 'Pergunte-me depois',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        Alert.alert('Erro', 'Permissão de localização negada.');
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível obter sua localização.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
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

    const userObj = { nome, email, senha, latitude: location.latitude, longitude: location.longitude };
    const jsonBody = JSON.stringify(userObj);
    console.log(jsonBody);

    fetch('http://localhost:3001/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: jsonBody,
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        navigation.goBack();
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



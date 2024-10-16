import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import CustomTextInput from '../components/CustomTextInput';
import RoundedButton from '../components/RoundedButton';
import { useRouter } from 'expo-router';

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const verificarLogin = () => {
    var userObj = { email: email, senha: senha };
    var jsonBody = JSON.stringify(userObj);

    fetch('http://192.168.2.107:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: jsonBody,
    })
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        try {
          const json = JSON.parse(text);
          if (json.mensagem === 'Usuário válido') {
            router.replace('/dashboard');
          } else {
            console.log('Erro: Usuário inválido');
          }
        } catch (error) {
          console.error('Erro ao fazer parse do JSON: ', error);
        }
      })
      .catch((err) => {
        console.log('Erro ao verificar login: ', err);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.formContainer}>
      <CustomTextInput
        label="E-mail"
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
      />
      <CustomTextInput
        label="Senha"
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <RoundedButton title="Entrar" onPress={verificarLogin} />

      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.signUpText}>Criar conta</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  formContainer: {
    borderColor: '#000000', 
    borderWidth: 1, 
    borderRadius: 10, 
    padding: 20,
    backgroundColor: '#F7F7F7', 
    width: '100%',
    maxWidth: 400, 
  },
  signUpText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#308FF',
    textDecorationLine: 'underline',
  },
});

export default SignIn;



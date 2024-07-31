import React, { useState } from 'react';
import { Image, SafeAreaView, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import CustomTextInput from '../components/CustomTextInput';

const SignIn = ({ navigation }) => {
  console.log("Cadastro feito com sucesso!");
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const verificarLogin = () => {
    console.log("Verificando Login");
    var userObj = { email: email, senha: senha };
    var jsonBody = JSON.stringify(userObj);
    console.log(jsonBody);
    fetch('http://adog.linceonline.com.br:3306/login;', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: jsonBody,
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        if (json.mensagem === 'Usuário válido') {
          navigation.navigate('Home');
        } else {
          console.log("Erro: Usuário inválido");
        }
      })
      .catch((err) => {
        console.log("Erro ao verificar login: ", err);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <CustomTextInput label="E-mail" placeholder="Digite seu e-mail" value={email} onChangeText={setEmail} />
        <CustomTextInput label="Senha" placeholder="Digite sua senha" value={senha} onChangeText={setSenha} secureTextEntry />
        <TouchableOpacity onPress={verificarLogin}>
          <Text style={styles.button}>
            Entrar
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 10,
    padding: 15,
    backgroundColor: '#F3BD0F',
    borderRadius: 20,
    textAlign: 'center',
    color: 'white',
  },
});

export default SignIn;

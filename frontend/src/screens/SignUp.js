import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import CustomTextInput from '../components/CustomTextInput';
import RoundedButton from '../components/RoundedButton';
import RNPickerSelect from 'react-native-picker-select';

const SignUp = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [data, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => response.json())
      .then(data => setEstados(data.map(estado => ({
        label: estado.sigla,
        value: estado.id
      }))))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (estado) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`)
        .then(response => response.json())
        .then(data => setCidades(data.map(cidade => ({
          label: cidade.nome,
          value: cidade.id
        }))))
        .catch(err => console.log(err));
    }
  }, [estado]);

  const Cadastrar = () => {
    if (!nome || !email || !senha || !confirmarSenha || !cpf || !estado || !cidade || !rua || !numero) {
      Alert.alert("Erro", "Todos os campos são obrigatórios!");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro!", "Senhas diferentes");
      return;
    }

    const userObj = { nome, email, senha };
    const jsonBody = JSON.stringify(userObj);
    console.log(jsonBody);

    fetch('http://200.18.141.196:3001/usuarios', {
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
        navigation.goBack(); 
      })
      .catch(err => {
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
        
        <Text style={styles.label}>Estado</Text>
        <RNPickerSelect
          onValueChange={(value) => setEstado(value)}
          items={estados}
          placeholder={{ label: 'Selecione um estado', value: null }}
          style={pickerStyles}
          value={estado}
        />

        <Text style={styles.label}>Cidade</Text>
        <RNPickerSelect
          onValueChange={(value) => setCidade(value)}
          items={cidades}
          placeholder={{ label: 'Selecione uma cidade', value: null }}
          style={pickerStyles}
          value={cidade}
          disabled={!estado}  // Disable if no state is selected
        />

        <CustomTextInput label="Rua" placeholder="Digite sua rua" value={rua} onChangeText={setRua} />
        <CustomTextInput label="Número" placeholder="Digite o número" value={numero} onChangeText={setNumero} keyboardType="numeric" />
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
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    color: '#333', 
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

export default SignUp;


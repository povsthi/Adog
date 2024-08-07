import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Picker } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CustomTextInput from '../components/CustomTextInput';
import ImageUploader from '../components/ImageUploader';


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
      .then(data => setEstados(data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (estado) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`)
        .then(response => response.json())
        .then(data => setCidades(data))
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

    fetch('http://200.18.141.196:3001/usuarios;', {
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
        
        <Text>Estado</Text>
        <Picker
          selectedValue={estado}
          onValueChange={(itemValue) => setEstado(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione um estado" value="" />
          {estados.map(estado => (
            <Picker.Item key={estado.id} label={estado.sigla} value={estado.id} />
          ))}
        </Picker>

        <Text>Cidade</Text>
        <Picker
          selectedValue={cidade}
          onValueChange={(itemValue) => setCidade(itemValue)}
          style={styles.picker}
          enabled={estado !== ''}
        >
          <Picker.Item label="Selecione uma cidade" value="" />
          {cidades.map(cidade => (
            <Picker.Item key={cidade.id} label={cidade.nome} value={cidade.id} />
          ))}
        </Picker>

        <CustomTextInput label="Rua" placeholder="Digite sua rua" value={rua} onChangeText={setRua} />
        <CustomTextInput label="Número" placeholder="Digite o número" value={numero} onChangeText={setNumero} keyboardType="numeric" />
        <CustomTextInput label="Senha" placeholder="Digite sua senha" value={senha} onChangeText={setSenha} secureTextEntry />
        <CustomTextInput label="Confirmar Senha" placeholder="Confirme sua senha" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />
        <TouchableOpacity onPress={Cadastrar}>
          <Text style={styles.button}>Cadastrar</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  button: {
    margin: 10,
    padding: 15,
    backgroundColor: '#212A75',
    borderRadius: 100,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  signInText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#308FF',
    textDecorationLine: 'underline',
  },
  picker: {
    width: '100%',
    height: 50,
    marginBottom: 20,
  },
});

export default SignUp;

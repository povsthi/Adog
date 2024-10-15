import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import ImageUploader from '../components/ImageUploader'; 

const EditUser = ({ navigation, route }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [photoUrl, setPhotoUrl] = useState(null); 
  const { idUsuario } = route.params;

  useEffect(() => {
    async function fetchItem() {
      try {
        let response = await fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        let resJson = await response.json();
        if (resJson.length > 0) {
          setNome(resJson[0].nome);
          setEmail(resJson[0].email);
          setPhotoUrl(resJson[0].photoUrl);
        }
      } catch (e) {
        console.log("Erro ao buscar usuário:", e);
      }
    }
    fetchItem();
  }, [idUsuario]);

  const handleImageUpload = (url) => {
    setPhotoUrl(url); 
  };

  const Atualizar = async () => {
    var userObj = { nome: nome, email: email, senha: senha, photoUrl: photoUrl }; 
    var jsonBody = JSON.stringify(userObj);
    try {
      let response = await fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: jsonBody,
      });
      let json = await response.json();
      navigation.goBack();
    } catch (err) {
      console.log("Erro ao atualizar usuário:", err);
    }
  };

  return (
    <View style={styles.container}>
      <ImageUploader onImageUpload={handleImageUpload} /> 

      {photoUrl ? (
        <Image source={{ uri: photoUrl }} style={styles.profileImage} />
      ) : (
        <Text>Nenhuma imagem selecionada</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        placeholder="Senha"
        secureTextEntry
      />
      <TouchableOpacity onPress={Atualizar}>
        <Text style={styles.button}>Atualizar</Text>
      </TouchableOpacity>
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
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: '80%',
    marginBottom: 10,
  },
  button: {
    padding: 15,
    backgroundColor: '#28a745',
    borderRadius: 10,
    color: 'white',
    textAlign: 'center',
    width: '80%',
    marginTop: 10,
  },
});

export default EditUser;

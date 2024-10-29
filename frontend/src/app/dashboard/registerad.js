import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';

const RegisterAd = () => {
  const [tipo, setTipo] = useState('');
  const [nomeParceiro, setNomeParceiro] = useState('');
  const [telefone, setTelefone] = useState('');
  const [ruaParceiro, setRuaParceiro] = useState('');
  const [numeroParceiro, setNumeroParceiro] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCadastrar = () => {
    const anuncioData = {
      tipo,
      nomeParceiro,
      telefone,
      ruaParceiro,
      numeroParceiro,
      image: selectedImage,
    };

    if (!tipo || !nomeParceiro || !telefone || !ruaParceiro || !numeroParceiro || !selectedImage) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    fetch('http://seu-servidor.com/anuncios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(anuncioData),
    })
      .then(response => response.json())
      .then(data => {
        Alert.alert('Sucesso', 'Anúncio cadastrado com sucesso!');
        console.log('Dados enviados:', data);
      })
      .catch(error => {
        console.error('Erro ao cadastrar o anúncio:', error);
        Alert.alert('Erro', 'Falha ao cadastrar o anúncio.');
      });
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permissão necessária', 'Você precisa permitir o acesso às suas fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backButton}>{"<"}</Text>
        </TouchableOpacity>
        <Image 
          source={require('./assents/LogoAdog.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <View style={styles.placeholder} />
      </View>

      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={handleImagePicker} style={styles.uploadButton}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
          ) : (
            <Text style={styles.uploadText}>+</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.imageText}>Adicione uma foto do parceiro</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Tipo de Anúncio (ex: Adoção, Parceria):"
          value={tipo}
          onChangeText={setTipo}
        />

        <TextInput
          style={styles.input}
          placeholder="Nome do Parceiro:"
          value={nomeParceiro}
          onChangeText={setNomeParceiro}
        />

        <TextInput
          style={styles.input}
          placeholder="Telefone de Contato:"
          value={telefone}
          onChangeText={setTelefone}
        />

        <TextInput
          style={styles.input}
          placeholder="Rua do Parceiro:"
          value={ruaParceiro}
          onChangeText={setRuaParceiro}
        />

        <TextInput
          style={styles.input}
          placeholder="Número do Parceiro:"
          value={numeroParceiro}
          onChangeText={setNumeroParceiro}
        />

        <TouchableOpacity style={styles.button} onPress={handleCadastrar}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#003366', 
    padding: 16,
    justifyContent: 'space-between', 
  },
  backButton: {
    fontSize: 24,
    color: '#fff', 
  },
  logo: {
    width: 100,
    height: 40,
    alignSelf: 'center', 
  },
  placeholder: {
    width: 40, 
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  uploadButton: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 30,
    color: '#003366',
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageText: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    flex: 1,
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#003366',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default registerad;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Header } from '../components/Header';

const AddRegistration = () => {
  const [nomeAnuncio, setNomeAnuncio] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [contato, setContato] = useState('');
  const [comentarios, setComentarios] = useState('');

  const handleCadastrar = () => {
  
    console.log("Nome do Anúncio:", nomeAnuncio);
    console.log("Localização:", localizacao);
    console.log("Contato:", contato);
    console.log("Comentários:", comentarios);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backButton}>{"<"}</Text>
        </TouchableOpacity>
        <Image 
          source={require('./assets/LogoAdog.png')}  necessário
          style={styles.logo} 
          resizeMode="contain"
        />
        <View style={styles.placeholder} /> {}
      </View>

      <View style={styles.form}>
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadText}>+</Text>
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Adicione um nome para o anuncio:"
          value={nomeAnuncio}
          onChangeText={setNomeAnuncio}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Localização (caso seja um local físico):"
          value={localizacao}
          onChangeText={setLocalizacao}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Formas de entrar em contato (email e telefone):"
          value={contato}
          onChangeText={setContato}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Comentários adicionais:"
          value={comentarios}
          onChangeText={setComentarios}
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
  form: {
    flex: 1,
    marginTop: 20,
  },
  uploadButton: {
    alignSelf: 'center',
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 30,
    color: '#003366',
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

export default addregistration;


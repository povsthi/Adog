import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const UserCard = ({ usuario }) => {
  const imageSource = usuario.image ? { uri: `../assets/images/${pet.image}` } : null;

  const calcularIdade = (dataNascimento) => {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
  
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

    return (
        <View style = {styles.card}>
            {imageSource && <Image source={imageSource} style={styles.image} />}
            <View style = {styles.info}>
              <Text style={styles.nome}>{usuario.nome}</Text>
              <Text style={styles.idade}>{usuario.idade}</Text>
              <Text style={styles.idade}>Idade: {calcularIdade(usuario.data_nascimento)} anos</Text>
              
           </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#000080',
    borderRadius: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  raca: {
    fontStyle: 'italic',
  },
  localizacao: {
    color: '#000080',
  },
  distancia: {
    color: '#000080',
  },
});

export default UserCard;

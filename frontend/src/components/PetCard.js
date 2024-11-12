import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const PetCard = ({ pet, onPress }) => {
  //const imageSource = pet.foto ? { uri: `http://localhost:3001/uploads/${pet.foto}` } : null;
  

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.info}>
        <Image
        source={{
          require: 'https://i.imgur.com/9TtOE7c.jpeg',
        }}
        />
          <Text style={styles.nome}>{pet.Nome}</Text>
          <Text style={styles.raca}>{pet.Raca}</Text>
          <Text style={styles.comportamento}>Comportamento: {pet.Comportamento || 'Desconhecido'}</Text>
          <Text style={styles.idade}>{pet.Idade} anos</Text>
          <Text style={styles.localizacao}>{pet.Cidade}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
});

export default PetCard;



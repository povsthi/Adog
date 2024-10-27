import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const PetCard = ({ pet }) => {
  const imageSource = pet.foto ? { uri: `http://192.168.2.107:3001/uploads/${pet.foto}` } : null;

  return (
    <TouchableOpacity onPress={onPress}>
    <View style={styles.card}>
      {imageSource && <Image source={imageSource} style={styles.image} />}
      <View style={styles.info}>
        <Text style={styles.nome}>{pet.nome}</Text>
        <Text style={styles.raca}>{pet.raca}</Text>
        <Text style={styles.comportamento}>Comportamento: {pet.comportamento || 'Desconhecido'}</Text>
        <Text style={styles.idade}>{pet.idade}</Text>
        <Text style={styles.localizacao}>{pet.cidade}</Text>
        
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
  distancia: {
    color: '#000080',
  },
});

export default PetCard;

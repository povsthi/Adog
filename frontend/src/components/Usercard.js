import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const UserCard = ({ usuario }) => {
  const imageSource = usuario.image ? { uri: `../assets/images/${pet.image}` } : null;
    return (
        <View style = {styles.card}>
            {imageSource && <Image source={imageSource} style={styles.image} />}
            <View style = {styles.info}>
              <Text style={styles.nome}>{usuario.nome}</Text>
              <Text style={styles.idade}>{usuario.idade}</Text>
              <Text style={styles.localizacao}>{usuario.localizacao}</Text>
              <Text style={styles.distancia}><Ionicons name="location-sharp" size={16} /> Está a 17 km</Text>
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

export default PetCard;

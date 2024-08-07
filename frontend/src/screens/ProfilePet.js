import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Feather, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const pet = {
  nome: 'Pipoca',
  idade: '3 meses',
  peso: '7 Kg',
  porte: 'Grande',
  raca: 'Golden Retriever',
  sexo: 'Fêmea',
  localizacao: 'Cataguases-MG',
  temperamento: 'Muito dócil',
  imagens: [
    require('../../assets/Pipoca1.jpg'), 
    require('../../assets/Pipoca2.jpg'),
    require('../../assets/Pipoca3.jpg'),
  ],
};

const ProfilePet = () => {
  const renderImage = ({ item }) => (
    <Image source={item} style={styles.petImage} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Carousel
          loop
          width={width * 0.8}
          height={200}
          autoPlay={true}
          data={pet.imagens}
          renderItem={renderImage}
          style={styles.carousel}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.petName}>{`${pet.nome}, ${pet.idade}`}</Text>
        <Text style={styles.petDetail}>• Pesa {pet.peso}</Text>
        <Text style={styles.petDetail}>• Porte {pet.porte}</Text>
        <Text style={styles.petDetail}>• {pet.raca}</Text>
        <Text style={styles.petDetail}>• {pet.sexo}</Text>
        <Text style={styles.petDetail}>• Residente de {pet.localizacao}</Text>
        <Text style={styles.petDetail}>• {pet.temperamento}</Text>
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity>
          <Feather name="rotate-cw" size={32} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="star-outline" size={32} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={32} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="x" size={32} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  carouselContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  petImage: {
    width: width * 0.8,
    height: 200,
    borderRadius: 10,
  },
  infoContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#000080',
  },
  petName: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  petDetail: {
    fontSize: 16,
    marginVertical: 2,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default ProfilePet;





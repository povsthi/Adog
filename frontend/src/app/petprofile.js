import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const ProfilePet = ({ route }) => {
  const { pet } = route.params;

  const renderImage = ({ item }) => (
    <Image source={item} style={styles.petImage} />
  );

  const handleFavorite = async () => {
    try {
      const response = await axios.post('http://http:///favoritas', {
        FK_Pet_ID_Animal: pet.ID_Animal, 
        FK_Usuario_ID: 'user-id-aqui',  
      });
      if (response.status === 200) {
        Alert.alert('Favorito', `${pet.nome} foi adicionado aos favoritos!`);
      } else {
        throw new Error('Falha ao favoritar');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar aos favoritos.');
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post('http://http:///likes', {
        FK_Pet_ID_Animal: pet.ID_Animal, 
        FK_Usuario_ID: 'user-id-aqui',  
      });
      if (response.status === 200) {
        Alert.alert('Like', `Você curtiu ${pet.nome}!`);
      } else {
        throw new Error('Falha ao curtir');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível curtir o pet.');
    }
  };

  const handleBack = () => {
    navigation.goBack(); 
  };

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
        <TouchableOpacity onPress={handleLike}>
          <Ionicons name="heart-outline" size={32} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFavorite}>
          <Ionicons name="star-outline" size={32} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleBack}>
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







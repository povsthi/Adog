import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getData, getUserId } from './storage';

const { width } = Dimensions.get('window');

const ProfilePet = () => {
  const navigation = useNavigation();
  const [pet, setPet] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setIdUsuario(id);
      console.log('ID do Usuário:', id); 
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const petId = await getData();  
        if (petId) {
          const response = await fetch(`http://localhost:3001/pets/${petId}`);
          if (!response.ok) {
            throw new Error('Erro na resposta da API');
          }
          const petData = await response.json();
          setPet(petData[0]);  // Acessando o primeiro elemento, caso a resposta seja uma lista
          console.log('Dados do Pet:', petData);
        } else {
          Alert.alert('Erro', 'Não foi possível carregar os dados do pet.');
        }
      } catch (error) {
        console.error('Erro ao carregar dados do pet:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do pet.');
      }
    };
    fetchPetData();
  }, []);
  
  const handleFavorite = async () => {
    console.log('Botão de Favoritar pressionado');
    try {
      if (!idUsuario || !pet?.ID_Animal) {  // Mudando para ID_Animal
        Alert.alert('Erro', 'Dados insuficientes para favoritar o pet.');
        return;
      }
      console.log('ID do Pet:', pet.ID_Animal); 
      const response = await fetch('http://localhost:3001/favoritas', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ FK_Pet_ID_Animal: pet.ID_Animal, FK_Usuario_ID: idUsuario }),
      });
      const result = await response.json();
      console.log('Resposta do servidor para favorito:', result);
      if (response.ok) {
        Alert.alert('Favorito', `${pet.Nome} foi adicionado aos favoritos!`);
      } else {
        Alert.alert('Erro', 'Falha ao favoritar');
      }
    } catch (error) {
      console.error('Erro no handleFavorite:', error);
      Alert.alert('Erro', 'Não foi possível adicionar aos favoritos.');
    }
  };

  const handleLike = async () => {
    try {
      if (!idUsuario || !pet?.ID_Animal) {  // Mudando para ID_Animal
        Alert.alert('Erro', 'Dados insuficientes para curtir o pet.');
        return;
      }
      console.log('ID do Pet:', pet.ID_Animal); 
      const response = await fetch('http://localhost:3001/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          FK_Pet_ID_Animal: pet.ID_Animal, FK_Usuario_ID: idUsuario
         }),
      });
      if (response.ok) {
        Alert.alert('Like', `Você curtiu ${pet.Nome}!`);
      } else {
        throw new Error('Falha ao curtir');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível curtir o pet.');
      console.error(error);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (!pet) return <Text>Carregando...</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Carousel
          loop
          width={width * 0.8}
          height={200}
          autoPlay={true}
          data={pet.imagens} // Certifique-se de que 'imagens' está correto
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.petImage} />
          )}
          style={styles.carousel}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.petName}>{`${pet.Nome}, ${pet.Idade}`}</Text>
        <Text style={styles.petDetail}>• Porte {pet.Porte}</Text> 
        <Text style={styles.petDetail}>• {pet.Raca}</Text> 
        <Text style={styles.petDetail}>• {pet.Sexo ? 'Masculino' : 'Feminino'}</Text> 
        <Text style={styles.petDetail}>• Residente de {pet.Cidade}</Text> 
        <Text style={styles.petDetail}>• {pet.Comportamento}</Text> 
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















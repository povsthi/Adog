import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getData, getUserId } from './storage';
import ipConf from './ipconfig';

const { width } = Dimensions.get('window');

const ProfilePet = () => {
  const navigation = useNavigation();
  const [pet, setPet] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Obter o ID do usuário
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setIdUsuario(id);
      console.log('ID do Usuário:', id);
    };
    fetchUserId();
  }, []);

  // Carregar os dados do pet
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const petId = await getData();
        if (petId) {
          const response = await fetch(`${ipConf()}/pets/${petId}`);
          if (!response.ok) {
            throw new Error('Erro na resposta da API');
          }
          const petData = await response.json();
          setPet(petData[0]);
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

  // Verificar se o pet foi favoritado e curtido (apenas quando idUsuario e pet estão disponíveis)
  useEffect(() => {
    if (idUsuario && pet?.ID_Animal) {
      console.log('Chamando checkIfFavorited e checkIfLiked com:', {
        idUsuario,
        petId: pet.ID_Animal,
      });
      checkIfFavorited(pet.ID_Animal);
      checkIfLiked(pet.ID_Animal);
    } else {
      console.log('Aguardando idUsuario e pet:', { idUsuario, pet });
    }
  }, [idUsuario, pet]);

  const checkIfFavorited = async (petId) => {
    try {
      const response = await fetch(`${ipConf()}/favoritas/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUsuario: idUsuario,
          idPet: petId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setIsFavorited(result.isFavorited);
      } else {
        console.log('Erro ao verificar se o pet é favorito.');
      }
    } catch (error) {
      console.error('Erro ao verificar se o pet é favorito:', error);
    }
  };

  const checkIfLiked = async (petId) => {
    try {
      const response = await fetch(`${ipConf()}/likes/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUsuario: idUsuario,
          idPet: petId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setIsLiked(result.isLiked);
      } else {
        console.log('Erro ao verificar se o pet foi curtido.');
      }
    } catch (error) {
      console.error('Erro ao verificar se o pet foi curtido:', error);
    }
  };

  const handleFavorite = async () => {
    console.log('Botão de Favoritar pressionado');
    try {
      if (!idUsuario || !pet?.ID_Animal) {
        Alert.alert('Erro', 'Dados insuficientes para favoritar o pet.');
        return;
      }

      const response = await fetch(`${ipConf()}/favoritas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUsuario: idUsuario,
          idPet: pet.ID_Animal,
        }),
      });

      const result = await response.json();
      console.log('Resposta do servidor para favorito:', result);

      if (response.ok) {
        setIsFavorited(true);
        Alert.alert('Favorito', `${pet.Nome} foi adicionado aos favoritos!`);
      } else {
        if (result.message === 'Este pet já foi favoritado por este usuário.') {
          Alert.alert('Erro', 'Este pet já foi favoritado por você.');
        } else {
          Alert.alert('Erro', 'Falha ao favoritar');
        }
      }
    } catch (error) {
      console.error('Erro no handleFavorite:', error);
      Alert.alert('Erro', 'Não foi possível adicionar aos favoritos.');
    }
  };

  const handleDesfavoritar = async () => {
    try {
      const response = await fetch(`${ipConf()}/desfavoritar`, {
        method: 'DELETE',
        body: JSON.stringify({
          FK_Usuario_ID: idUsuario,
          FK_Pet_ID_Animal: pet.ID_Animal,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIsFavorited(false);
        Alert.alert('Desfavoritado', `${pet.Nome} foi removido dos favoritos!`);
      } else {
        const error = await response.json();
        Alert.alert('Erro', error.message);
      }
    } catch (err) {
      Alert.alert('Erro ao desfavoritar o pet!');
    }
  };

  const handleLike = async () => {
    try {
      if (!idUsuario || !pet?.ID_Animal) {
        Alert.alert('Erro', 'Dados insuficientes para curtir o pet.');
        return;
      }

      const endpoint = isLiked ? '/unlike' : '/likes';
      const method = isLiked ? 'DELETE' : 'POST';

      const response = await fetch(`${ipConf()}${endpoint}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUsuario: idUsuario,
          idPet: pet.ID_Animal,
        }),
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        const message = isLiked ? 'Like removido com sucesso!' : 'Like registrado com sucesso!';
        Alert.alert('Like', message);
      } else {
        const errorData = await response.json();
        console.error('Erro ao curtir/descurtir o pet:', errorData);
        throw new Error('Falha ao curtir/descurtir');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível curtir/descurtir o pet.');
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
          data={pet.imagens}
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
          <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={32} color="#212A75" />
        </TouchableOpacity>
        <TouchableOpacity onPress={isFavorited ? handleDesfavoritar : handleFavorite}>
          <Ionicons name={isFavorited ? 'star' : 'star-outline'} size={32} color="#212A75" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleBack}>
          <Feather name="x" size={32} color="#212A75" />
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
    padding: 16,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  petDetail: {
    fontSize: 16,
    marginVertical: 2,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default ProfilePet;


















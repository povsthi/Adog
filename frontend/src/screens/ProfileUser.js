import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Feather, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const user = {
  nome: 'Thiago',
  idade: '17 anos',
  localizacao: 'Cataguases-MG',
  descricao: 'Vive em casa, possui outros pets, fica em casa 8 horas por dia.',
  imagens: [
    require('../../assets/Pipoca1.jpg'), 
    require('../../assets/Pipoca2.jpg'),
    require('../../assets/Pipoca3.jpg'),
  ],
};

const ProfileUser = () => {
  const renderImage = ({ item }) => (
    <Image source={item} style={styles.userImage} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Carousel
          data={user.imagens}
          renderItem={renderImage}
          width={width * 0.8}
          height={200}
          style={styles.carousel}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.userName}>{`${user.nome}, ${user.idade}`}</Text>
        <Text style={styles.userDetail}>• Residente de {user.localizacao}</Text>
        <Text style={styles.userDetail}>• {user.descricao}</Text>
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
  carousel: {
    borderRadius: 10,
  },
  userImage: {
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
  userName: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  userDetail: {
    fontSize: 16,
    marginVertical: 2,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default ProfileUser;






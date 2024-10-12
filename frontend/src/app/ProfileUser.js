import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Feather, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ProfileUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://200.18.141.196:3001/usuarios')
      .then(response => response.json())
      .then(data => {
        setUser(data[0]); 
        setLoading(false);
      })
      .catch(err => {
        console.log('Erro ao buscar usuário:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Erro ao carregar dados do usuário.</Text>
      </View>
    );
  }

  const renderImage = ({ item }) => (
    <Image source={{ uri: item }} style={styles.userImage} />
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
    justifyContent: 'center',
    alignItems: 'center',
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







import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const AdCard = () => {
  const petshop = {
    name: 'PetShop Amigão Kta',
    address: 'Av. dos Animais, 123',
    phone: '(32) 98765-4321',
    image: require('../../assets/petshop.jpg'),
  };

  const handleAdPress = () => {
    console.log('Anúncio clicado!');
  };

  return (
    <TouchableOpacity onPress={handleAdPress}>
      <View style={styles.adCard}>
      <Image source={petshop.image} style={styles.adImage} />
        <View style={styles.adInfo}>
          <Text style={styles.petshopName}>{petshop.name}</Text>
          <Text style={styles.petshopAddress}>{petshop.address}</Text>
          <Text style={styles.petshopPhone}>{petshop.phone}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  adCard: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  adImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  adInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  petshopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  petshopAddress: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,
  },
  petshopPhone: {
    fontSize: 14,
    color: '#007bff',
  },
});

export default AdCard;

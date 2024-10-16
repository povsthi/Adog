import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 

const veterinarians = [
  {
    id: '1',
    name: 'Clínica Pet Vida',
    specialty: 'Clínica Veterinária',
    location: 'Cataguases-MG',
    distance: '23 km',
    image: '', 
  },
  {
    id: '2',
    name: 'Dra. Ana Souza',
    specialty: 'Veterinária',
    location: 'Leopoldina-MG',
    distance: '5 km',
    image: '',
  },
  {
    id: '3',
    name: 'Clínica Saúde Animal',
    specialty: 'Clínica Veterinária',
    location: 'Vista Alegre-MG',
    distance: '16.3 km',
    image: '', 
  },
  {
    id: '4',
    name: 'Dr. Marcos Silva',
    specialty: 'Veterinário',
    location: 'Leopoldina-MG',
    distance: '16.3 km',
    image: '', 
  },
];

const VeterinariansScreen = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(veterinarians);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.specialty}>{item.specialty}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.distance}>Está a {item.distance}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.notificationIcon}>
          <Icon name="bell" size={24} color="#fff" />
        </TouchableOpacity>
        
        {}
        <Image 
          source={require('../../assets/LogoAdog.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        
        <View style={styles.emptyIcon} /> {}
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerIcon}>
          <Icon name="paw" size={30} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIcon}>
          <Icon name="plus-circle" size={30} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIcon}>
          <Icon name="star" size={30} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIcon}>
          <Icon name="user" size={30} color="#003366" />
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
  header: {
    backgroundColor: '#003366',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 100, 
    height: 40, 
    position: 'absolute', 
    left: '50%',
    transform: [{ translateX: -50 }], 
  },
  notificationIcon: {
    marginRight: 16, 
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  specialty: {
    fontSize: 14,
    color: '#666',
  },
  location: {
    fontSize: 14,
    color: '#999',
  },
  distance: {
    fontSize: 14,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#f1f1f1',
  },
  footerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default VeterinariansScreen;

import React, { useState, useEffect, useCallback} from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import { getUserId, storeData } from '../storage';
import PetCard from '../../components/PetCard';
import ipConf from '../ipconfig';
import { useRouter, useFocusEffect } from 'expo-router';


const MyPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);
  const router = useRouter();


  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      console.log("ID do usuário: " + id);
      setIdUsuario(id);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (idUsuario) {
      fetchPets();
    }
  }, [idUsuario]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${ipConf()}/pets/usuario/${idUsuario}`);
      if (response.ok) {
        const data = await response.json();
        setPets(data);
      } else {
        Alert.alert('Erro', 'Não foi possível buscar os pets cadastrados.');
      }
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao buscar os pets.');
    } finally {
      setLoading(false);
    }
  };


  const handlePetClick = async (pet) => {
    if (pet?.ID_Animal) {  
      await storeData(pet.ID_Animal);  
      router.push('/petprofile');
    } else {
      console.error('Pet ID não encontrado: ', pet);  
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {pets.map((pet, index) => (
          <PetCard key={index} pet={pet} onPress={() => handlePetClick(pet)} />
        ))}
      </ScrollView>
    </View>
  );
}  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  noPetsText: {
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
  
});

export default MyPets;


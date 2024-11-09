import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { getUserId } from '../storage'; 

const MyPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
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
      const response = await fetch(`http://localhost:3001/pets?usuarioId=${idUsuario}`);
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

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : pets.length > 0 ? (
        pets.map((pet) => (
          <View key={pet.id} style={styles.petContainer}>
            {pet.foto ? (
              <Image source={{ uri: pet.foto }} style={styles.petImage} />
            ) : (
              <View style={styles.noImage}>
                <Text style={styles.noImageText}>Sem Foto</Text>
              </View>
            )}
            <View style={styles.petDetails}>
              <Text style={styles.petName}>{pet.nome}</Text>
              <Text>{pet.tipo} - {pet.raca}</Text>
              <Text>{pet.sexo}</Text>
              <Text>Idade: {pet.idade}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noPetsText}>Você não cadastrou nenhum pet ainda.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  petContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    width: '100%',
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  noImage: {
    width: 80,
    height: 80,
    backgroundColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#fff',
  },
  petDetails: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noPetsText: {
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});

export default MyPets;

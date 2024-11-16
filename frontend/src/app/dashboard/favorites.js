import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import PetCard from '../../components/PetCard';  
import { getUserId } from '../storage';
import ipConf from '../ipconfig';

const FavoritosScreen = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    const fetchFavoritos = async () => {
      if (idUsuario) {
        try {
          const response = await fetch(`${ipConf()}/favoritas/${idUsuario}`);
          if (!response.ok) {
            throw new Error('Erro ao buscar favoritos');
          }
          const data = await response.json();
          
          console.log('Favoritos:', data);
          
          const petsCompletos = await Promise.all(data.map(async (favorito) => {
            const petResponse = await fetch(`${ipConf()}/pets/${favorito.FK_Pet_ID_Animal}`);
            if (!petResponse.ok) {
              throw new Error(`Erro ao buscar pet com ID: ${favorito.FK_Pet_ID_Animal}`);
            }
            const petData = await petResponse.json();
            console.log('Pet Data:', petData);
            return petData[0];  
          }));
          
          setFavoritos(petsCompletos);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };
  
    if (idUsuario) {
      fetchFavoritos();
    }
  }, [idUsuario]);
  

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      {favoritos.length === 0 ? (
        <Text style={styles.noFavorites}>Você ainda não tem favoritos.</Text>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.ID_Animal ? item.ID_Animal.toString() : 'no-id'}  
          renderItem={({ item }) => <PetCard pet={item} />}  
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  noFavorites: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default FavoritosScreen;





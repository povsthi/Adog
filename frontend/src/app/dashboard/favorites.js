import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import PetCard from '../../components/PetCard';

const FavoritosScreen = ({ userId }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const response = await fetch(`http://seu-endpoint/favoritas/${userId}`);
        
        // Verificar se a resposta é bem-sucedida
        if (!response.ok) {
          throw new Error('Erro ao buscar favoritos');
        }

        const data = await response.json();
        setFavoritos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritos();
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.ID_Animal.toString()}
        renderItem={({ item }) => <PetCard pet={item} />}
      />
    </View>
  );
};

export default FavoritosScreen;


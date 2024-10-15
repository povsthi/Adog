import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import NotCard from '../components/NotCard';

const Notification = () => {
  const [notificacoes, setNotificacoes] = useState([
    { id: '1', nome: 'Logan', desc: 'Logan foi adicionado aos favoritos', lido: false },
    { id: '2', nome: 'Pantera', desc: 'Pantera foi adicionado aos favoritos', lido: false },
  ]);

  useEffect(() => {
    const buscarNotificacoes = async () => {
      const resultadoDaBusca = [
        { id: '3', nome: 'Bella', desc: 'Bella foi adotada', lido: false },
        { id: '4', nome: 'Max', desc: 'Max foi adicionado aos favoritos', lido: false },
      ];
      setNotificacoes(resultadoDaBusca);
    };

    buscarNotificacoes();
  }, []);

  const marcarComoLido = (id) => {
    setNotificacoes(notificacoes.map((n) => (n.id === id ? { ...n, lido: true } : n)));
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={notificacoes}
        renderItem={({ item }) => (
          <NotCard notificacao={item} marcarComoLido={marcarComoLido} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default Notification;

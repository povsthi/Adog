import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native';
import NotCard from '../components/NotCard';
import ipConf from './ipconfig';

const Notification = () => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true); // Estado para indicador de carregamento
  const [erro, setErro] = useState(null); // Estado para mensagens de erro

  useEffect(() => {
    const buscarNotificacoes = async () => {
      try {
        const response = await fetch(`${ipConf()}/notificacoes`, {
          method: 'GET',
        });
        const data = await response.json();
        setNotificacoes(data);
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
        setErro('Não foi possível carregar as notificações.');
      } finally {
        setCarregando(false);
      }
    };

    buscarNotificacoes();
  }, []);

  const marcarComoLido = async (id) => {
    try {
      await fetch(`${ipConf()}/notificacoes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lido: true }),
      });

      setNotificacoes((prevNotificacoes) =>
        prevNotificacoes.map((notificacao) =>
          notificacao.id === id ? { ...notificacao, lido: true } : notificacao
        )
      );
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  if (carregando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{erro}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default Notification;


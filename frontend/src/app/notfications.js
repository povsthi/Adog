import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native';
import NotCard from '../components/NotCard';
import ipConf from './ipconfig';
import { getUserId } from './storage';

const Notification = ({ route }) => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [idUsuario, setIdUsuario] = useState('');

  const readId = async () => {
    const idUsuario = await getUserId(); 
    setIdUsuario(idUsuario);
    console.log("id:" + idUsuario);
};

  useEffect(() => {
    readId(); 
  }, []);

  useEffect(() => {
    const buscarNotificacoes = async () => {
      try {
        const response = await fetch(`${ipConf()}/notificacoes/${idUsuario}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar notificações');
        }

        const data = await response.json();
        setNotificacoes(data.notificacoes || []); 
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
        setErro('Não foi possível carregar as notificações.');
      } finally {
        setCarregando(false);
      }
    };

    buscarNotificacoes();
  }, [idUsuario]);

  const marcarComoLido = async (idAdota) => {
    try {
      const response = await fetch(`${ipConf()}/notificacaolida/${idAdota}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Erro ao marcar notificação como lida');
      }


      setNotificacoes((prevNotificacoes) =>
        prevNotificacoes.map((notificacao) =>
          notificacao.IDAdota === idAdota
            ? { ...notificacao, Lida: true }
            : notificacao
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
        keyExtractor={(item) => item.IDAdota.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma notificação encontrada.</Text>
        }
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
});

export default Notification;



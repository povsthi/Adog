import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import ipConf from '../app/ipconfig';

const NotCard = ({ notificacao, marcarComoLido, retribuirInteresse }) => {
  const { UsuarioQueCurtiu, NomePet, Lida, IDAdota, Match } = notificacao;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRedirect = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${ipConf()}/likes/${IDAdota}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar o perfil do usuário interessado.');
      }
      const data = await response.json();
      const usuarioId = data[0]?.FK_Usuario_ID;
      if (!usuarioId) {
        throw new Error('ID do usuário interessado não encontrado.');
      }
      router.push(`/userprofile/${usuarioId}`); 
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.card, Lida ? styles.lido : styles.naoLido]}>
      <Text style={styles.message}>
        <Text>
          <TouchableOpacity onPress={handleRedirect}>
            {loading ? (
              <ActivityIndicator size="small" color="#212A75" />
            ) : (
              <Text style={styles.userLink}>{UsuarioQueCurtiu}</Text>
            )}
          </TouchableOpacity>
        </Text>
        {' '}se interessou pelo seu pet <Text style={styles.petName}>{NomePet}</Text>.
      </Text>
  
      <View style={styles.buttons}>
        {!Lida && (
          <TouchableOpacity style={styles.botao} onPress={() => marcarComoLido(IDAdota)}>
            <Text style={styles.botaoTexto}>Marcar como lida</Text>
          </TouchableOpacity>
        )}
  
        {!Match && (
          <TouchableOpacity
            style={[styles.botao, styles.botaoMatch]}
            onPress={() => retribuirInteresse(IDAdota)}
          >
            <Text style={styles.botaoTexto}>Retribuir Interesse</Text>
          </TouchableOpacity>
        )}
      </View>
  
      {Match && <Text style={styles.matchMessage}>✨ Match realizado! ✨</Text>}
    </View>
  );
  
};

const styles = StyleSheet.create({
  userLink: {
    color: '#212A75',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lido: {
    borderLeftWidth: 5,
    borderLeftColor: '#212A75',
  },
  naoLido: {
    borderLeftWidth: 5,
    borderLeftColor: '#ffc107',
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botao: {
    backgroundColor: '#212A75',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  botaoMatch: {
    backgroundColor: '#212A75',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  matchMessage: {
    marginTop: 10,
    fontSize: 16,
    color: '#28a745',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NotCard;




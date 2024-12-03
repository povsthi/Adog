import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const NotCard = ({ notificacao, marcarComoLido, retribuirInteresse }) => {
  const { UsuarioQueCurtiu, NomePet, Lida, IDAdota, Match } = notificacao;

  return (
    <View style={[styles.card, Lida ? styles.lido : styles.naoLido]}>
      <Text style={styles.message}>
        {`${UsuarioQueCurtiu} se interessou pelo seu pet ${NomePet}.`}
      </Text>

      <View style={styles.buttons}>
        {!Lida && (
          <TouchableOpacity
            style={styles.botao}
            onPress={() => marcarComoLido(IDAdota)}
          >
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



import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotCard = ({ notificacao }) => {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.nots}>{notificacao.desc}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#000080',
    borderRadius: 10,
  },
  info: {
    flex: 1,
  },
  nots: {
    color: '#000080',
  },
});

export default NotCard;

import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ipConf from '../ipconfig';

const calcularIdade = (dataNascimento) => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);

  let idade = hoje.getFullYear() - nascimento.getFullYear();

  const mesAtual = hoje.getMonth();
  const diaAtual = hoje.getDate();
  if (
    mesAtual < nascimento.getMonth() ||
    (mesAtual === nascimento.getMonth() && diaAtual < nascimento.getDate())
  ) {
    idade--;
  }

  return idade;
};

const obterCidade = async (latitude, longitude) => {
  try {
    const apiKey = 'f134e0f1c9e24191af064f331aff0f42'; 
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erro ao buscar a cidade do usuário.');
    }

    const data = await response.json();
    const cidade = data?.results[0]?.components?.city || 'Cidade não encontrada';
    return cidade;
  } catch (error) {
    console.error('Erro ao obter cidade:', error);
    return 'Erro ao obter cidade';
  }
};

const UserProfile = () => {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cidade, setCidade] = useState('Carregando...');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${ipConf()}/usuarios/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar os dados do usuário.');
        }
        const data = await response.json();
        const usuario = data[0];

        if (usuario?.Latitude && usuario?.Longitude) {
          const cidadeObtida = await obterCidade(usuario.Latitude, usuario.Longitude);
          setCidade(cidadeObtida);
        } else {
          setCidade('Localização não disponível');
        }

        usuario.Idade = calcularIdade(usuario.Data_nascimento);
        setUser(usuario);
      } catch (error) {
        Alert.alert('Erro', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#212A75" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Usuário não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Image
          source={
            user.Foto
              ? { uri: user.Foto }
              : require('../../../assets/useravatar.jpg')
          }
          style={styles.userImage}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.userName}>{`${user.Nome}, ${user.Idade}`}</Text>
        <Text style={styles.userDetail}>• Vive em: {user.Morada}</Text>
        <Text style={styles.userDetail}>• E-mail de contato: {user.Email}</Text>
        <Text style={styles.userDetail}>• Residente de {user.Cidade}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30,
  },
  userImage: {
    width: '90%',
    height: undefined,
    aspectRatio: 4 / 4,
    borderRadius: 10,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  infoContainer: {
    padding: 16,
    marginTop: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userDetail: {
    fontSize: 16,
    marginVertical: 2,
  },
});

export default UserProfile;








import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useSearchParams, useRouter } from 'expo-router';
import ipConf from '../ipconfig';

const UserProfile = () => {
  const { id } = useSearchParams(); 
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${ipConf()}/usuarios/${id}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar os dados do usuário.');
        }
        const data = await response.json();
        setUser(data[0]); 
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
      <Image
        source={
          user.Foto
            ? { uri: user.Foto }
            : require('../../../assets/useravatar.jpg') 
        }
        style={styles.userImage}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.userName}>{user.Nome}</Text>
        <Text style={styles.userDetail}>Email: {user.Email}</Text>
        <Text style={styles.userDetail}>Morada: {user.Morada || 'Não informado'}</Text>
        <Text style={styles.userDetail}>
          Data de nascimento: {user.Data_nascimento || 'Não informada'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userImage: {
    width: '100%',
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  infoContainer: {
    marginTop: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userDetail: {
    fontSize: 16,
    marginVertical: 5,
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
});

export default UserProfile;








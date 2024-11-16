import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import { getUserId } from '../storage';
import PetCard from '../../components/PetCard';
import RoundedButton from '../../components/RoundedButton'
import ipConf from '../ipconfig';

const MyPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      console.log("ID do usuário: " + id);
      setIdUsuario(id);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (idUsuario) {
      fetchPets();
    }
  }, [idUsuario]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${ipConf()}/pets/usuario/${idUsuario}`);
      if (response.ok) {
        const data = await response.json();
        setPets(data);
      } else {
        Alert.alert('Erro', 'Não foi possível buscar os pets cadastrados.');
      }
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao buscar os pets.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (pet) => {
    setSelectedPet(pet);
    setModalVisible(true);
  };

  const closeEditModal = () => {
    setSelectedPet(null);
    setModalVisible(false);
  };

  const Atualizar = async () => {
    try {
      const response = await fetch(`${ipConf()}/pets/${selectedPet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedPet),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Dados do pet atualizados com sucesso.');
        fetchPets();
        closeEditModal();
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar os dados do pet.');
      }
    } catch (error) {
      console.error('Erro ao salvar pet:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o pet.');
    }
  };

  const Deletar = async () => {
    try {
      const response = await fetch(`${ipConf()}/pets/${selectedPet.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Pet deletado com sucesso.');
        fetchPets();
        closeEditModal();
      } else {
        Alert.alert('Erro', 'Não foi possível deletar o pet.');
      }
    } catch (error) {
      console.error('Erro ao deletar pet:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao deletar o pet.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : pets.length > 0 ? (
        pets.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
            onPress={() => openEditModal(pet)}
          />
        ))
      ) : (
        <Text style={styles.noPetsText}>Você não cadastrou nenhum pet ainda.</Text>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Pet</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={selectedPet?.Nome || ''}
              onChangeText={(text) => setSelectedPet({ ...selectedPet, Nome: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Raça"
              value={selectedPet?.Raca || ''}
              onChangeText={(text) => setSelectedPet({ ...selectedPet, Raca: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Idade"
              value={selectedPet?.Idade ? String(selectedPet.Idade) : ''}
              onChangeText={(text) => setSelectedPet({ ...selectedPet, Idade: parseInt(text) })}
              keyboardType="numeric"
            />

            <View style={styles.buttonContainer}>
              <RoundedButton title="Salvar" onPress={Atualizar} />
              <RoundedButton title="Cancelar" onPress={() => setModalVisible(false)}  />
              <TouchableOpacity style={styles.button} onPress={Deletar}>
              <Text style={styles.buttonText}>Deletar Pet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  noPetsText: {
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    margin: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#B22222',
    borderRadius: 20,
    alignItems: 'center',
},
buttonText: {
    color: '#B22222',
    fontWeight: 'bold',
    textAlign: 'center',
},
});

export default MyPets;


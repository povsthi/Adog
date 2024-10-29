import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, TextInput, Button } from 'react-native';
import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import { getUserId } from '../storage'; 

const SettingsScreen = ({ navigation }) => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [idUsuario, setIdUsuario] = useState();
    const [modalVisible, setModalVisible] = useState(false); 

    const readId = async () => {
        const idUsuario = await getUserId(); 
        setIdUsuario(idUsuario);
        console.log("id:" + idUsuario);
    };

    useEffect(() => {
        readId(); 
    }, []);

    useEffect(() => {
        const fetchItem = async () => {
            if (idUsuario) { 
                try {
                    let response = await fetch(`http://localhost:3001/usuarios/${idUsuario}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    let resJson = await response.json();
                    console.log("Resposta da API:", resJson);    
                    if (resJson.length > 0) {
                        setNome(resJson[0].Nome);
                        setEmail(resJson[0].Email);
                    }
                } catch (e) {
                    console.log("Erro ao buscar usuário:", e);
                }
            }
        };
        fetchItem();
    }, [idUsuario]);

    const Atualizar = async () => {
        var userObj = { nome: nome, email: email, senha: senha };
        var jsonBody = JSON.stringify(userObj);
        try {
            let response = await fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: jsonBody,
            });
            let json = await response.json();
            navigation.goBack();
        } catch (err) {
            console.log("Erro ao atualizar usuário:", err);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image
                    source={require('../../../assets/ThiagoImage.jpg')}
                    style={styles.profileImage}
                />
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.profileName}>{nome}</Text>
                </TouchableOpacity>
                <Text style={styles.profileEmail}>{email}</Text> 
            </View>

            <View style={styles.section}>
                <TouchableOpacity style={styles.option}>
                    <Ionicons name="information-circle-outline" size={20} color="#373737" />
                    <Text style={styles.optionText}>Ajuda</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option}>
                    <FontAwesome name="user-o" size={20} color="#373737" />
                    <Text style={styles.optionText}>Conta</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option}>
                    <FontAwesome name="handshake-o" size={20} color="#373737" />
                    <Text style={styles.optionText}>Torne-se Patrocinador</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option}>
                    <Entypo name="cog" size={20} color="#373737" />
                    <Text style={styles.optionText}>Preferências</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.adContainer}>
                <Text style={styles.adText}>Anúncio</Text>
            </View>

            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Informações</Text>
                        <TextInput
                            value={nome}
                            onChangeText={setNome}
                            placeholder="Nome"
                            style={styles.input}
                        />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            style={styles.input}
                        />
                        <Button title="Salvar" onPress={Atualizar} />
                        <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    profileContainer: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#E1E1E1',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    profileName: {
        marginTop: 10,
        fontSize: 16,
        color: '#7D4CDB',
    },
    profileEmail: {
        marginTop: 5,
        fontSize: 14,
        color: '#7D4CDB', 
    },
    section: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E1E1E1',
    },
    optionText: {
        marginLeft: 15,
        fontSize: 16,
        color: '#373737',
    },
    adContainer: {
        margin: 20,
        height: 100,
        backgroundColor: '#E1E1E1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    adText: {
        fontSize: 18,
        color: '#9E9E9E',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
    },
});

export default SettingsScreen;




import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import { getUserId } from '../storage'; 
import RoundedButton from '../../components/RoundedButton';
import ipConf from '../ipconfig';
import { clearUserId } from '../storage';
import { useRouter } from 'expo-router';
import CustomTextInput from '../../components/CustomTextInput';
import uploadImage from '../uploadImage';
import * as ImagePicker from 'expo-image-picker';


const SettingsScreen = ({ navigation }) => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [idUsuario, setIdUsuario] = useState();
    const [modalVisible, setModalVisible] = useState(false); 
    const [fotoUrl, setFotoUrl] = useState('');
    const [foto, setFoto] = useState('');

    const router = useRouter();

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
                    let response = await fetch(`${ipConf()}/usuarios/${idUsuario}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    let resJson = await response.json();
                    console.log("Resposta da API:", resJson);    
                    if (resJson.length > 0) {
                        setNome(resJson[0].Nome);
                        setEmail(resJson[0].Email);
                        setSenha(resJson[0].Senha);
                        setFotoUrl(resJson[0].Foto);
                    }
                } catch (e) {
                    console.log("Erro ao buscar usuário:", e);
                }
            }
        };
        fetchItem();
    }, [idUsuario]);

    const selecionarFoto = async () => {
        try {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Acesso à galeria negado.');
            return;
          }
    
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
    
          if (!result.canceled) {
            const imageUri = result.assets[0].uri; 
            setFoto(imageUri); 
    
            const uploadedUrl = await uploadImage(imageUri);
            setFotoUrl(uploadedUrl); 
            Alert.alert('Sucesso!', 'Imagem enviada com sucesso.');
          } else {
            Alert.alert('Cancelado', 'Nenhuma imagem foi selecionada.');
          }
        } catch (error) {
          console.error('Erro ao selecionar imagem:', error);
          Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
        }
      };

    const Atualizar = async () => {
        var userObj = { nome: nome, email: email, senha: senha, foto:foto };
        var jsonBody = JSON.stringify(userObj);
        try {
            let response = await fetch(`${ipConf()}/usuarios/${idUsuario}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: jsonBody,
            });
            let json = await response.json();
            navigation.goBack();
            setModalVisible(false);
        } catch (err) {
            console.log("Erro ao atualizar usuário:", err);
        }
    };

    const SignOut = async () => {
        try {
          await clearUserId(); 
          Alert.alert('Logout', 'Você saiu da conta com sucesso.');
          router.replace('/signin'); 
        } catch (error) {
          console.error('Erro ao sair:', error);
          Alert.alert('Erro', 'Não foi possível sair da conta.');
        }
      };

    const Deletar = async () => {
        try {
            let response = await fetch(`${ipConf()}/usuarios/${idUsuario}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });
    
            if (response.ok) {
                console.log(`Usuário com ID ${idUsuario} deletado com sucesso.`);
                navigation.goBack(); 
            } else {
                console.log(`Erro ao deletar o usuário: ${response.statusText}`);
            }
        } catch (err) {
            console.log("Erro ao deletar usuário:", err);
        }
    };
    

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileContainer}>        
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image
                        source={{uri: fotoUrl || '../../../assets/useravatar.jpg'}}
                        style={styles.profileImage}
                    />
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

            <TouchableOpacity style={styles.button} onPress={SignOut}>
                <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>

            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Informações</Text>
                        <TouchableOpacity onPress={selecionarFoto} style={styles.photoContainer}>
                            {fotoUrl ? (
                            <Image source={{ uri: fotoUrl }} style={styles.photo} />
                            ) : (
                            <Text style={styles.photoPlaceholder}>Alterar Foto</Text>
                            )}
                        </TouchableOpacity>
                        <CustomTextInput
                            value={nome}
                            onChangeText={setNome}
                            placeholder="Nome"
                            style={styles.input}
                        />
                        <CustomTextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            style={styles.input}
                        />
                        <CustomTextInput
                            value={senha}
                            onChangeText={setSenha}
                            placeholder="Senha"
                            style={styles.input}
                        />
                         <RoundedButton title="Salvar" onPress={Atualizar} />
                         <RoundedButton title="Cancelar" onPress={() => setModalVisible(false)}  />
                        <TouchableOpacity style={styles.button} onPress={Deletar}>
                        <Text style={styles.buttonText}>Deletar conta</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
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
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#E1E1E1',
    },
    profileImage: {
        width: 80, 
        height: 80,
        borderRadius: 40,
        marginBottom: 10, 
      },
      
    profileName: {
        marginTop: 10, 
        fontSize: 16,
        color: '#7D4CDB',
        textAlign: 'center', 
      },
      profileEmail: {
        marginTop: 5, 
        fontSize: 14,
        color: '#7D4CDB',
        textAlign: 'center', 
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
    photoContainer: {
        alignItems: 'center',
        marginBottom: 20,
      },
      photo: {
        width: 100, 
        height: 100,
        borderRadius: 50, 
        borderWidth: 2,
        borderColor: '#ccc',
      },
      photoPlaceholder: {
        fontSize: 16,
        color: '#aaa',
        textAlign: 'center',
      },
      
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
    },
    button: {
        borderWidth: 1,
        borderColor: '#B22222',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#B22222',
        fontSize: 16,
        fontWeight: 'bold',
    },
      logoutText: {
        color: '#fff',
        fontWeight: 'bold',
      },
});

export default SettingsScreen;




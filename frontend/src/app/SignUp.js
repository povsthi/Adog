import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import * as Location from 'expo-location';
import CustomTextInput from '../components/CustomTextInput';
import RoundedButton from '../components/RoundedButton';
import Label from '../components/Label';
import { useRouter } from 'expo-router';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons'; 


const SignUp = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [data, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [moradia, setMoradia] = useState(''); 
  const [showPassword, setShowPassword] = useState(false); 
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const router = useRouter();

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão de localização negada. Por favor, habilite as permissões de localização.');
        return;
      }
      const locationServicesEnabled = await Location.hasServicesEnabledAsync();
      if (!locationServicesEnabled) {
        Alert.alert('Erro', 'Os serviços de localização estão desativados. Habilite-os nas configurações do dispositivo.');
        return;
      }
      getCurrentLocation();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema ao solicitar permissões de localização.');
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível obter sua localização. Verifique suas configurações de localização.');
    }
  };

  const Cadastrar = () => {
    if (!nome || !email || !senha || !confirmarSenha || !cpf || !moradia) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios!');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro!', 'Senhas diferentes');
      return;
    }

    const userObj = { nome, email, senha, cpf, moradia, latitude: location.latitude, longitude: location.longitude };
    const jsonBody = JSON.stringify(userObj);
    console.log(jsonBody);

    fetch('http://192.168.2.107:3001/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: jsonBody,
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("Resposta do servidor:", json);
        if (json.affectedRows && json.affectedRows > 0) {
          router.replace('/dashboard');
        } else {
          Alert.alert('Erro', 'Falha no cadastro. Tente novamente.');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDateConfirm = (date) => {
    setDataNascimento(date.toISOString().split('T')[0]);
    setDatePickerVisibility(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <Label text="Nome" />
        <CustomTextInput placeholder="Digite seu nome" value={nome} onChangeText={setNome} />
        
        <Label text="E-mail" />
        <CustomTextInput placeholder="Digite seu e-mail" value={email} onChangeText={setEmail} />

        <Label text="Data de Nascimento" />
        <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
          <TextInput
            style={styles.input}
            placeholder="Data de Nascimento"
            value={data}
            editable={false}
          />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={(date) => {
            setDataNascimento(date.toISOString().split('T')[0]);
            setDatePickerVisibility(false);
          }}
          onCancel={() => setDatePickerVisibility(false)}
        />

        <Label text="Tipo de Moradia" />
        <TouchableOpacity onPress={() => setMoradia('Casa')}>
          <Text style={[styles.option, moradia === 'Casa' && styles.selectedOption]}>Casa</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMoradia('Apartamento')}>
          <Text style={[styles.option, moradia === 'Apartamento' && styles.selectedOption]}>Apartamento</Text>
        </TouchableOpacity>

        <Label text="CPF" />
        <CustomTextInput placeholder="Digite seu CPF" value={cpf} onChangeText={setCpf} />

        <Label text="Senha" />
        <CustomTextInput
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!showPassword}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="grey" />
            </TouchableOpacity>
          }
        />

        <Label text="Confirmar Senha" />
        <CustomTextInput
          placeholder="Confirme sua senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry={!showPassword}
        />


        <RoundedButton title="Cadastrar" onPress={Cadastrar} />
        <TouchableOpacity onPress={() => router.push('/signin')}>
          <Text style={styles.signInText}>Já tenho conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginVertical: 10,
  },
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    textAlign: 'center',
  },
  selectedOption: {
    borderColor: '#000080',
    backgroundColor: '#d3d3d3',
  },
  signInText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#308FF',
    textDecorationLine: 'underline',
  },
});

export default SignUp;



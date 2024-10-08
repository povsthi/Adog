import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Register = () => {
  return (
    <View style={styles.container}>
 
      <Text style={styles.title}>Como deseja se cadastrar?</Text>

      <TouchableOpacity style={styles.button}>
        <View style={styles.buttonContent}>
          <Image source={require('./assets/iconedepata-removebg-preview.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Pretendente a Adoção</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <View style={styles.buttonContent}>
          <Image source={require('./assets/icone_de_dinheiro-removebg-preview.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Parceiro</Text>
        </View>
      </TouchableOpacity>  
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    backgroundColor: '#00008B', 
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00008B', 
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  }
});

export default Register;
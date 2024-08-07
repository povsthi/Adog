import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImageUploader = ({ onImageUpload }) => {
  const [image, setImage] = useState(null);
  const apiKey = '6d207e02198a847aa98d0a2a901485a5';
  const apiUrl = 'https://freeimage.host/api/1/upload';

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Desculpe, precisamos da permissão da câmera para tirar uma foto.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      upload(result.assets[0]);
      // if (onImageUpload) {
      //   onImageUpload(result.assets[0]);
      // }
    }
  };

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      upload(result.assets[0]);
      // if (onImageUpload) {
      //   onImageUpload(result.assets[0]);
      // }
    }
  };

  const upload = async (image) => {
    const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1, image.uri.length);
    const extension = filename.split('.').pop();
    const formData = new FormData();
    formData.append('source', {
      uri: image.uri,
      name: filename,
      type: `image/${extension}`,
    });
    formData.append('key', apiKey);
    formData.append('format', 'json');
    try {
      let res = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      let responseJson = await res.json();
      setImage(responseJson.image.url);
      if (onImageUpload) {
        onImageUpload(responseJson.image.url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Erro', 'Erro ao fazer upload da imagem: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
          <Text style={styles.buttonText}>Tirar Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
          <Text style={styles.buttonText}>Escolher da Galeria</Text>
        </TouchableOpacity>
      </View>
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400, 
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: 'black',
    padding: 15,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

export default ImageUploader;

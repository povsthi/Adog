import { useState } from 'react';
import { Button, Image, View, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function uploadImage() {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setFile(result.assets[0].base64);
    }
  };

  const onFileUpload = async () => {
    if (!file) {
      alert("Nenhuma imagem selecionada!");
      return;
    }

    setLoading(true);

    const auth = "Client-ID 1528cabed767a7e";
    

    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", "base64"); 

    try {
      const response = await fetch("https://api.imgur.com/3/image/", {
        method: "POST",
        headers: {
          Authorization: auth,
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await response.json();
      setLoading(false); 

      if (response.ok) {
        alert("Upload bem-sucedido!");
        console.log("Imgur Response:", data.link);
      } else {
        alert(`Erro no upload: ${data.data.error}`);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("Erro ao fazer upload. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Escolha uma imagem" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {image && !loading && <Button onPress={onFileUpload} title="Fazer Upload" />}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
});

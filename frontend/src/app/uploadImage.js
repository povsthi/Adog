export default async function uploadImage(imageUri) {
  const auth = "Client-ID 1528cabed767a7e";
  const formData = new FormData();
  formData.append("image", {
    uri: imageUri,
    type: "image/jpeg",
    name: "photo.jpg",
  });

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

    if (response.ok) {
      return data.data.link; 
    } else {
      throw new Error(`Erro no upload: ${data.data.error}`);
    }
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    throw error;
  }
}





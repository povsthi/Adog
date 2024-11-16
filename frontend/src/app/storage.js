import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (petId) => {
    try {
      await AsyncStorage.setItem('selected-pet-id', petId.toString());  
    } catch (e) {
      console.log(e);
    }
  };
  
  export const getData = async () => {
    try {
      const petId = await AsyncStorage.getItem('selected-pet-id');
      return petId ? parseInt(petId, 10) : null;  
    } catch (e) {
      console.log(e);
    }
  };
  

  export const storeUserId = async (userId) => {
    try {
      await AsyncStorage.setItem('user-id', userId.toString()); 
    } catch (e) {
      console.log(e);
    }
  };
  

export const getUserId = async () => {
  try {
      const userId = await AsyncStorage.getItem('user-id');
      return userId !== null ? userId : null;
  } catch (e) {
      console.log(e);
      return null;
  }
};


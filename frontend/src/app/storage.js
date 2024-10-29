import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (pet) => {
    try {
        const petData = JSON.stringify(pet);  
        await AsyncStorage.setItem('selected-pet', petData);  
    } catch (e) {
        console.log(e);
    }
};

export const getData = async () => {
    try {
        const petData = await AsyncStorage.getItem('selected-pet');
        return petData != null ? JSON.parse(petData) : null;  
    } catch (e) {
        console.log(e);
    }
};

export const storeUserId = async (userId) => {
  try {
      await AsyncStorage.setItem('user-id', userId);
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


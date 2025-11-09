import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        // saving error
    }
};

export const getData = async (key: string) => {
  try {
      return await AsyncStorage.getItem(key);
  } catch (e) {
      console.error('Error reading data from', key, e);
      return null;
  }
};

export const storeObject = async (key: string, value: any) => {
  try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
      console.error('Error saving object to', key, e);
  }
};

export const getObject = async (key: string): Promise<any | null> => {
  try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
  } catch (e) {
      console.error('Error reading object from', key, e);
      return null;
  }
};

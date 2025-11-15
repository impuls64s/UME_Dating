import { fetchUserProfile } from '@/api/axiosClient';
import { STORAGE_KEYS } from '@/constants';
import * as Device from 'expo-device';
import { Alert } from 'react-native';
import { getData, storeData } from './storage';


export const getDeviceInfo = async () => {
  const deviceTypeMap: Record<number, string> = {
    1: 'Phone',
    2: 'Tablet', 
    3: 'Desktop',
    4: 'TV'
  };

  const deviceType = await Device.getDeviceTypeAsync();

  return {
    deviceName: Device.deviceName,
    modelName: Device.modelName,
    brand: Device.brand,
    osName: Device.osName,
    osVersion: Device.osVersion,
    deviceType: deviceTypeMap[deviceType] || 'Unknown',
    deviceTypeCode: deviceType,
    isDevice: Device.isDevice,
  };
};


export const getUserProfile = async () => {
  const accessToken = await getData(STORAGE_KEYS.ACCESS_TOKEN);

  if (!accessToken || accessToken === 'undefined') {
    Alert.alert('Ошибка', 'accessToken не найден. Пожалуйста, пройдите аутентификацию заново.');
    return;
  }

  try {
    const userProfile = await fetchUserProfile(accessToken);
    return userProfile;

  } catch (error: any) {
    console.error('Failed to load userProfile:', error);
    if (error.response?.status === 401) {
      console.log('Unauthorized, redirecting to login...');
      await storeData(STORAGE_KEYS.ACCESS_TOKEN, "");
      return;
    }
    }
};

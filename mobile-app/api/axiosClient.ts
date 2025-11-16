import { STORAGE_KEYS } from '@/constants';
import { getDeviceInfo } from '@/utils/common';
import { getData, storeData } from '@/utils/storage';
import axios from 'axios';
import { Alert, Platform } from 'react-native';
import * as I from '../types/api';
import { adaptUserProfile } from '../types/api';
import * as EP from './endpoints';


const HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};


export const getAllCities = async () => {
  try {
    const response = await axios.get(EP.LIST_CITIES, {headers: HEADERS});
    return response.data.items.map((item: { id: number; name: string; }) => ({
      value: item.id, 
      label: item.name
    }));
  } catch (error) {
    console.error('Error in getAllCities:', error);
    throw error; // Пробрасываем ошибку дальше
  }
};


export const createUser = async (formData: I.UserFormData) => {
  try {
    const deviceInfo = await getDeviceInfo();

    const payload = {
      email: formData.email,
      name: formData.name,
      birth_date: formData.birthDate.toISOString().split('T')[0],
      height: formData.height,
      gender: formData.gender,
      city_id: formData.cityId,
      body_type: formData.bodyType,
      device_info: deviceInfo
    };
    const response = await axios.post(EP.REGISTRATION, payload, {
      headers: HEADERS,
    });

    return response.data;
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
};


export const verification = async (photoUri: string, selfieUri: string, userId: number) => {
  try {
    const formData = new FormData();

    // Добавляем user_id
    formData.append('user_id', userId.toString());

    // Для браузера - создаем правильные File объекты
    if (Platform.OS === 'web') {
      // Аватар
      const avatarResponse = await fetch(photoUri);
      const avatarBlob = await avatarResponse.blob();
      const avatarFile = new File([avatarBlob], `avatar_user_${userId}.jpg`, { type: 'image/jpeg' });
      formData.append('avatar', avatarFile);

      // Фото для верификации
      const verificationResponse = await fetch(selfieUri);
      const verificationBlob = await verificationResponse.blob();
      const verificationFile = new File([verificationBlob], `verification_user_${userId}.jpg`, { type: 'image/jpeg' });
      formData.append('verification_photo', verificationFile);
    } else {
      // Для React Native
      const avatarFile = {
        uri: photoUri,
        type: 'image/jpeg',
        name: `avatar_user_${userId}.jpg`,
      } as any;
      formData.append('avatar', avatarFile);

      const verificationFile = {
        uri: selfieUri,
        type: 'image/jpeg',
        name: `verification_user_${userId}.jpg`,
      } as any;
      formData.append('verification_photo', verificationFile);
    }

    console.log('Sending form data with fields:', {
      user_id: userId,
      avatar: `avatar_user_${userId}.jpg`,
      verification_photo: `verification_user_${userId}.jpg`
    });

    const response = await axios.post(EP.VERIFICATION, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error in verification:', error);
    throw error;
  }
};


export const checkUserStatus = async (userId: number) => {
  try {
    const response = await axios.get(EP.VERIFICATION_STATUS + userId, {headers: HEADERS});
    return response.data;

  } catch (error) {
    console.error('Error in checkUserStatus:', error);
    throw error;
  }
};


export const getAuthToken = async (email: string, password: string) => {
  try {

    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await axios.post(EP.LOGIN, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;

  } catch (error) {
    console.error('Error in Login:', error);
    throw error;
  }
};


export const getUserProfile = async () => {
  const accessToken = await getData(STORAGE_KEYS.ACCESS_TOKEN);

  if (!accessToken || accessToken === 'undefined') {
    Alert.alert('Ошибка', 'accessToken не найден. Пожалуйста, пройдите аутентификацию заново.');
    return;
  }

  try {
    const response = await axios.get(EP.MY_PROFILE, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return adaptUserProfile(response.data);

  } catch (error: any) {
    console.error('Failed to load userProfile:', error);
    if (error.response?.status === 401) {
      console.log('Unauthorized, redirecting to login...');
      await storeData(STORAGE_KEYS.ACCESS_TOKEN, "");
      return;
    }
    }
};


export const editUserProfile = async (accessToken: string, formData: {
  name: string;
  height: number | null;
  cityId: number | null;
  bodyType: string;
  bio: string;
  desires: string;
}): Promise<I.UserProfile> => {
  try {
    const requestData = {
      name: formData.name,
      height: formData.height,
      body_type: formData.bodyType,
      city_id: formData.cityId,
      bio: formData.bio || null,
      desires: formData.desires || null
    };

    const response = await axios.post(EP.EDIT_PROFILE, requestData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return adaptUserProfile(response.data);

  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  } 
};


export const resetPassword = async (email: string) => {
  try {
    const response = await axios.post(EP.RESET_PASSWROD, {email: email}, {headers: HEADERS});
    return response.data;

  } catch (error) {
    console.error('Error in Reset Password:', error);
    throw error;
  }
};


export const uploadPhotos = async (photoUris: string[], userId: number) => {
  const accessToken = await getData(STORAGE_KEYS.ACCESS_TOKEN);
  
  try {
    const formData = new FormData();

    // Для браузера - создаем правильные File объекты
    if (Platform.OS === 'web') {
      for (let i = 0; i < photoUris.length; i++) {
        const uri = photoUris[i];
        const response = await fetch(uri);
        const blob = await response.blob();
        const file = new File([blob], `photo_${userId}_${i}.jpg`, { type: 'image/jpeg' });
        formData.append('photos', file);
      }
    } else {
      // Для React Native
      photoUris.forEach((uri, index) => {
        const file = {
          uri: uri,
          type: 'image/jpeg',
          name: `photo_${userId}_${index}.jpg`,
        } as any;
        formData.append('photos', file);
      });
    }

    console.log('Sending photos:', {
      count: photoUris.length,
      userId: userId
    });

    const response = await axios.post(EP.UPLOAD_PHOTOS, formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    });

    return response.data;

  } catch (error) {
    console.error('Upload error:', error);
    Alert.alert('Ошибка', 'Не удалось загрузить фото');
    throw error;
  }
};
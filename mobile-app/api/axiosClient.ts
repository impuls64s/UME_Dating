import { getDeviceInfo } from '@/utils/common';
import axios from 'axios';
import { Platform } from 'react-native';
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
    return response.data.items.map((item: { id: any; name: any; }) => ({
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


export const fetchUserProfile = async (accessToken: string): Promise<I.UserProfile> => {
  try {

    const response = await axios.get(EP.MY_PROFILE, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return adaptUserProfile(response.data);

  } catch (error) {
    console.error('Error fetching my profile:', error);
    throw error;
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

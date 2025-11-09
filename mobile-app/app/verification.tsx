import { verification } from '@/api/axiosClient';
import BasicButton from '@/components/Buttons';
import { STORAGE_KEYS } from '@/constants';
import { getData } from '@/utils/storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function VerificationScreen() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const axios = require('axios');

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      // aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    } else if (!photo) {
      alert('Необходимо загрузить фото');
    }
  };

  const takeSelfieAsync = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        alert('Разрешение на использование камеры необходимо для селфи!');
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        // aspect: [3, 4],
        quality: 1,
      });
  
      if (!result.canceled) {
        setSelfie(result.assets[0].uri);
        console.log('Selfie taken:', result.assets[0]);
      }
    } catch (error) {
      console.error('Error taking selfie:', error);
      alert('Ошибка при создании селфи');
    }
  };

  const handleSubmit = async () => {
    if (!photo || !selfie) {
      if (typeof window !== 'undefined') {
        window.alert('Не все поля заполнены');
        return;
      } else {
        Alert.alert('Не все поля заполнены');
        return;
      }
    }

    try {
      const userId = await getData(STORAGE_KEYS.USER_ID);
      if (!userId) {
        Alert.alert('Ошибка', 'User ID не найден. Пожалуйста, пройдите регистрацию заново.');
        router.navigate('/registration');
        return;
      }

      console.log('Starting verification...');
      const result = await verification(photo, selfie, parseInt(userId));
      console.log('Verification successful:', result);
      router.navigate('/pending');
    } catch (error: any) {
      console.error('Verification failed:', error);
      if (axios.isAxiosError(error)) {
        Alert.alert('Ошибка', error.response?.data?.message || 'Произошла ошибка при верификации');
      } else {
        Alert.alert('Ошибка', 'Неизвестная ошибка');
      }
    }

  };


  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* Форма верификации */}
        <View style={styles.form}>
          <View style={styles.fieldContainer}>
          <Text style={styles.label}>
              Главное фото
              {'\n'}
              <Text style={styles.subLabel}>
                  Загрузите ваше самое свежее фото, где чётко видно лицо.
                  Это фото будет использоваться для верификации и как основное фото профиля.
                  {'\n'}
                  <Text style={styles.note}>Вы сможете изменить его позже в настройках профиля.</Text>
              </Text>
          </Text>

            {photo ? (
              <TouchableOpacity onPress={pickImageAsync} style={styles.imageContainer}>
                <Image source={{ uri: photo }} style={styles.photoImage} />
                <Text style={styles.changeText}>✏️ Изменить фото</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={pickImageAsync} style={styles.photoButton}>
                <View style={styles.photoButtonContent}>
                  <Text style={styles.photoIcon}>🖼️</Text>
                  <Text style={styles.photoButtonText}>Загрузить фото</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Селфи для верификации
              {'\n'}
              <Text style={styles.subLabel}>
                Сделайте селфи на фронтальную камеру.
                Ваше фото останется конфиденциальным и нужно только для подтверждения личности.
                {'\n'}
                <Text style={styles.note}>Это поможет подтвердить вашу личность</Text>
              </Text>
            </Text>

            {selfie ? (
              <TouchableOpacity onPress={takeSelfieAsync} style={styles.imageContainer}>
                <Image source={{ uri: selfie }} style={styles.photoImage} />
                <Text style={styles.changeText}>✏️ Переснять селфи</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={takeSelfieAsync} style={styles.photoButton}>
                <View style={styles.photoButtonContent}>
                  <Text style={styles.photoIcon}>📸</Text>
                  <Text style={styles.photoButtonText}>Сделать селфи</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          <BasicButton text='Отправить' handleOnPress={handleSubmit} />
        
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151718',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 10,
    paddingBottom: 200,
  },
  form: {
    marginTop: 10,
    backgroundColor: 'rgba(21, 23, 24, 0.9)',
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subLabel: {
      fontSize: 14,
      fontWeight: '400',
      color: '#cccccc',
      lineHeight: 20,
  },
  note: {
      fontSize: 12,
      color: '#888888',
      fontStyle: 'italic',
  },
  imageContainer: {
    alignItems: 'center',
  },
  photoImage: {
    width: 150,
    height: 150,
    borderRadius: 5,
    marginBottom: 8,
  },
  changeText: {
    color: '#888',
    fontSize: 14,
  },
  photoButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  photoButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  photoButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
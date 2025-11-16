import { resetPassword } from '@/api/axiosClient';
import BasicButton from '@/components/Buttons';
import { BasicTextField } from '@/components/Fields';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';


export default function DatingAppLogin() {
  const [login, setLogin] = useState('');
  const [isLoginFocused, setIsLoginFocused] = useState(false);

  const [responseSuccess, setResponseSuccess] = useState(false);
  const [successText, setSuccessText] = useState('');
  const [errors, setErrors] = useState('');
  const router = useRouter();
  const axios = require('axios');

  const handleSubmit = async () => {

    if (!login.trim()) {
      setErrors('Заполните все поля');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(login.trim())) {
      setErrors('Введите корректный email');
      return;
    }

    setErrors('');

    try {

      const result = await resetPassword(login);
      setResponseSuccess(true)
      setSuccessText(result.message)
      console.log('result =>', result)

    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message;
        setErrors(errorMessage)

      } else {
        console.error('Unexpected error:', err);
        const errorMessage = 'Неожиданная ошибка. Попробуйте еще раз.';
        if (typeof window !== 'undefined') {
          window.alert(`Ошибка: ${errorMessage}`);
        } else {
          Alert.alert('Ошибка', errorMessage);
        }
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
        <View style={styles.content}>
        {responseSuccess ? (
        <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successText}>{successText}</Text>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => router.navigate('/')}
            >
            <Text style={styles.buttonText}>Перейти к входу</Text>
            </TouchableOpacity>
        </View>
        ) : (
        <View>
            <Text style={styles.subtitle}>
            Введите email адрес указанный при регистрации
            </Text>
            {/* Форма входа */}
            <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <BasicTextField
                placeholder="username@example.com"
                isFocused={isLoginFocused}
                value={login}
                setFunc={setLogin}
                setIsFocusedFunc={setIsLoginFocused}
                keyboardType="email-address"
            />
            {errors ? <Text style={styles.errorText}>{errors}</Text> : null}

            {/* Кнопка сброса пароля */}
            <BasicButton
                text='Сбросить пароль'
                handleOnPress={handleSubmit}
            />
            </View>
        </View>
        )}
        
          
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    paddingVertical: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 10,
    textAlign: 'center',
  },
  form: {
    marginTop: 40,
    width: '100%',
    backgroundColor: 'rgba(21, 23, 24, 0.9)',
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginBottom: 20,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#151718',
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF', // белый текст
    lineHeight: 22,
    marginBottom: 30,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff', // синий фон кнопки
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
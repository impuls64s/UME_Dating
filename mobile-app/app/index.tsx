import BasicButton from '@/components/Buttons';
import { BasicTextField } from '@/components/Fields';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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
  const [password, setPassword] = useState('');
  const [isLoginFocused, setIsLoginFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    // Обработка входа
    console.log('Login attempt:', { login, password });
  };

  const handleForgotPassword = () => {
    // Обработка восстановления пароля
    console.log('Forgot password');
  };

  const handleRegister = () => {
    console.log('Navigate to registration');
    router.navigate('/registration');
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
          {/* Заголовок - всегда отображаем */}
          <Text style={styles.title}>🤍 UME Dating</Text>
          <Text style={styles.subtitle}>Найди свою вторую половинку</Text>
          <Text style={styles.subtitle}>Только реальные люди</Text>

          {/* Форма входа */}
          <View style={styles.form}>
            <BasicTextField
              placeholder="Email"
              isFocused={isLoginFocused}
              value={login}
              setFunc={setLogin}
              setIsFocusedFunc={setIsLoginFocused}
              keyboardType="email-address"
            />

            <BasicTextField
              placeholder="Пароль"
              isFocused={isPasswordFocused}
              value={password}
              setFunc={setPassword}
              setIsFocusedFunc={setIsPasswordFocused}
              secureTextEntry={true}
            />

            {/* Кнопка входа */}
            <BasicButton
              text='Войти'
              handleOnPress={handleLogin}
            />

            {/* Ссылки - всегда отображаем */}
            <View style={styles.linksContainer}>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.link}>Забыли пароль?</Text>
              </TouchableOpacity>
              
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Нет аккаунта? </Text>
                <TouchableOpacity onPress={handleRegister}>
                  <Text style={styles.registerLink}>Зарегистрируйтесь</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 150, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
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
  linksContainer: {
    alignItems: 'center',
  },
  link: {
    color: '#66b3ff',
    fontSize: 14,
    marginBottom: 15,
    textDecorationLine: 'underline',
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  registerText: {
    color: '#cccccc',
    fontSize: 14,
  },
  registerLink: {
    color: '#66b3ff',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  icon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    opacity: 0.0,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
});
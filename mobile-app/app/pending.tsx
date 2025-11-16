import { checkUserStatus } from '@/api/axiosClient';
import { STORAGE_KEYS, userStatuses } from '@/constants';
import { getData } from '@/utils/storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function VerificationPendingScreen() {
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let interval: number;
  
    const checkUser = async () => {
      const userId = await getData(STORAGE_KEYS.USER_ID);
      if (!userId) {
        Alert.alert('Ошибка', 'User ID не найден. Пожалуйста, пройдите регистрацию заново.');
        router.navigate('/registration');
        return;
      }
  
      const result = await checkUserStatus(parseInt(userId));
      console.log("RESULT", result.status);
  
      // Сохраняем статус и останавливаем интервал для финальных статусов
      setUserStatus(result.status);
      
      // Останавливаем проверку для финальных статусов
      if ([
        userStatuses.ACTIVE.value,
        userStatuses.REJECTED.value, 
        userStatuses.BANNED.value,
        userStatuses.DELETED.value
      ].includes(result.status)) {
        clearInterval(interval);
      }
    };
  
    interval = setInterval(checkUser, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Карточка статуса верификации */}
        <View style={styles.statusCard}>

        {!userStatus || userStatus === userStatuses.PENDING.value ? (
          // Показ загрузки для pending или пока статус неизвестен
          <>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007bff" />
              <Text style={styles.loadingText}>Идёт проверка...</Text>
            </View>
            <Text style={styles.description}>
              Мы проверяем ваши данные. 
              Это обычно занимает от нескольких минут до 24 часов.
            </Text>
          </>
        ) : userStatus === userStatuses.ACTIVE.value ? (
          // Успешная верификация
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>Поздравляем!</Text>
            <Text style={styles.successText}>
              Проверка пройдена успешно. Вернитесь на страницу аутентификации 
              и введите логин и пароль, высланный на вашу почту.
            </Text>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => router.navigate('/')}
            >
              <Text style={styles.buttonText}>Перейти к входу</Text>
            </TouchableOpacity>
          </View>
        ) : userStatus === userStatuses.REJECTED.value ? (
          // Отклоненная заявка
          <View style={styles.rejectedContainer}>
            <Text style={styles.rejectedIcon}>❌</Text>
            <Text style={styles.rejectedTitle}>Заявка отклонена</Text>
            <Text style={styles.rejectedText}>
              К сожалению, ваша заявка не прошла проверку. 
              Пожалуйста, обратитесь в поддержку для уточнения деталей.
            </Text>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => router.navigate('/registration')}
            >
              <Text style={styles.buttonText}>Попробовать снова</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Другие статусы (banned, deleted, inactive)
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Произошла ошибка</Text>
            <Text style={styles.errorText}>
              Статус вашего аккаунта: {userStatus}. 
              Обратитесь в поддержку для решения вопроса.
            </Text>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => router.navigate('/')}
            >
              <Text style={styles.buttonText}>Связаться с поддержкой</Text>
            </TouchableOpacity>
          </View>
        )}

          {/* Что далее и О нас */}
          <View style={styles.infoContainer}>

            <View style={styles.noteContainer}>
              <View style={styles.noteHeader}>
                {/* <Text style={styles.noteIcon}>📋</Text> */}
                <Text style={styles.noteTitle}>Что дальше?</Text>
              </View>
              
              <View style={styles.noteItems}>
                <View style={styles.noteItem}>
                  <Text style={styles.noteItemIcon}>🔔</Text>
                  <Text style={styles.noteItemText}>
                    Вы получите уведомление о результате проверки
                  </Text>
                </View>
                
                <View style={styles.noteItem}>
                  <Text style={styles.noteItemIcon}>✅</Text>
                  <Text style={styles.noteItemText}>
                    После подтверждения ваш профиль станет активным
                  </Text>
                </View>
                
                <View style={styles.noteItem}>
                  <Text style={styles.noteItemIcon}>💬</Text>
                  <Text style={styles.noteItemText}>
                    Вы сможете начать общение с другими пользователями
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.noteContainer}>
              <View style={styles.noteHeader}>
                {/* <Text style={styles.noteIcon}>🤍</Text> */}
                <Text style={styles.noteTitle}>О нас</Text>
              </View>
              
              <View style={styles.noteItems}>
                <View style={styles.noteItem}>
                  <Text style={styles.noteItemIcon}>👤</Text>
                  <Text style={styles.noteItemText}>
                    <Text style={{fontWeight: 'bold'}}>Только реальные люди.</Text> Все пользователи проходят обязательную верификацию.
                  </Text>
                </View>
                
                <View style={styles.noteItem}>
                  <Text style={styles.noteItemIcon}>🗳️</Text>
                  <Text style={styles.noteItemText}>
                    <Text style={{fontWeight: 'bold'}}>Вопросы от сообщества.</Text> Мужчины и женщины голосованием выбирают, на какие вопросы ответит противоположенная сторона.
                  </Text>
                </View>
                
                <View style={styles.noteItem}>
                  <Text style={styles.noteItemIcon}>💬</Text>
                  <Text style={styles.noteItemText}>
                    <Text style={{fontWeight: 'bold'}}>Мини-обсуждения.</Text> Участвуйте в легких и интересных дискуссиях по актуальным темам.
                  </Text>
                </View>
                
                <View style={styles.noteItem}>
                  <Text style={styles.noteItemIcon}>🏆</Text>
                  <Text style={styles.noteItemText}>
                    <Text style={{fontWeight: 'bold'}}>Рейтинги и ТОПы.</Text> Соревнуйтесь за место в топе за неделю, месяц или за всё время.
                  </Text>
                </View>
                
                <View style={styles.noteItem}>
                  <Text style={styles.noteItemIcon}>🏹</Text>
                  <Text style={styles.noteItemText}>
                    <Text style={{fontWeight: 'bold'}}>Игра в Купидона.</Text> Подбери идеальную пару для случайного пользователя и стань современным богом любви!
                  </Text>
                </View>
              </View>
            </View>

          </View>

        </View>

      </ScrollView>
    </View>
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
    paddingTop: 50,
    paddingBottom: 100,
    justifyContent: 'center',
  },
  statusCard: {
    backgroundColor: 'rgba(21, 23, 24, 0.9)',
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 15,
    fontWeight: '500',
  },
  infoContainer: {
    width: '100%',
  },
  description: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  noteText: {
    color: '#cccccc',
    fontSize: 14,
    lineHeight: 20,
  },
  noteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  noteItems: {
    gap: 10,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteItemIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  noteItemText: {
    flex: 1,
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
  },
  successContainer: {
    alignItems: 'center',
    padding: 20,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF', // Белый текст
    lineHeight: 22,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    margin: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rejectedContainer: {
    alignItems: 'center',
    padding: 20,
  },
  rejectedIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  rejectedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 15,
    textAlign: 'center',
  },
  rejectedText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 30,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 15,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 30,
  },
});
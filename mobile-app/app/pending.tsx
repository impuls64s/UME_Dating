import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function VerificationPendingScreen() {
  const router = useRouter();

//   useEffect(() => {
//     // Имитация обработки верификации - через 3 секунды переходим дальше
//     const timer = setTimeout(() => {
//       router.navigate('/profile');
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, []);

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Карточка статуса верификации */}
        <View style={styles.statusCard}>
          
          {/* Анимация загрузки */}
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Идёт проверка...</Text>
          </View>

          {/* Информация о статусе */}
          <View style={styles.infoContainer}>
            {/* <Text style={styles.title}>Проверка документов</Text> */}
            
            <Text style={styles.description}>
              Мы проверяем ваши данные. 
              Это обычно занимает от нескольких минут до 24 часов.
            </Text>

            <View style={styles.stepsContainer}>
              <View style={styles.step}>
                <Text style={styles.stepIcon}>✅</Text>
                <Text style={styles.stepText}>Фото загружены</Text>
              </View>
              
              <View style={styles.step}>
                <Text style={styles.stepIcon}>⏳</Text>
                <Text style={styles.stepText}>Проверка модератором</Text>
              </View>
              
              <View style={styles.step}>
                <Text style={styles.stepIcon}>📧</Text>
                <Text style={styles.stepText}>Уведомление о результате</Text>
              </View>
            </View>

            <View style={styles.noteContainer}>
              <Text style={styles.noteTitle}>Что дальше?</Text>
              <Text style={styles.noteText}>
                • Вы получите уведомление о результате проверки{'\n'}
                • После подтверждения ваш профиль станет активным{'\n'}
                • Вы сможете начать общение с другими пользователями
              </Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  stepsContainer: {
    marginBottom: 30,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
  },
  stepIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  stepText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  noteContainer: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 123, 255, 0.3)',
  },
  noteTitle: {
    color: '#66b3ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noteText: {
    color: '#cccccc',
    fontSize: 14,
    lineHeight: 20,
  },
});
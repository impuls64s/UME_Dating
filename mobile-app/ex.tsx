import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function RegistrationScreen() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    birthDate: new Date(2000, 0, 1),
    height: '',
    weight: '',
    gender: '',
    city: ''
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, birthDate: selectedDate }));
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleSubmit = () => {
    console.log('Registration data:', formData);
    // Обработка регистрации
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

        {/* Форма регистрации */}
        <View style={styles.form}>
          {/* Имя */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Имя</Text>
            <TextInput
              style={styles.input}
              placeholder="Введите ваше имя"
              placeholderTextColor="#888"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
          </View>

          {/* Дата рождения */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Дата рождения</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formatDate(formData.birthDate)}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.birthDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          {/* Рост и вес в одну строку */}
          <View style={styles.rowContainer}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Рост (см)</Text>
              <TextInput
                style={styles.input}
                placeholder="170"
                placeholderTextColor="#888"
                value={formData.height}
                onChangeText={(value) => handleInputChange('height', value)}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>Вес (кг)</Text>
              <TextInput
                style={styles.input}
                placeholder="65"
                placeholderTextColor="#888"
                value={formData.weight}
                onChangeText={(value) => handleInputChange('weight', value)}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          </View>

          {/* Пол в одну строку */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Пол</Text>
            <View style={styles.genderContainer}>
              {['Мужской', 'Женский'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    formData.gender === gender && styles.genderButtonActive
                  ]}
                  onPress={() => handleInputChange('gender', gender)}
                >
                  <Text style={[
                    styles.genderText,
                    formData.gender === gender && styles.genderTextActive
                  ]}>
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Город */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Город</Text>
            <TextInput
              style={styles.input}
              placeholder="Введите ваш город"
              placeholderTextColor="#888"
              value={formData.city}
              onChangeText={(value) => handleInputChange('city', value)}
            />
          </View>

          {/* Кнопка регистрации */}
          <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
            <Text style={styles.registerButtonText}>Зарегистрироваться</Text>
          </TouchableOpacity>
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
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 30,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfField: {
    width: '48%',
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
  },
  dateInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 15,
    justifyContent: 'center',
  },
  dateText: {
    color: '#ffffff',
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: 'rgba(0, 123, 255, 0.2)',
    borderColor: '#007bff',
  },
  genderText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  genderTextActive: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    alignItems: 'center',
    padding: 15,
  },
  backLink: {
    color: '#66b3ff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});


{/* Дата рождения */}
<View style={styles.fieldContainer}>
<Text style={styles.label}>Дата рождения</Text>
<TouchableOpacity 
  style={[styles.dateInput, isBirthdayFocused && styles.dateinputFocused]}
  onPress={() => setIsBirthdayFocused(true)}
  onPressOut={() => setIsBirthdayFocused(false)}
>
  <Text style={styles.dateText}>
    {formatDate(formData.birthDate)}
  </Text>
</TouchableOpacity>
{isBirthdayFocused && (
  <DateTimePicker
    value={formData.birthDate}
    mode="date"
    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
    onChange={handleDateChange}
    maximumDate={new Date()}
  />
)}
</View>




const handleInputChange = (field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

const handleDateChange = (event: any, selectedDate?: Date) => {
  if (selectedDate) {
    setFormData(prev => ({ ...prev, birthDate: selectedDate }));
  }
};

import { createUser, getAllCities } from '@/api/axiosClient';
import BasicButton from '@/components/Buttons';
import { BasicNumericField, BasicTextField } from '@/components/Fields';
import { GENDERS, STORAGE_KEYS, bodyTypeOptions } from '@/constants';
import { storeData } from '@/utils/storage';
import DatePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
import { Dropdown } from 'react-native-element-dropdown';
import * as I from '../types/api';


export default function RegistrationScreen() {
  const router = useRouter();
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isCityFocused, setIsCityFocused] = useState(false);
  const [isHeightFocused, setIsHeightFocused] = useState(false);
  const [dataCities, setDataCities] = useState<I.City[]>([]);
  const [selectedBodyType, setSelectedBodyType] = useState('average');

  const today = new Date();
  const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

  const axios = require('axios');
  
  const [errors, setErrors] = useState<I.UserFormErrors>({});
  const [formData, setFormData] = useState<I.UserFormData>({
    email: '',
    name: '',
    birthDate: new Date(2000, 0, 1),
    height: '',
    gender: '',
    cityId: '',
    bodyType: 'average',
  });

  

  const handleSubmit = async () => {
    // Проверка заполненности полей
    if (Object.values(formData).some(value => !value)) {
      const errorMessage = 'Пожалуйста, заполните все поля перед отправкой.';
      if (typeof window !== 'undefined') {
        window.alert(`Ошибка: ${errorMessage}`);
      } else {
        Alert.alert('Ошибка', errorMessage);
      }
      console.info('Не все поля заполнены:', formData);
      return;
    }
  
    try {
      console.log('Registration data:', formData);
      const result = await createUser(formData);
      console.log('User created successfully:', result);

      // Дополнительная проверка успешности ответа
      if (result.success) {
        const userId = result.user_id || result.data?.user_id;
        await storeData(STORAGE_KEYS.USER_ID, userId.toString())
        router.navigate('/verification');
      } else {
        // Обработка случая когда API возвращает success: false
        console.error('API returned success: false:', result);
        if (result.errors) {
          handleApiErrors(result.errors);
        }
      }
      
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error('Axios error:', {
          status: err.response?.status,
          message: err.response?.data?.message,
          errors: err.response?.data?.errors
        });
        
        // Безопасная обработка ошибок
        if (err.response?.data?.errors) {
          handleApiErrors(err.response.data.errors);
        } else {
          const errorMessage = err.response?.data?.message || 'Произошла ошибка при регистрации';
          if (typeof window !== 'undefined') {
            window.alert(`Ошибка: ${errorMessage}`);
          } else {
            Alert.alert('Ошибка', errorMessage);
          }
        }
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
  
  const handleInputChange = (field: keyof I.UserFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const handleApiErrors = (apiErrors: any[]) => {
    const errorMap: I.UserFormErrors = {};
    apiErrors.forEach(error => {
      errorMap[error.field as keyof I.UserFormErrors] = error.message;
    });
    setErrors(errorMap);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setFormData(prev => ({ ...prev, birthDate: selectedDate }));
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const cityItems = await getAllCities();
        setDataCities(cityItems);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
  
    fetchCities();
  }, []);


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

        {/* Почта */}
        <Text style={styles.label}>Email</Text>
          <BasicTextField
            placeholder="username@example.com"
            isFocused={isEmailFocused}
            value={formData.email}
            setFunc={(value) => handleInputChange('email', value)}
            setIsFocusedFunc={setIsEmailFocused}
            keyboardType='email-address'
          />
          {errors.email && (<Text style={styles.errorText}>{errors.email}</Text>)}

          {/* Имя */}
          <Text style={styles.label}>Имя</Text>
          <BasicTextField
            placeholder="Введите ваше имя"
            isFocused={isNameFocused}
            value={formData.name}
            setFunc={(value) => handleInputChange('name', value)}
            setIsFocusedFunc={setIsNameFocused}
            keyboardType="default"
            autoCapitalize='words'
          />
          {errors.name && (<Text style={styles.errorText}>{errors.name}</Text>)}

          {/* Город */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Город</Text>
            <Dropdown
              style={[styles.selectBox, isCityFocused && styles.inputFocused]}
              placeholderStyle={styles.placeholderText}
              selectedTextStyle={styles.selectInputText}
              containerStyle={styles.selectDropdown}
              itemTextStyle={styles.selectDropdownText}
              activeColor='rgba(255, 255, 255, 0.1)'
              inputSearchStyle={styles.selectDropdownText}
              searchPlaceholderTextColor="#888"
              data={dataCities}
              labelField="label"
              valueField="value"
              placeholder="Введите ваш город"
              onChange={item => {
                handleInputChange('cityId', item.value);
              }}
              search={true}
              searchQuery={(keyword, label) => {
                return label.toLowerCase().startsWith(keyword.toLowerCase());
              }}
              searchPlaceholder="Поиск..."
              onFocus={() => setIsCityFocused(true)}
              onBlur={() => setIsCityFocused(false)}
              value={formData.cityId}
            />
          </View>
          {errors.cityId && (<Text style={styles.errorText}>{errors.cityId}</Text>)}

          {/* Дата рождения */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Дата рождения</Text>
            
            {Platform.OS === 'web' ? (
              // Версия для веба - обычное текстовое поле с маской
              <input
                type="date"
                value={formData.birthDate.toISOString().split('T')[0]}
                onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setFormData(prev => ({ ...prev, birthDate: newDate }));
                }}
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 12,
                    padding: 15,
                    color: '#ffffff',
                    fontSize: 16,
                    width: '100%',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box', // ← важно! чтобы padding не увеличивал ширину
                    height: 50, // ← фиксированная высота как у других полей
                    marginBottom: 20, // ← отступ как у других полей
                    outline: 'none', // ← убираем стандартный outline
                }}
                onFocus={(e) => {
                    // Добавляем стиль фокуса
                    e.target.style.borderColor = '#007bff';
                    e.target.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
                }}
                onBlur={(e) => {
                    // Возвращаем обычные стили
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                max={new Date().toISOString().split('T')[0]}
              />
            ) : (
                <>
                  <DatePicker
                    value={formData.birthDate}
                    mode="date"
                    // onChange={handleDateChange}
                    onChange={handleDateChange}
                    maximumDate={minAgeDate}
                    locale="ru_RU"
                    themeVariant="dark"
                  />
                </>
          )}
          </View>
          {errors.birthDate && (<Text style={styles.errorText}>{errors.birthDate}</Text>)}

          {/* Рост и телосложение в одну строку */}
          <View style={styles.rowContainer}>

            <View style={{ width: '32%' }}>
              <Text style={styles.label}>Рост (см)</Text>
              <BasicNumericField
                  placeholder=""
                  isFocused={isHeightFocused}
                  value={formData.height}
                  // setFunc={(value) => handleInputChange('height', value)}
                  setFunc={(value) => handleInputChange('height', value ? parseInt(value, 10) : '')}
                  setIsFocusedFunc={setIsHeightFocused}
                  maxLength={3}
                  keyboardType="numeric"
              />
            </View>
            {errors.height && (<Text style={styles.errorText}>{errors.height}</Text>)}

            <View style={{ width: '66%' }}>
              <Text style={styles.label}>Телосложение</Text>

              <Dropdown
                style={styles.selectBox}
                placeholderStyle={styles.selectInputText}
                selectedTextStyle={styles.selectInputText}
                containerStyle={styles.selectDropdown}
                itemTextStyle={styles.selectDropdownText}
                activeColor='rgba(255, 255, 255, 0.1)'
                data={bodyTypeOptions}
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder="Выберите телосложение"
                value={selectedBodyType}
                onChange={item => {
                  setSelectedBodyType(item.value);
                  handleInputChange('bodyType', item.value); // сразу отправляем 'average', 'slim' и т.д.
                }}
                mode='auto'
              />
            </View>
            {errors.bodyType && (<Text style={styles.errorText}>{errors.bodyType}</Text>)}

          </View>

          {/* Пол в одну строку */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Пол</Text>
            <View style={styles.genderContainer}>
              {GENDERS.map((g) => (
                <TouchableOpacity
                  key={g.value}
                  style={[
                    styles.genderButton,
                    formData.gender === g.value && styles.genderButtonActive,
                  ]}
                  onPress={() => handleInputChange('gender', g.value)}
                >
                  <Text
                    style={[
                      styles.genderText,
                      formData.gender === g.value && styles.genderTextActive,
                    ]}
                  >
                    {g.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {errors.gender && (<Text style={styles.errorText}>{errors.gender}</Text>)}

          {/* Кнопка регистрации */}
          <BasicButton
            text='Далее'
            handleOnPress={handleSubmit}
          />
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
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
  selectBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  selectInputText: {
    color: '#ffffff',
    fontSize: 16,
  },
  selectDropdown: {
    backgroundColor: '#151718',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    marginTop: 5,
  },
  selectDropdownText: {
    color: '#ffffff',
    fontSize: 16,
  },
  inputFocused: {
    borderColor: '#007bff',
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginBottom: 8,
  },

});
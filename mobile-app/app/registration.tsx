import BasicButton from '@/components/Buttons';
import { BasicNumericField, BasicTextField } from '@/components/Fields';
import { LIST_CITIES } from '@/constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
import { Dropdown } from 'react-native-element-dropdown';
// import { SelectList } from 'react-native-dropdown-select-list';

interface City {
  key: string;
  value: string;
}

export default function RegistrationScreen() {
  const router = useRouter();
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isBirthdayFocused, setIsBirthdayFocused] = useState(false);
  const [isHeightFocused, setIsHeightFocused] = useState(false);
  const [dataCities, setDataCities] = useState<City[]>([]);

  const today = new Date();
  const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

  const axios = require('axios');
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    birthDate: new Date(2000, 0, 1),
    height: '',
    gender: '',
    city_id: '',
    bodyType: '',
  });

  const bodyTypeOptions = [
    { value: 'average', label: 'Обычное' },
    { value: 'slim', label: 'Худощавое' },
    { value: 'athletic', label: 'Атлетическое' },
    { value: 'full', label: 'Полное' },
    { value: 'muscular', label: 'Мускулистое' },
  ];
  
  const [selectedBodyType, setSelectedBodyType] = useState('average');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setFormData(prev => ({ ...prev, birthDate: selectedDate }));
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Europe/Moscow'
    });
  };

  const handleSubmit = () => {
    console.log('Registration data:', formData);
    router.navigate('/verification');
  };

  useEffect(() => {
    axios.get(LIST_CITIES, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response: any) => {
      let newArray = response.data.items.map((item: { id: any; name: any; }) => {
        return {value: item.id, label: item.name}
      })
      setDataCities(newArray)
    }
    )
    .catch((error: any) => console.error(error));
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

        <Text style={styles.label}>Email</Text>
          <BasicTextField
            placeholder="username@example.com"
            isFocused={isEmailFocused}
            value={formData.email}
            setFunc={(value) => handleInputChange('email', value)}
            setIsFocusedFunc={setIsEmailFocused}
            keyboardType='email-address'
          />

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
                // Версия для мобильных устройств
                <>
                <TextInput
                    style={[styles.dateInput, isBirthdayFocused && styles.dateInputFocused]}
                    placeholder="Выберите дату"
                    placeholderTextColor="#888"
                    value={formatDate(formData.birthDate)}
                    onFocus={() => setIsBirthdayFocused(true)}
                    onBlur={() => setIsBirthdayFocused(false)}
                    showSoftInputOnFocus={false}
                    editable={true}
                />
                
                {isBirthdayFocused && (
                  <DateTimePicker
                    value={formData.birthDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={minAgeDate}
                    locale="ru_RU"
                    themeVariant="light"
                    textColor="#ffffff" // Для iOS 14+
                    style={
                      Platform.OS === 'ios' 
                          ? { backgroundColor: '#1a1a1a' } 
                          : { backgroundColor: '#ffffff' }
                    }
                    timeZoneName={'UTC'}
                  />
                )}
                </>
          )}
          </View>

          {/* Рост и телосложение в одну строку */}
          <View style={styles.rowContainer}>

            <View style={{ width: '32%' }}>
                <Text style={styles.label}>Рост (см)</Text>
                <BasicNumericField
                    placeholder="170"
                    isFocused={isHeightFocused}
                    value={formData.height}
                    setFunc={(value) => handleInputChange('height', value)}
                    setIsFocusedFunc={setIsHeightFocused}
                    maxLength={3}
                    keyboardType="numeric"
                />
            </View>

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
            <Dropdown
                style={styles.selectBox}
                placeholderStyle={styles.selectInputText}
                selectedTextStyle={styles.selectInputText}
                // containerStyle={styles.selectDropdown}
                mode='modal'
                containerStyle={[styles.selectDropdown, styles.modalContainer]}
                itemContainerStyle={styles.compactItem}

                itemTextStyle={styles.selectDropdownText}
                inputSearchStyle={styles.selectInputText}
                activeColor='rgba(255, 255, 255, 0.1)'
                data={dataCities}
                labelField="label"
                valueField="value"
                placeholder="Введите ваш город"
                onChange={item => {
                  handleInputChange('city_id', item.value);
                }}
                search={true}
                searchQuery={(keyword, label) => {
                  return label.toLowerCase().startsWith(keyword.toLowerCase());
                }}
                //dropdownPosition='top'
              />
          </View>
          

          {/* <View style={styles.fieldContainer}>
            <Text style={styles.label}>Город</Text>
            <TextInput
              style={styles.input}
              placeholder="Введите ваш город"
              placeholderTextColor="#888"
              value={formData.city}
              onChangeText={(value) => handleInputChange('city', value)}
            />
          </View> */}

          {/* <View style={styles.fieldContainer}>
            <Text style={styles.label}>Город</Text>
            <SelectList
                setSelected={(selectedValue: string) => {handleInputChange('city_id', selectedValue)}}
                data={dataCities}
                save="key"
                boxStyles={styles.selectBox}
                inputStyles={styles.selectInputText}
                dropdownStyles={styles.selectDropdown}
                dropdownTextStyles={styles.selectDropdownText}
                search={true}
                placeholder='Выберите свой город'
                searchPlaceholder='Поиск'
            />
          </View> */}

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
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    color: '#ffffff',
    fontSize: 16,
  },
  dateInputFocused: {
    borderColor: '#007bff',
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
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
  // selectBox: {
  //   backgroundColor: 'rgba(255, 255, 255, 0.1)',
  //   borderColor: 'rgba(255, 255, 255, 0.2)',
  //   borderRadius: 12,
  //   paddingHorizontal: 15,
  //   height: 50,
  // },
  // selectInputText: {
  //   color: '#ffffff',
  //   fontSize: 16,
  // },
  // selectDropdown: {
  //   backgroundColor: '#151718',
  //   borderColor: 'rgba(255, 255, 255, 0.2)',
  // },
  // selectDropdownText: {
  //   color: '#ffffff',
  // },
  selectBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
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
  modalContainer: {
    margin: 10,           // ← меньше отступов
    marginTop: 10,        // ← совсем вверху
    backgroundColor: '#151718',
    borderRadius: 12,
    padding: 15,
    minHeight: 150,
    maxHeight: 400,
  },
  compactItem: {
    height: 44,                      // компактные элементы
    paddingVertical: 8,
  },
});
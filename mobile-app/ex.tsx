import { getAllCities } from '@/api/axiosClient';
import BasicButton from '@/components/Buttons';
import { BasicNumericField, BasicTextField } from '@/components/Fields';
import { bodyTypeOptions } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import * as I from '../../../types/api';

export default function EditProfileModal() {
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isCityFocused, setIsCityFocused] = useState(false);
  const [isHeightFocused, setIsHeightFocused] = useState(false);
  const [dataCities, setDataCities] = useState<I.City[]>([]);
  const [selectedBodyType, setSelectedBodyType] = useState('average');

  const [formData, setFormData] = useState({
    name: '',
    height: '',
    cityId: '',
    bodyType: '',
  });

  const handleClose = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (Object.values(formData).some(value => !value)) {
      console.info('Не все поля заполнены:', formData);
      return;
    }

    try {
      console.log('Profile update data:', formData);
      router.back();
    } catch (err: any) {
      console.error('Update error:', err);
    }
  };

  const handleInputChange = (field: keyof I.UserFormData, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
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
      {/* Хедер с кнопкой закрытия */}
      <View style={styles.header}>
        <Text style={styles.title}>Редактировать профиль</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Форма */}
        <View style={styles.form}>

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
              mode='auto'
            />
          </View>

          {/* Рост и телосложение в одну строку */}
          <View style={styles.rowContainer}>
            <View style={{ width: '32%' }}>
              <Text style={styles.label}>Рост (см)</Text>
              <BasicNumericField
                placeholder=""
                isFocused={isHeightFocused}
                value={formData.height}
                setFunc={(value) => handleInputChange('height', value ? parseInt(value, 10) : '')}
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
                  handleInputChange('bodyType', item.value);
                }}
                mode='auto'
              />
            </View>
          </View>

          {/* Кнопка сохранения */}
          <BasicButton
            text='Сохранить изменения'
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 10,
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
});
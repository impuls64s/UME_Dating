import { editUserProfile, getAllCities, getUserProfile } from '@/api/axiosClient';
import BasicButton from '@/components/Buttons';
import { BasicNumericField, BasicTextField } from '@/components/Fields';
import { bodyTypeOptions, STORAGE_KEYS } from '@/constants';
import { getData } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import * as I from '../../../types/api';

export default function EditProfileModal() {
  const [isLoading, setIsLoading] = useState(true);

  const [dataCities, setDataCities] = useState<I.City[]>([]);
  const [filteredCities, setFilteredCities] = useState<I.City[]>([]);

  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isCityFocused, setIsCityFocused] = useState(false);
  const [isHeightFocused, setIsHeightFocused] = useState(false);
  const [isBodyTypeFocused, setisBodyTypeFocused] = useState(false);
  const [isBioFocused, setIsBioFocused] = useState(false);
  const [isDesiresFocused, setIsDesiresFocused] = useState(false);


  const [formData, setFormData] = useState({
    name: '',
    height: null as number | null,
    cityId: null as number | null,
    bodyType: '',
    bio: '',
    desires: ''
  });

  const handleClose = () => {
    router.dismiss();
  };

  const handleSubmit = async () => {
    const { bio, desires, ...requiredFields } = formData;
  
    if (Object.values(requiredFields).some(value => !value)) {
      const errorMessage = 'Пожалуйста, заполните все поля перед отправкой.';
      if (typeof window !== 'undefined') {
        window.alert(`Ошибка: ${errorMessage}`);
      } else {
        Alert.alert('Ошибка', errorMessage);
      }
      console.info('Не все поля заполнены:', formData);
      return;
    };

    try {
      console.log('Profile update data:', formData);
      const accessToken = await getData(STORAGE_KEYS.ACCESS_TOKEN);
      if (accessToken) {
        const updatedUserProfile = await editUserProfile(accessToken, formData)
        console.log('UPD', updatedUserProfile)
        router.dismiss();

      }

    } catch (err: any) {
      console.error('Update error:', err);
    }
  };

  const handleInputChange = (field: keyof I.EditProfile, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchCities = async () => {

      setIsLoading(true);

      try {
        const cityItems = await getAllCities();
        setDataCities(cityItems);
        setFilteredCities(cityItems);
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const loadProfile = async () => {
      const profile = await getUserProfile();
      console.log('PROFILE', profile)
      if (profile) {
        setFormData({
          name: profile.name || '',
          height: profile.height || null,
          cityId: profile.cityId || null,
          bodyType: profile.bodyType || '',
          bio: profile.bio || '',
          desires: profile.desires || '',
        });
      }
    };
      
    loadProfile();
    fetchCities();
  }, []);

  const handleCitySearch = (text: string) => {
    if (text) {
      const filtered = dataCities.filter(city => 
        city.label.toLowerCase().startsWith(text.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(dataCities);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Редактирование профиля</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Загрузка...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Хедер с кнопкой закрытия */}
      <View style={styles.header}>
        <Text style={styles.title}>Редактирование профиля</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
          <View style={[styles.fieldContainer, { zIndex: 3000 }]}>
            <Text style={styles.label}>Город</Text>
            <DropDownPicker
              open={isCityFocused}
              setOpen={setIsCityFocused}
              value={formData.cityId}
              setValue={(callback) => {
                const newValue = callback(formData.cityId);
                handleInputChange('cityId', newValue);
                setFilteredCities(dataCities);
              }}
              items={filteredCities}
              searchable={true}
              searchPlaceholder="Поиск..."
              onChangeSearchText={handleCitySearch}
              placeholder="Введите ваш город"
              style={[styles.selectBox, isCityFocused && styles.inputFocused]}
              dropDownContainerStyle={styles.selectDropdown}
              textStyle={styles.selectInputText}
              placeholderStyle={styles.placeholderText}
              searchTextInputStyle={styles.selectDropdownText}
              listItemLabelStyle={styles.selectDropdownText}
            />
          </View>

          {/* Рост и телосложение в одну строку */}
          <View style={[styles.rowContainer, { zIndex: 2000 }]}>
            <View style={{ width: '32%' }}>
              <Text style={styles.label}>Рост (см)</Text>
              <BasicNumericField
                placeholder=""
                isFocused={isHeightFocused}
                value={formData.height?.toString() || ''}
                setFunc={(value) => {
                  const numericValue = value.replace(/[^0-9]/g, '');
                  handleInputChange('height', numericValue ? parseInt(numericValue) : null);
                }}
                setIsFocusedFunc={setIsHeightFocused}
                maxLength={3}
                keyboardType="numeric"
              />
            </View>

            <View style={{ width: '66%' }}>
              <Text style={styles.label}>Телосложение</Text>
              <DropDownPicker
                open={isBodyTypeFocused}
                setOpen={setisBodyTypeFocused}
                value={formData.bodyType}
                setValue={(callback) => {
                  const newValue = callback(formData.bodyType);
                  handleInputChange('bodyType', newValue);
                }}
                items={bodyTypeOptions}

                style={[styles.selectBox, isCityFocused && styles.inputFocused]}
                dropDownContainerStyle={styles.selectDropdown}
                textStyle={styles.selectInputText}
                placeholderStyle={styles.placeholderText}
                searchTextInputStyle={styles.selectDropdownText}
                listItemLabelStyle={styles.selectDropdownText}
              />
            </View>

          </View>

          {/* О себе */}
          <Text style={styles.label}>О себе</Text>
          <BasicTextField
            placeholder=""
            isFocused={isBioFocused}
            value={formData.bio}
            setFunc={(value) => handleInputChange('bio', value)}
            setIsFocusedFunc={setIsBioFocused}
            keyboardType="default"
            multiline={true}
          />

          {/* Я хочу */}
          <Text style={styles.label}>Я хочу</Text>
          <BasicTextField
            placeholder=""
            isFocused={isDesiresFocused}
            value={formData.desires}
            setFunc={(value) => handleInputChange('desires', value)}
            setIsFocusedFunc={setIsDesiresFocused}
            keyboardType="default"
            multiline={true}
          />

          {/* Кнопка сохранения */}
          <BasicButton
            text='Сохранить изменения'
            handleOnPress={handleSubmit}
          />
        </View>
        </ScrollView>
        </KeyboardAvoidingView>

    </View>
    

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151718',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
  },
});
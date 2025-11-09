import { getMyProfile } from '@/api/axiosClient';
import { STORAGE_KEYS } from '@/constants';
import { getData } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as I from '../../../types/api';


export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<I.MyProfile | null>(null);
  const photoCount = userProfile?.photos?.length || 0;
  const router = useRouter();

  // Пример данных пользователя
  const user = {
    name: 'Анна',
    age: 25,
    city: 'Москва',
    bio: 'Люблю путешествия, искусство и интересные беседы. Ищу серьезные отношения.',
    photos: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      'http://127.0.0.1:8000/storage/uploads/user_1/avatar_user_id_1.jpg',
    ],
    stats: {
      likes: 124,
      matches: 23,
      visitors: 456
    }
  };

  useEffect(() => {

    const loadProfile = async () => {
      
      const accessToken = await getData(STORAGE_KEYS.ACCESS_TOKEN);
      console.log('AT', accessToken)
      if (!accessToken || accessToken === 'undefined') {
        Alert.alert('Ошибка', 'accessToken не найден. Пожалуйста, пройдите аутентификацию заново.');
        router.navigate('/');
        return;
      }
  
      try {
        let profile;
        
        // Пробуем загрузить из кэша
        // const cachedProfile = await getData(STORAGE_KEYS.CACHED_PROFILE);
        // if (cachedProfile && cachedProfile !== 'undefined') {
        //   profile = JSON.parse(cachedProfile);
        //   console.log('Loaded from cache');
        // } else {
        //   // Загружаем с сервера
        //   profile = await getMyProfile(accessToken);
        //   await storeData(STORAGE_KEYS.CACHED_PROFILE, JSON.stringify(profile));
        //   await storeData(STORAGE_KEYS.PROFILE_LAST_UPDATE, Date.now().toString());
        //   console.log('Loaded from API');
        // }
        
        profile = await getMyProfile(accessToken);
        setUserProfile(profile);
        console.log('My Profile:', profile);
      
      } catch (error) {
        console.error('Failed to load profile:', error);
      }

    };

    loadProfile();
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Шапка профиля */}
      <View style={styles.header}>
        
        <View style={styles.avatarContainer}>
          {photoCount > 0 ? (
            <View style={styles.avatarWrapper}>
              <Image 
                source={{ uri: userProfile?.avatar }} 
                style={styles.avatar}
              />
            </View>
          ) : (
            <View style={[styles.avatarWrapper, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={40} color="#8e8e93" />
            </View>
          )}
        </View>
    
        {/* <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: user.photos[0] }} 
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarBtn}>
            <Ionicons name="camera" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View> */}
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userProfile?.name}, {userProfile?.age}</Text>
          <View style={styles.location}>
            <Ionicons name="location-outline" size={16} color="#8e8e93" />
            <Text style={styles.locationText}>{userProfile?.city}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => router.push('/profile/edit')}
        >
          <Ionicons name="create-outline" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* Статистика */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.stats.likes}</Text>
          <Text style={styles.statLabel}>Лайков</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.stats.matches}</Text>
          <Text style={styles.statLabel}>Мэтчи</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.stats.visitors}</Text>
          <Text style={styles.statLabel}>Гости</Text>
        </View>
      </View>

      {/* О себе */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>О себе</Text>
        <Text style={styles.bioText}>{user.bio}</Text>
      </View>

      {/* Фотографии */}
      <View style={styles.section}>
        <View style={styles.photosHeader}>
          <Text style={styles.sectionTitle}>Фотографии</Text>
          <TouchableOpacity onPress={() => router.push('/profile/photos')}>
            <Text style={styles.seeAllText}>Все</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
          {userProfile?.photos.map((photo, index) => (
            <TouchableOpacity key={index} style={styles.photoItem}>
              <Image source={{ uri: photo }} style={styles.photo} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addPhotoBtn}>
            <Ionicons name="add" size={32} color="#8e8e93" />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Действия */}
      <View style={styles.actionsSection}>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={24} color="#ffffff" />
          <Text style={styles.actionText}>Мои лайки</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/profile/settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#ffffff" />
          <Text style={styles.actionText}>Настройки</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="star-outline" size={24} color="#ffffff" />
          <Text style={styles.actionText}>Премиум</Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151718',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007bff',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#151718',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#8e8e93',
    marginLeft: 4,
  },
  editButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1c1d1e',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#8e8e93',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#333333',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    color: '#cccccc',
    lineHeight: 22,
  },
  photosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    color: '#007bff',
    fontSize: 14,
  },
  photosScroll: {
    flexDirection: 'row',
  },
  photoItem: {
    marginRight: 12,
  },
  photo: {
    width: 100,
    height: 120,
    borderRadius: 12,
  },
  addPhotoBtn: {
    width: 100,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333333',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1d1e',
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1d1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 12,
  },
  avatarWrapper: {
    width: 100,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007bff',
    overflow: 'hidden',
  },
  avatarPlaceholder: {
    backgroundColor: '#1c1d1e',
    justifyContent: 'center',
    alignItems: 'center',
  },

});
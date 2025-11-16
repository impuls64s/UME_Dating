import { getUserProfile, uploadPhotos } from '@/api/axiosClient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Link, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as I from '../../../types/api';


export default function ProfileScreen () {
  const [userProfile, setUserProfile] = useState<I.UserProfile>();
  const photoCount = userProfile?.photos?.length || 0;
  const currentPhotos = userProfile?.photos || [];
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        const profile = await getUserProfile();
        if (profile) setUserProfile(profile);
      };
  
      console.log('FOCUS REFRESH');
      loadProfile();
    }, [])
  );

  const handleAddPhoto = async () => {
    try {
      // Запрашиваем разрешения
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Нужно разрешение для доступа к фото');
        return;
      }

      // Открываем галерею
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 5,
      });

      if (!result.canceled && result.assets) {
        // Здесь обрабатываем выбранные фото
        const newPhotos = result.assets.map(asset => asset.uri);
        console.log('newPhotos', newPhotos)
        // Отправляем на сервер (пример)
        if (userProfile) {
          const response = await uploadPhotos(newPhotos, userProfile.id);
          console.log('Response =>', response)
        }

        // Обновляем UI
        // setUserProfile(prev => prev ? {
        //   ...prev,
        //   photos: [...prev.photos, ...newPhotos]
        // } : null);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать фото');
    }
  };

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const openPhoto = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closePhoto = () => {
    setSelectedPhotoIndex(null);
  };


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
                contentFit="cover"
              />
            </View>
          ) : (
            <View style={[styles.avatarWrapper, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={40} color="#8e8e93" />
            </View>
          )}
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userProfile?.name}, {userProfile?.age}</Text>
          <View style={styles.location}>
            <Ionicons name="location-outline" size={16} color="#8e8e93" />
            <Text style={styles.locationText}>{userProfile?.city}</Text>
          </View>
        </View>

        <Link href="/profile/edit">
          <Ionicons name="create-outline" size={24} color="#007bff" />
        </Link>

      </View>

      {/* Статистика */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>💎 1000</Text>
          <Text style={styles.statLabel}>Рейтинг</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>🤍 124</Text>
          <Text style={styles.statLabel}>Лайков</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>❤️ 64</Text>
          <Text style={styles.statLabel}>Мэтчи</Text>
        </View>
      </View>

      {/* О себе */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>О себе</Text>
        <Text style={[
          styles.bioText,
          !userProfile?.bio && styles.placeholderText
        ]}>
          {userProfile?.bio || "Не заполнено"}
        </Text>
      </View>

      {/* Я хочу */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Я хочу</Text>
        <Text style={[
          styles.bioText,
          !userProfile?.desires && styles.placeholderText
        ]}>
          {userProfile?.desires || "Не заполнено"}
        </Text>
      </View>

      {/* Фотографии */}
      <View style={styles.section}>
        <View style={styles.photosHeader}>
          <Text style={styles.sectionTitle}>Фотографии</Text>
          <TouchableOpacity onPress={() => router.push('/profile/photos')}>
            <Text style={styles.seeAllText}>Все</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={Platform.OS === 'web'}
          data={userProfile?.photos || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={styles.photoItem} onPress={() => openPhoto(index)}>
              <Image source={{ uri: item }} style={styles.photo} />
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <TouchableOpacity style={styles.addPhotoBtn} onPress={handleAddPhoto}>
              <Ionicons name="add" size={32} color="#8e8e93" />
            </TouchableOpacity>
          }
          style={styles.photosScroll}
        />

        {/* Модальное окно для просмотра фото с жестами */}
        <Modal
          visible={selectedPhotoIndex !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={closePhoto}
        >
          <View style={styles.modalOverlay}>
            {/* Header с счетчиком и кнопкой закрытия */}
            <View style={styles.viewerHeader}>
              <Text style={styles.viewerCounter}>
                {(selectedPhotoIndex ?? 0) + 1} / {currentPhotos.length}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={closePhoto}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Основное изображение с поддержкой жестов */}
            {selectedPhotoIndex !== null && (
              <Image
                source={{ uri: currentPhotos[selectedPhotoIndex] }}
                style={styles.fullSizePhoto}
                contentFit="contain"
                enableLiveTextInteraction={true}
                accessibilityLabel={`Фото ${selectedPhotoIndex + 1} из ${currentPhotos.length}`}
                transition={200}
              />
            )}

            {/* Кнопки навигации */}
            <View style={styles.navigationContainer}>
              <TouchableOpacity 
                style={[
                  styles.navButton,
                  selectedPhotoIndex === 0 && styles.navButtonDisabled
                ]}
                onPress={() => setSelectedPhotoIndex(prev => Math.max(0, (prev || 0) - 1))}
                disabled={selectedPhotoIndex === 0}
              >
                <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.navButton,
                  selectedPhotoIndex === currentPhotos.length - 1 && styles.navButtonDisabled
                ]}
                onPress={() => setSelectedPhotoIndex(prev => Math.min(currentPhotos.length - 1, (prev || 0) + 1))}
                disabled={selectedPhotoIndex === currentPhotos.length - 1}
              >
                <Ionicons name="chevron-forward" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        

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
    paddingTop: 80,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
    // resizeMode: 'cover',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#8e8e93',
    marginLeft: 4,
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
    width: 150,
    height: 200,
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
  placeholderText: {
    fontStyle: 'italic',
    opacity: 0.6,
    color: '#cccccc',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullSizePhoto: {
    width: '90%',
    height: '80%',
  },
  viewerHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  viewerCounter: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  navButton: {
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
});
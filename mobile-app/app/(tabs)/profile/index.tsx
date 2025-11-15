import { getUserProfile } from '@/utils/common';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as I from '../../../types/api';


export default function ProfileScreen () {
  const [userProfile, setUserProfile] = useState<I.UserProfile | null>(null);
  const photoCount = userProfile?.photos?.length || 0;
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await getUserProfile();
      if (profile) {
        setUserProfile(profile);
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
  placeholderText: {
    fontStyle: 'italic',
    opacity: 0.6,
    color: '#cccccc',
  },

});
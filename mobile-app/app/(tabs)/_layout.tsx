import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarStyle: {
          backgroundColor: '#151718',  // ← Измени на темный цвет
          borderTopColor: '#333333',   // ← Темный цвет границы
        },
        headerStyle: {
          backgroundColor: '#151718',
        },
        headerTintColor: '#ffffff',
        headerShown: false,
      }}
    >
      {/* 1. Лента */}
      <Tabs.Screen 
        name="feed/index" 
        
        options={{
          title: 'Лента',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 2. Анкеты */}
      {/* <Tabs.Screen 
        name="profiles" 
        options={{
          title: 'Анкеты',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      /> */}

      {/* 3. Лайки */}
      {/* <Tabs.Screen 
        name="likes" 
        options={{
          title: 'Лайки',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      /> */}

      {/* 4. Сообщения */}
      {/* <Tabs.Screen 
        name="messages" 
        options={{
          title: 'Сообщения',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      /> */}

      {/* 5. Профиль */}
      <Tabs.Screen 
        name="profile/index" 
        options={{
          title: 'Профиль',
          // headerStyle: { backgroundColor: '#151718' },
          // headerTintColor: '#ffffff',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
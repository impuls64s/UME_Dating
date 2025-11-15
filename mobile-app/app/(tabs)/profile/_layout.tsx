import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false // Скрываем заголовки по умолчанию
      }}
    >
      {/* <Stack.Screen name="index" /> */}
      <Stack.Screen 
        name="edit" 
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="photos" 
        options={{
          headerShown: true,
          headerTitle: 'Фотографии', 
          headerStyle: { backgroundColor: '#151718' },
          headerTintColor: '#ffffff'
        }}
      />
    </Stack>
  );
}
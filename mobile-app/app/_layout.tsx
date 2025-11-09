import { Stack } from 'expo-router';


export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false // ← Скрыть заголовки глобально
      }}
    >

      <Stack.Screen name="index" options={{ headerShown: false , title: 'Вход'}} />
      <Stack.Screen name="registration" options={{ 
        headerShown: true,
        title: 'Регистрация',
        headerStyle: { backgroundColor: '#151718' },
        headerTintColor: '#ffffff',
      }} />
      <Stack.Screen name="verification" options={{ 
        headerShown: true,
        title: 'Верификация',
        headerStyle: { backgroundColor: '#151718' },
        headerTintColor: '#ffffff',
        headerBackTitle: 'Назад',
      }} />
      <Stack.Screen name="pending" options={{ 
        headerShown: true,
        title: 'Проверка профиля',
        headerStyle: { backgroundColor: '#151718' },
        headerTintColor: '#ffffff',
        headerBackTitle: 'Назад',
      }} />
      <Stack.Screen name="(tabs)" />

    </Stack>
  );
}
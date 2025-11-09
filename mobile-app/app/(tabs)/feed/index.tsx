// app/_(tabs)/index.tsx
import { StyleSheet, Text, View } from 'react-native';

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Лента</Text>
      <Text style={styles.subtitle}>Новые пользователи и события</Text>
      {/* Здесь будет список новостей и пользователей */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
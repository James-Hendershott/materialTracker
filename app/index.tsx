import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Material Tracker</Text>
      <Link style={styles.link} href="/add">Add Material</Link>
      <Link style={styles.link} href="/search">Search</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', gap: 16 },
  title: { fontSize: 24, fontWeight: '600' },
  link: { fontSize: 18, color: '#0366d6' }
});

import * as React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { getAllMaterials } from '../src/storage/db';
import { searchByColor } from '../src/utils/colors';
import { Material } from '../src/types';

export default function SearchScreen() {
  const router = useRouter();
  const [allMaterials, setAllMaterials] = React.useState<Material[]>([]);
  const [filtered, setFiltered] = React.useState<Material[]>([]);
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    async function loadMaterials() {
      const list = await getAllMaterials();
      setAllMaterials(list);
      setFiltered(list);
    }
    loadMaterials();
  }, []);

  React.useEffect(() => {
    if (!query.trim()) {
      setFiltered(allMaterials);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const results = allMaterials.filter((m) => {
      if (m.name.toLowerCase().includes(lowerQuery)) return true;
      if (m.location.toLowerCase().includes(lowerQuery)) return true;
      return false;
    });
    const colorResults = searchByColor(allMaterials, lowerQuery);
    const combined = [...results, ...colorResults].filter((v, i, arr) => arr.findIndex((t) => t.id === v.id) === i);
    setFiltered(combined);
  }, [query, allMaterials]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search Materials</Text>
      <TextInput
        placeholder="e.g., green, wool, bin A..."
        value={query}
        onChangeText={setQuery}
        style={styles.searchInput}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/detail', params: { id: item.id } })}
          >
            <Image source={{ uri: item.imageUri }} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.location}>{item.location || 'No location'}</Text>
              <View style={{ flexDirection: 'row', marginTop: 4, gap: 4 }}>
                {item.colors.slice(0, 5).map((c, i) => (
                  <View key={i} style={{ width: 20, height: 20, backgroundColor: c.hex, borderRadius: 4 }} />
                ))}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  searchInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
  card: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: 8, backgroundColor: '#f9f9f9', marginBottom: 8 },
  thumb: { width: 80, height: 80, borderRadius: 6 },
  name: { fontSize: 16, fontWeight: '600' },
  location: { fontSize: 12, color: '#666' }
});

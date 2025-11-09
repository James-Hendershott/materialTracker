import * as React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  RefreshControl,
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { getAllMaterials } from '../src/storage/db';
import { searchByColor } from '../src/utils/colors';
import { Material } from '../src/types';

export default function SearchScreen() {
  const router = useRouter();
  const [allMaterials, setAllMaterials] = React.useState<Material[]>([]);
  const [filtered, setFiltered] = React.useState<Material[]>([]);
  const [query, setQuery] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const loadMaterials = React.useCallback(async () => {
    try {
      const list = await getAllMaterials();
      setAllMaterials(list);
      setFiltered(list);
    } catch (error) {
      console.error('Failed to load materials:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadMaterials();
  }, [loadMaterials]);

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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0366d6" />
        <Text style={styles.loadingText}>Loading materials...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.header}>Search Materials</Text>
        <Text style={styles.resultCount}>
          {filtered.length} of {allMaterials.length} materials
        </Text>
      </View>
      <TextInput
        placeholder="Search by name, location, or color..."
        value={query}
        onChangeText={setQuery}
        style={styles.searchInput}
        clearButtonMode="while-editing"
        returnKeyType="search"
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/detail', params: { id: item.id } })}
          >
            <Image source={{ uri: item.imageUri }} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.location}>{item.location || 'No location'}</Text>
              {item.colors && item.colors.length > 0 ? (
                <View style={{ marginTop: 6 }}>
                  <View style={{ flexDirection: 'row', gap: 4, marginBottom: 4 }}>
                    {item.colors.slice(0, 5).map((c, i) => (
                      <View 
                        key={i} 
                        style={{ 
                          width: 24, 
                          height: 24, 
                          backgroundColor: c.hex, 
                          borderRadius: 4,
                          borderWidth: 1,
                          borderColor: '#ddd'
                        }} 
                      />
                    ))}
                  </View>
                  <Text style={styles.colorText}>
                    {item.colors.slice(0, 3).map(c => c.percent !== undefined ? `${c.name} ${c.percent}%` : c.name).join(', ')}
                  </Text>
                </View>
              ) : (
                <Text style={styles.colorText}>No colors extracted</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5', 
    padding: 16 
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  header: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: '#333',
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  searchInput: { 
    backgroundColor: '#fff',
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: { 
    flexDirection: 'row', 
    gap: 12, 
    padding: 16, 
    borderRadius: 12, 
    backgroundColor: '#fff', 
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  thumb: { 
    width: 80, 
    height: 80, 
    borderRadius: 8 
  },
  name: { 
    fontSize: 18, 
    fontWeight: '600',
    color: '#333',
  },
  location: { 
    fontSize: 14, 
    color: '#666',
    marginTop: 2,
  },
  colorText: { 
    fontSize: 12, 
    color: '#888', 
    marginTop: 4 
  }
});

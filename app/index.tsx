import * as React from 'react';
import { useRouter } from 'expo-router';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  RefreshControl,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { getAllMaterials, deleteMaterial } from '../src/storage/db';
import { Material } from '../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const [materials, setMaterials] = React.useState<Material[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const loadMaterials = React.useCallback(async () => {
    try {
      const list = await getAllMaterials();
      setMaterials(list);
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

  const handleDelete = async (id: string) => {
    try {
      await deleteMaterial(id);
      setMaterials(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Failed to delete material:', error);
    }
  };

  const renderGridItem = ({ item }: { item: Material }) => (
    <TouchableOpacity
      style={styles.gridCard}
      onPress={() => router.push({ pathname: '/detail', params: { id: item.id } })}
    >
      <Image source={{ uri: item.imageUri }} style={styles.gridImage} />
      <View style={styles.gridInfo}>
        <Text style={styles.gridName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.gridLocation} numberOfLines={1}>{item.location || 'No location'}</Text>
        <View style={{ flexDirection: 'row', gap: 3, marginTop: 4 }}>
            {item.colors?.slice(0, 3).map((c, i) => (
              <View key={i} style={{ alignItems: 'center' }}>
                <View style={[styles.colorChip, { backgroundColor: c.hex }]} />
                {c.percent !== undefined ? (
                  <Text style={styles.colorPercent}>{c.percent}%</Text>
                ) : null}
              </View>
            ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderListItem = ({ item }: { item: Material }) => (
    <TouchableOpacity
      style={styles.listCard}
      onPress={() => router.push({ pathname: '/detail', params: { id: item.id } })}
    >
      <Image source={{ uri: item.imageUri }} style={styles.listImage} />
      <View style={styles.listInfo}>
        <Text style={styles.listName}>{item.name}</Text>
        <Text style={styles.listLocation}>{item.location || 'No location'}</Text>
        <View style={{ flexDirection: 'row', gap: 4, marginTop: 6 }}>
          {item.colors?.slice(0, 5).map((c, i) => (
            <View 
              key={i} 
              style={{ 
                width: 20, 
                height: 20, 
                backgroundColor: c.hex, 
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#ddd'
              }} 
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

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
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Materials</Text>
          <Text style={styles.subtitle}>{materials.length} items</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.viewToggle}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <Text style={styles.viewToggleText}>{viewMode === 'grid' ? '☰' : '⊞'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/add')}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {materials.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No materials yet</Text>
          <Text style={styles.emptyText}>Tap the "+ Add" button to add your first material!</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/add')}
          >
            <Text style={styles.emptyButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={materials}
          keyExtractor={(item) => item.id}
          renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
          key={viewMode} // Force re-render on view mode change
          numColumns={viewMode === 'grid' ? 2 : 1}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <TouchableOpacity
        style={styles.searchFab}
        onPress={() => router.push('/search')}
      >
        <Text style={styles.searchFabText}>🔍</Text>
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get('window');
const gridItemWidth = (width - 48) / 2;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    color: '#222'
  },
  colorChip: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  colorPercent: {
    fontSize: 10,
    color: '#555',
    marginTop: 2,
    lineHeight: 12
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222'
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8
  },
  viewToggle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8
  },
  viewToggleText: {
    fontSize: 18
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0366d6',
    borderRadius: 8
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600'
  },
  listContent: {
    padding: 16,
    paddingBottom: 80
  },
  // Grid styles
  gridCard: {
    width: gridItemWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  gridImage: {
    width: '100%',
    height: gridItemWidth,
    backgroundColor: '#f0f0f0'
  },
  gridInfo: {
    padding: 12
  },
  gridName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2
  },
  gridLocation: {
    fontSize: 12,
    color: '#666'
  },
  // List styles
  listCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  listImage: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0'
  },
  listInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center'
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4
  },
  listLocation: {
    fontSize: 13,
    color: '#666'
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#0366d6',
    borderRadius: 8
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  // Floating action button
  searchFab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0366d6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  searchFabText: {
    fontSize: 24
  }
});

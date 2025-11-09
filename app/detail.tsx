import * as React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getMaterialById, deleteMaterial } from '../src/storage/db';
import { Material } from '../src/types';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [material, setMaterial] = React.useState<Material | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    async function loadMaterial() {
      if (id) {
        try {
          const mat = await getMaterialById(id);
          setMaterial(mat);
        } catch (error) {
          console.error('Failed to load material:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadMaterial();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Material',
      'Are you sure you want to delete this material? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            setDeleting(true);
            try {
              await deleteMaterial(id);
              router.back();
            } catch (error) {
              console.error('Failed to delete:', error);
              Alert.alert('Error', 'Failed to delete material');
              setDeleting(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0366d6" />
      </View>
    );
  }

  if (!material) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Material not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Image source={{ uri: material.imageUri }} style={styles.image} />
        
        <View style={styles.section}>
          <Text style={styles.name}>{material.name}</Text>
          <Text style={styles.location}>📍 {material.location || 'No location set'}</Text>
        </View>

        {material.colors && material.colors.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Colors Detected</Text>
            <View style={styles.colorsContainer}>
              {material.colors.map((c, i) => (
                <View key={i} style={styles.colorChip}>
                  <View 
                    style={{ 
                      width: 40, 
                      height: 40, 
                      backgroundColor: c.hex, 
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#ddd'
                    }} 
                  />
                  <Text style={styles.colorName}>{c.name || 'Unknown'}</Text>
                  <Text style={styles.colorHex}>{c.hex}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {material.notes ? (
          <View style={styles.section}>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.notes}>{material.notes}</Text>
          </View>
        ) : null}

        <View style={styles.metadata}>
          <Text style={styles.metaText}>
            Added: {new Date(material.createdAt).toLocaleDateString()}
          </Text>
          {material.updatedAt !== material.createdAt && (
            <Text style={styles.metaText}>
              Updated: {new Date(material.updatedAt).toLocaleDateString()}
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
          disabled={deleting}
        >
          <Text style={styles.deleteButtonText}>
            {deleting ? 'Deleting...' : '🗑️ Delete'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.backButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 24
  },
  scrollView: {
    flex: 1
  },
  content: {
    paddingBottom: 100
  },
  image: { 
    width: '100%', 
    height: 300, 
    backgroundColor: '#f0f0f0' 
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 1
  },
  name: { 
    fontSize: 26, 
    fontWeight: '700', 
    color: '#222',
    marginBottom: 8 
  },
  location: { 
    fontSize: 15, 
    color: '#666' 
  },
  label: { 
    fontSize: 17, 
    fontWeight: '600', 
    color: '#222',
    marginBottom: 12 
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },
  colorChip: { 
    alignItems: 'center', 
    gap: 6 
  },
  colorName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#444'
  },
  colorHex: {
    fontSize: 10,
    color: '#888',
    fontFamily: 'monospace'
  },
  notes: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444'
  },
  metadata: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 1,
    gap: 4
  },
  metaText: {
    fontSize: 12,
    color: '#999'
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteButton: {
    backgroundColor: '#ff3b30'
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  backButton: {
    backgroundColor: '#f0f0f0'
  },
  backButtonText: {
    color: '#222',
    fontSize: 16,
    fontWeight: '600'
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24
  }
});

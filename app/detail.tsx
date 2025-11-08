import * as React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getMaterialById } from '../src/storage/db';
import { Material } from '../src/types';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [material, setMaterial] = React.useState<Material | null>(null);

  React.useEffect(() => {
    if (id) {
      const mat = getMaterialById(id);
      setMaterial(mat);
    }
  }, [id]);

  if (!material) {
    return (
      <View style={styles.container}>
        <Text>Material not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: material.imageUri }} style={styles.image} />
      <Text style={styles.name}>{material.name}</Text>
      <Text style={styles.location}>Location: {material.location || 'N/A'}</Text>
      <Text style={styles.label}>Colors Detected:</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        {material.colors.map((c, i) => (
          <View key={i} style={styles.colorChip}>
            <View style={{ width: 32, height: 32, backgroundColor: c.hex, borderRadius: 4 }} />
            <Text style={{ fontSize: 10 }}>{c.name || c.hex}</Text>
          </View>
        ))}
      </View>
      {material.notes ? (
        <>
          <Text style={styles.label}>Notes:</Text>
          <Text>{material.notes}</Text>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  image: { width: '100%', height: 250, borderRadius: 8, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  location: { fontSize: 14, color: '#666', marginBottom: 8 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  colorChip: { alignItems: 'center', gap: 4 }
});

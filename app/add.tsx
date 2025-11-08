import * as React from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { saveMaterial, uploadImage } from '../src/storage/db';
import { extractPaletteWeb, toBuckets } from '../src/utils/colors';
import { v4 as uuidv4 } from 'uuid';
import { ColorRGB } from '../src/types';

export default function AddMaterialScreen() {
  const router = useRouter();
  const [image, setImage] = React.useState<string | null>(null);
  const [name, setName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  async function pickImage() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is needed to take photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  async function chooseFromLibrary() {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  async function onSave() {
    if (!name || !image) {
      Alert.alert('Missing info', 'Please add a name and an image.');
      return;
    }
    setSaving(true);
    try {
      const id = uuidv4();
      
      // Upload image to server (or keep local URI as fallback)
      const uploadedImageUri = await uploadImage(image);
      
      let colors: ColorRGB[] = [];
      if (Platform.OS === 'web' && image) {
        try {
          const palette = await extractPaletteWeb(image, 5);
          colors = palette.map((c: ColorRGB) => ({ ...c, name: toBuckets([c])[0].name }));
        } catch (e) {
          console.warn('Palette extraction failed on web', e);
        }
      }
      await saveMaterial({ 
        id, 
        name, 
        location, 
        imageUri: uploadedImageUri, 
        colors, 
        notes, 
        createdAt: Date.now(), 
        updatedAt: Date.now() 
      });
      router.replace('/');
    } catch (e) {
      console.error(e);
      Alert.alert('Save failed', 'There was a problem saving your material.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Material</Text>
      <View style={{ gap: 8, width: '90%', maxWidth: 480 }}>
        <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Location (e.g., Bin A3)" value={location} onChangeText={setLocation} style={styles.input} />
        <TextInput placeholder="Notes" value={notes} onChangeText={setNotes} style={[styles.input, { height: 80 }]} multiline />
        {image ? <Image source={{ uri: image }} style={{ width: '100%', height: 200, borderRadius: 8 }} /> : null}
        <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'space-between' }}>
          <Button title="Take Photo" onPress={pickImage} />
          <Button title="Choose Image" onPress={chooseFromLibrary} />
        </View>
        <Button title={saving ? 'Saving…' : 'Save'} onPress={onSave} disabled={saving} />
        {Platform.OS !== 'web' && (
          <Text style={styles.hint}>Color extraction will be added on native soon. For now, you can still save and search by name.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 24, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12 },
  hint: { fontSize: 12, color: '#666', marginTop: 8 }
});

import * as React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  Image, 
  StyleSheet, 
  Platform, 
  Alert, 
  KeyboardAvoidingView, 
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { saveMaterial, uploadImage } from '../src/storage/db';
import { extractPalette, toBuckets } from '../src/utils/colors';
import { v4 as uuidv4 } from 'uuid';
import { ColorRGB } from '../src/types';

function normalizePercents(cols: ColorRGB[]): ColorRGB[] {
  const total = cols.reduce((acc, c) => acc + (c.percent || 0), 0);
  if (total === 0) return cols;
  return cols.map(c => ({ ...c, percent: parseFloat((((c.percent || 0) / total) * 100).toFixed(1)) }));
}

export default function AddMaterialScreen() {
  const router = useRouter();
  const [image, setImage] = React.useState<string | null>(null);
  const [confirmedCrop, setConfirmedCrop] = React.useState(false);
  const [recropPromptOpen, setRecropPromptOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [colors, setColors] = React.useState<ColorRGB[] | null>(null);
  const [showEditColors, setShowEditColors] = React.useState(false);

  async function pickImage() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is needed to take photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ 
      quality: 0.7,
      allowsEditing: true, // enable cropping UI after capture
      aspect: undefined // freeform crop
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setConfirmedCrop(false);
      // Pre-extract palette for editing
      try {
        const palette = await extractPalette(result.assets[0].uri, 5);
        setColors(palette);
      } catch (e) {
        console.warn('Pre-extract palette failed', e);
      }
    }
  }

  async function chooseFromLibrary() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Photo library permission is needed to choose images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ 
      quality: 0.7,
      allowsEditing: true, // enable cropping UI before selecting
      aspect: undefined // freeform crop
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setConfirmedCrop(false);
      // Pre-extract palette for editing
      try {
        const palette = await extractPalette(result.assets[0].uri, 5);
        setColors(palette);
      } catch (e) {
        console.warn('Pre-extract palette failed', e);
      }
    }
  }

  async function onSave() {
    if (!name || !image) {
      Alert.alert('Missing info', 'Please add a name and an image.');
      return;
    }
    if (!confirmedCrop) {
      Alert.alert('Crop Required', 'Please confirm the crop to ensure the image only shows the material (no background).');
      return;
    }
    setSaving(true);
    try {
      const id = uuidv4();
      
      // Upload image to server (or keep local URI as fallback)
      const uploadedImageUri = await uploadImage(image);
      
      // Use edited colors if available; else extract on save
      let finalColors: ColorRGB[] = [];
      if (colors && colors.length) {
        finalColors = normalizePercents(colors).map((c: ColorRGB) => ({ ...c, name: toBuckets([c])[0].name }));
      } else if (image) {
        try {
          const palette = await extractPalette(image, 5);
          finalColors = palette.map((c: ColorRGB) => ({ ...c, name: toBuckets([c])[0].name }));
        } catch (e) {
          console.warn('Palette extraction failed', e);
        }
      }
      await saveMaterial({ 
        id, 
        name, 
        location, 
        imageUri: uploadedImageUri, 
        colors: finalColors, 
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Text style={styles.header}>Add Material</Text>
            <View style={{ gap: 8, width: '90%', maxWidth: 480 }}>
              <TextInput 
                placeholder="Name" 
                value={name} 
                onChangeText={setName} 
                style={styles.input}
                returnKeyType="next"
              />
              <TextInput 
                placeholder="Location (e.g., Bin A3)" 
                value={location} 
                onChangeText={setLocation} 
                style={styles.input}
                returnKeyType="next"
              />
              <TextInput 
                placeholder="Notes" 
                value={notes} 
                onChangeText={setNotes} 
                style={[styles.input, { height: 80 }]} 
                multiline
                returnKeyType="done"
                blurOnSubmit={true}
              />
              {image ? (
                <View style={{ width: '100%', alignItems: 'center', gap: 8 }}>
                  <Image source={{ uri: image }} style={{ width: '100%', height: 220, borderRadius: 10 }} />
                  {!confirmedCrop && (
                    <Text style={styles.cropWarning}>Crop not confirmed yet. Make sure the image shows ONLY the material.</Text>
                  )}
                  {confirmedCrop && (
                    <Text style={styles.cropConfirmed}>✅ Crop confirmed</Text>
                  )}
                  {!confirmedCrop && (
                    <Button title="Confirm Crop" onPress={() => setConfirmedCrop(true)} />
                  )}
                  {!confirmedCrop && (
                    <Button title="Re-Crop" onPress={() => setRecropPromptOpen(true)} />
                  )}
                  {colors && colors.length > 0 && (
                    <Button title="Edit Colors" onPress={() => setShowEditColors(true)} />
                  )}
                </View>
              ) : null}
              <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'space-between' }}>
                <Button title="Take Photo" onPress={pickImage} />
                <Button title="Choose Image" onPress={chooseFromLibrary} />
              </View>
              <Button title={saving ? 'Saving…' : 'Save'} onPress={onSave} disabled={saving} />
              <Text style={styles.hint}>
                {Platform.OS === 'web' 
                  ? 'Colors are automatically extracted from your image.'
                  : 'After confirming crop, colors will be extracted automatically when you save!'}
              </Text>
              <Text style={styles.cropGuidance}>Make sure your photo is tightly cropped to ONLY the material for accurate color percentages.</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      {showEditColors && (
        <View style={styles.editOverlay}>
          <View style={styles.editSheet}>
            <Text style={styles.editTitle}>Edit Colors</Text>
            <ScrollView style={{ maxHeight: 320 }}>
              {(colors || []).map((c, idx) => (
                <View key={idx} style={styles.editRow}>
                  <View style={[styles.editSwatch, { backgroundColor: c.hex }]} />
                  <TextInput
                    value={c.hex}
                    onChangeText={(val) => {
                      setColors((prev) => {
                        if (!prev) return prev;
                        const next = [...prev];
                        next[idx] = { ...next[idx], hex: val } as ColorRGB;
                        return next;
                      });
                    }}
                    style={styles.editHex}
                    placeholder="#RRGGBB"
                    autoCapitalize="none"
                  />
                  <TextInput
                    value={String(c.percent ?? 0)}
                    onChangeText={(val) => {
                      const num = parseFloat(val) || 0;
                      setColors((prev) => {
                        if (!prev) return prev;
                        const next = [...prev];
                        next[idx] = { ...next[idx], percent: num } as ColorRGB;
                        return next;
                      });
                    }}
                    style={styles.editPercent}
                    keyboardType="numeric"
                    placeholder="%"
                  />
                </View>
              ))}
            </ScrollView>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <Button title="Normalize" onPress={() => colors && setColors(normalizePercents(colors))} />
              <Button title="Done" onPress={() => setShowEditColors(false)} />
            </View>
          </View>
        </View>
      )}
      {recropPromptOpen && (
        <View style={styles.editOverlay}>
          <View style={styles.editSheet}>
            <Text style={styles.editTitle}>Re-crop Image</Text>
            <Text style={{ marginBottom: 12 }}>Choose how you'd like to re-crop the image.</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button title="Retake Photo" onPress={async () => { setRecropPromptOpen(false); await pickImage(); }} />
              <Button title="Choose From Library" onPress={async () => { setRecropPromptOpen(false); await chooseFromLibrary(); }} />
            </View>
            <View style={{ marginTop: 8 }}>
              <Button title="Cancel" onPress={() => setRecropPromptOpen(false)} />
            </View>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 24,
    paddingBottom: 40,
  },
  inner: {
    alignItems: 'center',
    width: '100%',
  },
  header: { 
    fontSize: 22, 
    fontWeight: '700', 
    marginBottom: 12 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 12,
    backgroundColor: '#fff',
  },
  hint: { 
    fontSize: 12, 
    color: '#666', 
    marginTop: 8 
  },
  cropWarning: {
    fontSize: 12,
    color: '#b45309',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6
  },
  cropConfirmed: {
    fontSize: 12,
    color: '#065f46',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6
  },
  cropGuidance: {
    marginTop: 8,
    fontSize: 12,
    color: '#555'
  },
  editOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  editSheet: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16
  },
  editTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  editSwatch: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  editHex: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8
  },
  editPercent: {
    width: 64,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    textAlign: 'right'
  }
});

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

export default function AddMaterialScreen() {
  const router = useRouter();
  const [image, setImage] = React.useState<string | null>(null);
  const [confirmedCrop, setConfirmedCrop] = React.useState(false);
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
    const result = await ImagePicker.launchCameraAsync({ 
      quality: 0.7,
      allowsEditing: true, // enable cropping UI after capture
      aspect: undefined // freeform crop
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setConfirmedCrop(false);
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
      
      // Extract color palette (works on both web and native now!)
      let colors: ColorRGB[] = [];
      if (image) {
        try {
          const palette = await extractPalette(image, 5);
          colors = palette.map((c: ColorRGB) => ({ ...c, name: toBuckets([c])[0].name }));
          console.log(`✓ Extracted ${colors.length} colors:`, colors.map(c => c.name).join(', '));
        } catch (e) {
          console.warn('Palette extraction failed', e);
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
  }
});

import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

/**
 * Seleccionar imagen de la galería
 */
export const pickImageFromGallery = async (): Promise<string | null> => {
  try {
    // Pedir permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Se necesita permiso para acceder a la galería');
      return null;
    }

    // Abrir galería
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3, // Comprimir agresivamente para reducir tamaño del payload
    });

    if (result.canceled) {
      return null;
    }

    // Convertir a base64
    const uri = result.assets[0].uri;
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Detectar tipo de imagen
    const imageType = uri.split('.').pop()?.toLowerCase() || 'jpeg';
    const mimeType = imageType === 'png' ? 'png' : 'jpeg';
    
    return `data:image/${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Error seleccionando imagen:', error);
    return null;
  }
};

/**
 * Tomar foto con la cámara
 */
export const takePhoto = async (): Promise<string | null> => {
  try {
    // Pedir permisos
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Se necesita permiso para usar la cámara');
      return null;
    }

    // Abrir cámara
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3, // Comprimir agresivamente para reducir tamaño del payload
    });

    if (result.canceled) {
      return null;
    }

    // Convertir a base64
    const uri = result.assets[0].uri;
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Error tomando foto:', error);
    return null;
  }
};

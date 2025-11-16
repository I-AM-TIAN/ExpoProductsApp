import { updateProfileImage } from '@/core/auth/actions/profile-actions';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';

interface UseProfileImagePickerProps {
  onSuccess?: () => void;
}

export const useProfileImagePicker = (props?: UseProfileImagePickerProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const updateUser = useAuthStore((state) => state.updateUser);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Necesitamos acceso a tu galería para cambiar tu foto de perfil.',
        [{ text: 'OK' }]
      );
      return false;
    }
    
    return true;
  };

  const pickImage = async () => {
    try {
      // Solicitar permisos
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      // Abrir selector de imágenes
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      setIsUploading(true);

      // Obtener la URL de la imagen seleccionada
      const imageUrl = result.assets[0].uri;

      // Enviar directamente al backend (el backend maneja el almacenamiento)
      const updatedUser = await updateProfileImage(imageUrl);

      // Actualizar en el store local
      updateUser(updatedUser);

      // Llamar callback de éxito si existe
      props?.onSuccess?.();

      Alert.alert('¡Listo!', 'Tu foto de perfil se actualizó correctamente');
    } catch (error) {
      console.error('Error picking/uploading image:', error);
      Alert.alert(
        'Error',
        'No se pudo actualizar tu foto de perfil. Inténtalo de nuevo.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const takePhoto = async () => {
    try {
      // Solicitar permisos de cámara
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'Necesitamos acceso a tu cámara para tomar una foto.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Abrir cámara
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      setIsUploading(true);

      // Obtener la URL de la foto tomada
      const imageUrl = result.assets[0].uri;

      // Enviar directamente al backend (el backend maneja el almacenamiento)
      const updatedUser = await updateProfileImage(imageUrl);

      // Actualizar en el store local
      updateUser(updatedUser);

      // Llamar callback de éxito si existe
      props?.onSuccess?.();

      Alert.alert('¡Listo!', 'Tu foto de perfil se actualizó correctamente');
    } catch (error) {
      console.error('Error taking/uploading photo:', error);
      Alert.alert(
        'Error',
        'No se pudo actualizar tu foto de perfil. Inténtalo de nuevo.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Cambiar foto de perfil',
      'Elige una opción',
      [
        {
          text: 'Tomar foto',
          onPress: takePhoto,
        },
        {
          text: 'Elegir de galería',
          onPress: pickImage,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return {
    pickImage,
    takePhoto,
    showImagePickerOptions,
    isUploading,
  };
};

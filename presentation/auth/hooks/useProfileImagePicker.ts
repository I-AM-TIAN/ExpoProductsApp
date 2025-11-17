import { updateProfileImage } from '@/core/auth/actions/profile-actions';
import { pickImageFromGallery, takePhoto as takePhotoHelper } from '@/helpers/image-picker.helper';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert } from 'react-native';

interface UseProfileImagePickerProps {
  onSuccess?: () => void;
}

export const useProfileImagePicker = (props?: UseProfileImagePickerProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const updateUser = useAuthStore((state) => state.updateUser);
  const queryClient = useQueryClient();

  const pickImage = async () => {
    try {
      setIsUploading(true);

      // Usar el helper para seleccionar imagen (ya maneja permisos y conversión a base64)
      const base64Image = await pickImageFromGallery();
      
      if (!base64Image) {
        setIsUploading(false);
        return;
      }

      // Subir imagen al backend (que la subirá a ImageKit)
      const updatedUser = await updateProfileImage(base64Image);

      // Actualizar en el store local
      updateUser(updatedUser);

      // Invalidar caché de perfil para que se refresque en toda la app
      await queryClient.invalidateQueries({ queryKey: ['profile'] });

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
      setIsUploading(true);

      // Usar el helper para tomar foto (ya maneja permisos y conversión a base64)
      const base64Image = await takePhotoHelper();
      
      if (!base64Image) {
        setIsUploading(false);
        return;
      }

      // Subir imagen al backend (que la subirá a ImageKit)
      const updatedUser = await updateProfileImage(base64Image);

      // Actualizar en el store local
      updateUser(updatedUser);

      // Invalidar caché de perfil para que se refresque en toda la app
      await queryClient.invalidateQueries({ queryKey: ['profile'] });

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

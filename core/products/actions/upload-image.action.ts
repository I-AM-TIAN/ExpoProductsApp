import { productsApi } from '@/core/api/productsApi';

/**
 * Sube una imagen al backend y retorna la URL
 * @param imageUri - URI local de la imagen
 * @returns URL de la imagen en el servidor
 */
export const uploadProductImageAction = async (
  imageUri: string
): Promise<string> => {
  try {
    const formData = new FormData();
    
    // Extraer extensión del archivo
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    
    formData.append('file', {
      uri: imageUri,
      type: `image/${fileType}`,
      name: `product-${Date.now()}.${fileType}`,
    } as any);

    const { data } = await productsApi.post<{ url: string }>(
      '/products/upload-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return data.url;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al subir la imagen');
  }
};

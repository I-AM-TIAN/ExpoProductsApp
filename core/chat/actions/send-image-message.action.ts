import { productsApi } from "@/core/api/productsApi";

interface SendImageMessageParams {
  conversationId: string;
  imageBase64: string;
}

/**
 * Sube una imagen a ImageKit y envía un mensaje con la URL de la imagen
 */
export const sendImageMessageAction = async ({
  conversationId,
  imageBase64,
}: SendImageMessageParams): Promise<string> => {
  try {
    // Paso 1: Subir imagen a ImageKit
    console.log('📤 Subiendo imagen al servidor...');
    const uploadResponse = await productsApi.post<{ url: string }>(
      "/files/upload",
      { image: imageBase64 }
    );
    
    const imageUrl = uploadResponse.data.url;
    console.log('✅ Imagen subida:', imageUrl);
    
    return imageUrl;
  } catch (error: any) {
    console.error('❌ Error al subir imagen:', error.response?.data || error.message);
    throw new Error("No se pudo enviar la imagen");
  }
};

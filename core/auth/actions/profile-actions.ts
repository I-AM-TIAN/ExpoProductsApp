import { productsApi } from "@/core/api/productsApi";
import { User } from "../interface/user";

export const getProfile = async (): Promise<User> => {
  try {
    const { data } = await productsApi.get<{ user: User }>("/auth/profile");
    return data.user;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching profile");
  }
};

export const updateProfile = async (profileData: Partial<User>): Promise<User> => {
  try {
    const { data } = await productsApi.patch<{ user: User }>("/auth/profile", profileData);
    return data.user;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating profile");
  }
};

export const updateProfileImage = async (base64Image: string): Promise<User> => {
  try {
    console.log('📤 Paso 1: Subiendo imagen a ImageKit...');
    
    // Paso 1: Subir imagen a ImageKit
    const uploadResponse = await productsApi.post<{ url: string }>(
      "/files/upload",
      { image: base64Image }
    );
    
    const imageKitUrl = uploadResponse.data.url;
    console.log('✅ Imagen subida a ImageKit:', imageKitUrl);
    
    console.log('📤 Paso 2: Actualizando perfil con URL...');
    
    // Paso 2: Actualizar perfil con la URL de ImageKit
    const { data } = await productsApi.patch<{ user: User }>(
      "/auth/profile/image", 
      { imageUrl: imageKitUrl }
    );
    
    console.log('✅ Perfil actualizado exitosamente');
    return data.user;
  } catch (error: any) {
    console.error('❌ Error status:', error.response?.status);
    console.error('❌ Error message:', error.response?.data?.message);
    
    if (error.response?.data?.message) {
      const message = Array.isArray(error.response.data.message) 
        ? error.response.data.message.join(', ')
        : error.response.data.message;
      throw new Error(message);
    }
    
    throw new Error("Error updating profile image");
  }
};

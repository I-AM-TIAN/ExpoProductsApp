import { productsApi } from '@/core/api/productsApi';

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  token?: string; // Solo en desarrollo
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Solicita un token de recuperación de contraseña
 * @param email - Email del usuario
 * @returns Respuesta con mensaje de éxito
 */
export const forgotPasswordAction = async (
  email: string
): Promise<ForgotPasswordResponse> => {
  try {
    const { data } = await productsApi.post<ForgotPasswordResponse>(
      '/auth/forgot-password',
      { email }
    );
    return data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al solicitar recuperación de contraseña');
  }
};

/**
 * Restablece la contraseña del usuario
 * @param token - Token de recuperación
 * @param newPassword - Nueva contraseña
 * @param confirmPassword - Confirmación de la nueva contraseña
 * @returns Respuesta con mensaje de éxito
 */
export const resetPasswordAction = async (
  token: string,
  newPassword: string,
  confirmPassword: string
): Promise<ResetPasswordResponse> => {
  try {
    const { data } = await productsApi.post<ResetPasswordResponse>(
      '/auth/reset-password',
      {
        token,
        newPassword,
        confirmPassword,
      }
    );
    return data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al restablecer la contraseña');
  }
};

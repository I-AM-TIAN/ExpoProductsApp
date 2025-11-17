import {
    forgotPasswordAction,
    resetPasswordAction,
} from '@/core/auth/actions/password-recovery-actions';
import { useState } from 'react';

interface PasswordValidation {
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumberOrSpecial: boolean;
  hasMinLength: boolean;
  isValid: boolean;
}

export const usePasswordRecovery = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Valida el formato de email
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Valida los requisitos de la contraseña
   */
  const validatePassword = (password: string): PasswordValidation => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumberOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 6;

    return {
      hasUpperCase,
      hasLowerCase,
      hasNumberOrSpecial,
      hasMinLength,
      isValid: hasUpperCase && hasLowerCase && hasNumberOrSpecial && hasMinLength,
    };
  };

  /**
   * Solicita recuperación de contraseña
   */
  const requestPasswordReset = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      // Validar email
      if (!email.trim()) {
        throw new Error('El correo electrónico es requerido');
      }

      if (!validateEmail(email)) {
        throw new Error('Por favor ingresa un correo electrónico válido');
      }

      const response = await forgotPasswordAction(email);
      setLoading(false);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al solicitar recuperación de contraseña';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  /**
   * Restablece la contraseña
   */
  const resetPassword = async (
    token: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Validaciones
      if (!token.trim()) {
        throw new Error('El token es requerido');
      }

      if (!newPassword.trim()) {
        throw new Error('La nueva contraseña es requerida');
      }

      if (!confirmPassword.trim()) {
        throw new Error('La confirmación de contraseña es requerida');
      }

      // Validar que las contraseñas coincidan
      if (newPassword !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      // Validar requisitos de contraseña
      const passwordValidation = validatePassword(newPassword);

      if (!passwordValidation.hasMinLength) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      if (!passwordValidation.hasUpperCase) {
        throw new Error('La contraseña debe contener al menos una letra mayúscula');
      }

      if (!passwordValidation.hasLowerCase) {
        throw new Error('La contraseña debe contener al menos una letra minúscula');
      }

      if (!passwordValidation.hasNumberOrSpecial) {
        throw new Error('La contraseña debe contener al menos un número o carácter especial');
      }

      const response = await resetPasswordAction(token, newPassword, confirmPassword);
      setLoading(false);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al restablecer la contraseña';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  return {
    loading,
    error,
    requestPasswordReset,
    resetPassword,
    validateEmail,
    validatePassword,
  };
};

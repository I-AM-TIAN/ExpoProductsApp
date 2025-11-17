import { usePasswordRecovery } from "@/presentation/auth/hooks/usePasswordRecovery";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const ResetPasswordScreen = () => {
  const params = useLocalSearchParams<{ token?: string }>();
  const [token, setToken] = useState(params.token || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { loading, resetPassword, validatePassword } = usePasswordRecovery();
  const router = useRouter();

  // Obtener validaciones en tiempo real
  const passwordValidation = validatePassword(newPassword);

  const handleResetPassword = async () => {
    // Validación del token
    if (!token.trim()) {
      Alert.alert("Validación", "El token de recuperación es requerido");
      return;
    }

    // Validación de contraseñas
    if (!newPassword.trim()) {
      Alert.alert("Validación", "La nueva contraseña es requerida");
      return;
    }

    if (!confirmPassword.trim()) {
      Alert.alert("Validación", "Debes confirmar la contraseña");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Validación", "Las contraseñas no coinciden");
      return;
    }

    // Validar requisitos de contraseña
    if (!passwordValidation.isValid) {
      Alert.alert(
        "Contraseña inválida",
        "La contraseña debe cumplir todos los requisitos de seguridad"
      );
      return;
    }

    try {
      const response = await resetPassword(token, newPassword, confirmPassword);
      
      Alert.alert(
        "✅ Contraseña actualizada",
        response.message || "Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.",
        [
          {
            text: "Ir a Login",
            onPress: () => {
              router.replace("/auth/login");
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "No se pudo restablecer la contraseña"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <Text style={styles.title}>Restablecer Contraseña</Text>
        <Text style={styles.subtitle}>
          Ingresa tu token y tu nueva contraseña
        </Text>

        {/* Input de token */}
        <View style={styles.inputContainer}>
          <Ionicons name="key" size={20} color="#9ca3af" />
          <TextInput
            style={styles.input}
            placeholder="Token de recuperación"
            placeholderTextColor="#9ca3af"
            value={token}
            onChangeText={setToken}
            editable={!loading}
            autoCapitalize="none"
          />
        </View>

        {/* Input de nueva contraseña */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#9ca3af" />
          <TextInput
            style={styles.input}
            placeholder="Nueva contraseña"
            placeholderTextColor="#9ca3af"
            secureTextEntry={!showPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            editable={!loading}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#9ca3af"
            />
          </TouchableOpacity>
        </View>

        {/* Input de confirmar contraseña */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#9ca3af" />
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            placeholderTextColor="#9ca3af"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loading}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={20}
              color="#9ca3af"
            />
          </TouchableOpacity>
        </View>

        {/* Validaciones de contraseña */}
        {newPassword.length > 0 && (
          <View style={styles.validationContainer}>
            <Text style={styles.validationTitle}>
              Requisitos de la contraseña:
            </Text>

            <View style={styles.validationItem}>
              <Ionicons
                name={
                  passwordValidation.hasMinLength
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={18}
                color={passwordValidation.hasMinLength ? "#10b981" : "#ef4444"}
              />
              <Text
                style={[
                  styles.validationText,
                  passwordValidation.hasMinLength && styles.validationTextValid,
                ]}
              >
                Mínimo 6 caracteres
              </Text>
            </View>

            <View style={styles.validationItem}>
              <Ionicons
                name={
                  passwordValidation.hasUpperCase
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={18}
                color={passwordValidation.hasUpperCase ? "#10b981" : "#ef4444"}
              />
              <Text
                style={[
                  styles.validationText,
                  passwordValidation.hasUpperCase && styles.validationTextValid,
                ]}
              >
                Al menos 1 letra mayúscula
              </Text>
            </View>

            <View style={styles.validationItem}>
              <Ionicons
                name={
                  passwordValidation.hasLowerCase
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={18}
                color={passwordValidation.hasLowerCase ? "#10b981" : "#ef4444"}
              />
              <Text
                style={[
                  styles.validationText,
                  passwordValidation.hasLowerCase && styles.validationTextValid,
                ]}
              >
                Al menos 1 letra minúscula
              </Text>
            </View>

            <View style={styles.validationItem}>
              <Ionicons
                name={
                  passwordValidation.hasNumberOrSpecial
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={18}
                color={
                  passwordValidation.hasNumberOrSpecial ? "#10b981" : "#ef4444"
                }
              />
              <Text
                style={[
                  styles.validationText,
                  passwordValidation.hasNumberOrSpecial &&
                    styles.validationTextValid,
                ]}
              >
                Al menos 1 número o carácter especial
              </Text>
            </View>

            {/* Verificación de coincidencia de contraseñas */}
            {confirmPassword.length > 0 && (
              <View style={styles.validationItem}>
                <Ionicons
                  name={
                    newPassword === confirmPassword
                      ? "checkmark-circle"
                      : "close-circle"
                  }
                  size={18}
                  color={
                    newPassword === confirmPassword ? "#10b981" : "#ef4444"
                  }
                />
                <Text
                  style={[
                    styles.validationText,
                    newPassword === confirmPassword &&
                      styles.validationTextValid,
                  ]}
                >
                  Las contraseñas coinciden
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Botón restablecer */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Restableciendo..." : "Restablecer Contraseña"}
          </Text>
        </TouchableOpacity>

        {/* Botón volver */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 60,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    marginLeft: 12,
  },
  validationContainer: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  validationTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  validationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  validationText: {
    fontSize: 13,
    color: "#6b7280",
    marginLeft: 8,
  },
  validationTextValid: {
    color: "#059669",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#5D8370",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  backButton: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#6b7280",
    fontWeight: "600",
    fontSize: 14,
  },
});

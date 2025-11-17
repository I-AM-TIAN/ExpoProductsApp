import { usePasswordRecovery } from "@/presentation/auth/hooks/usePasswordRecovery";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

const RecuperarScreen = () => {
  const [email, setEmail] = useState("");
  const { loading, requestPasswordReset, validateEmail } = usePasswordRecovery();
  const router = useRouter();

  const handleSendEmail = async () => {
    if (!email.trim()) {
      Alert.alert("Validación", "Por favor ingresa tu correo electrónico");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Validación", "Por favor ingresa un correo electrónico válido");
      return;
    }

    try {
      const response = await requestPasswordReset(email);
      
      // En desarrollo, si el backend devuelve el token, lo mostramos
      if (response.token) {
        Alert.alert(
          "✅ Correo enviado",
          `${response.message}\n\n🔧 MODO DESARROLLO:\nToken: ${response.token}\n\nUsa este token para restablecer tu contraseña.`,
          [
            {
              text: "Continuar",
              onPress: () => {
                // Navegamos a la pantalla de reset con el token (solo en dev)
                router.push({
                  pathname: "/auth/reset-password" as any,
                  params: { token: response.token },
                });
              },
            },
          ]
        );
      } else {
        // En producción, solo mostramos el mensaje
        Alert.alert(
          "✅ Correo enviado",
          response.message || "Te hemos enviado un correo con instrucciones para recuperar tu contraseña",
          [
            {
              text: "Entendido",
              onPress: () => router.back(),
            },
          ]
        );
      }
      
      setEmail("");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "No se pudo enviar el correo de recuperación"
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
        <Text style={styles.title}>¿Olvidó su contraseña?</Text>

        {/* Input de email */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={20} color="#9ca3af" />
          <TextInput
            style={styles.input}
            placeholder="Ingrese su correo electrónico"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />
        </View>

        {/* Texto informativo */}
        <Text style={styles.infoText}>
          * Te enviaremos un mensaje para que puedas cambiar o recuperar tu
          contraseña
        </Text>

        {/* Botón enviar */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSendEmail}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Enviando..." : "Enviar"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RecuperarScreen;

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
    marginBottom: 25,
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
  infoText: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 32,
    lineHeight: 18,
  },
  button: {
    backgroundColor: "#5D8370",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

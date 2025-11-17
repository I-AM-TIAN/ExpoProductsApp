import { usePasswordRecovery } from "@/presentation/auth/hooks/usePasswordRecovery";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";

const RecuperarScreen = () => {
  const [email, setEmail] = useState("");
  const { loading, requestPasswordReset, validateEmail } =
    usePasswordRecovery();

  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, "background");

  const handleSendEmail = async () => {
    if (!email.trim()) {
      Alert.alert("Validación", "Por favor ingresa tu correo electrónico");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert(
        "Validación",
        "Por favor ingresa un correo electrónico válido"
      );
      return;
    }

    try {
      const response = await requestPasswordReset(email);

      if (response.token) {
        // Modo desarrollo: mostramos token y navegamos con él
        Alert.alert(
          "✅ Correo enviado",
          `${response.message}\n\n🔧 MODO DESARROLLO:\nToken: ${response.token}\n\nUsa este token para restablecer tu contraseña.`,
          [
            {
              text: "Continuar",
              onPress: () => {
                router.push({
                  pathname: "/auth/reset-password" as any,
                  params: { token: response.token },
                });
              },
            },
          ]
        );
      } else {
        // Producción: solo mensaje
        Alert.alert(
          "✅ Correo enviado",
          response.message ||
            "Te hemos enviado un correo con instrucciones para recuperar tu contraseña",
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
        error?.message || "No se pudo enviar el correo de recuperación"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={{ flex: 1, backgroundColor }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: height * 0.12,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <View style={{ marginBottom: 18 }}>
          <ThemedText type="title" style={{ fontSize: 32, lineHeight: 40 }}>
            ¿Olvidó su contraseña?
          </ThemedText>
        </View>

        {/* Campo de correo */}
        <View style={{ gap: 12, marginBottom: 12 }}>
          <ThemedTextInput
            placeholder="Ingrese su correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />
        </View>

        {/* Texto informativo */}
        <View style={{ marginBottom: 20 }}>
          <ThemedText style={{ fontSize: 12, lineHeight: 18 }}>
            * Te enviaremos un mensaje para que puedas cambiar o recuperar tu
            contraseña.
          </ThemedText>
        </View>

        {/* Botón enviar */}
        <ThemedButton onPress={handleSendEmail} disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </ThemedButton>

        {/* Separación */}
        <View style={{ height: 24 }} />

        {/* Link para volver al login (opcional) */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <ThemedText>¿Recordaste tu contraseña?</ThemedText>
          <ThemedLink href="/auth/login" style={{ marginLeft: 6 }}>
            Iniciar sesión
          </ThemedLink>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RecuperarScreen;

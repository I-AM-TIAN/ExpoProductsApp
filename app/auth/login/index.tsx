import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { router } from "expo-router";
import { useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const LoginScreen = () => {
  const { login } = useAuthStore();
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, "background");

  const [form, setForm] = useState({ email: "", password: "" });
  const [isPosting, setIsPosting] = useState(false);

  const onLogin = async () => {
    const { email, password } = form;
    if (!email || !password) return;

    setIsPosting(true);
    const ok = await login(email, password);
    setIsPosting(false);

    if (ok) {
      router.replace("/");
      return;
    }
    Alert.alert("Error", "Revise sus credenciales");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: backgroundColor }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: height * 0.12,
          paddingBottom: 32,
        }}
      >
        {/* Encabezado */}
        <View style={{ marginBottom: 28 }}>
          <ThemedText
            type="title"
            style={{
              fontSize: 36,     // más grande que 32
              lineHeight: 44,   // respirar como en la maqueta
              // fontFamily ya es "KanitBold" en type="title"
            }}
          >
            Bienvenido
          </ThemedText>
        </View>

        {/* Inputs */}
        <View style={{ gap: 14 }}>
          <ThemedTextInput
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="person-outline"
            value={form.email}
            onChangeText={(v) => setForm({ ...form, email: v })}
          />

          <ThemedTextInput
            placeholder="Contraseña"
            secureTextEntry
            icon="lock-closed-outline"
            value={form.password}
            onChangeText={(v) => setForm({ ...form, password: v })}
          />

          {/* Link "Olvidé mi contraseña" alineado a la derecha */}
          <View style={{ alignItems: "flex-end" }}>
            <ThemedLink href="/">Olvidé mi contraseña</ThemedLink>
          </View>
        </View>

        {/* Espacio */}
        <View style={{ height: 20 }} />

        {/* Botón principal (ancho controlado por contenedor) */}
        <View style={{ width: "100%", marginTop: 20 }}>
          <ThemedButton
            icon="log-in-outline"
            onPress={onLogin}
            disabled={isPosting}
          >
            Iniciar sesión
          </ThemedButton>
        </View>
        {/* Registro (opcional) */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 18,
          }}
        >
          <ThemedText>¿Aún no tienes cuenta?</ThemedText>
          <ThemedLink href="/auth/register" style={{ marginTop: 2, marginLeft: 8, fontWeight: 'bold', textDecorationLine: 'underline' }}>
            Crear cuenta
          </ThemedLink>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

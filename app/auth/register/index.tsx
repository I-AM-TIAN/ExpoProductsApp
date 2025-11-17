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

import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";

const RegisterScreen = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, "background");
  const { register } = useAuthStore();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [isPosting, setIsPosting] = useState(false);

  const onRegister = async () => {
    const { firstName, lastName, phone, email, password, confirm } = form;

    // Validaciones básicas
    if (!firstName || !lastName || !phone || !email || !password || !confirm) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsPosting(true);
    const ok = await register({
      nombres: firstName,
      apellidos: lastName,
      telefono: phone,
      email: email,
      password: password,
      confirmPassword: confirm,
    });
    setIsPosting(false);

    if (ok) {
      router.replace("/");
      return;
    }
    Alert.alert("Error", "No se pudo completar el registro. Intenta de nuevo.");
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
      >
        {/* Título */}
        <View style={{ marginBottom: 18 }}>
          <ThemedText type="title" style={{ fontSize: 36, lineHeight: 44 }}>
            Registrarse
          </ThemedText>
        </View>

        {/* Campos */}
        <View style={{ gap: 12 }}>
          <ThemedTextInput
            placeholder="Nombres"
            autoCapitalize="words"
            icon="person-outline"
            value={form.firstName}
            onChangeText={(v) => setForm({ ...form, firstName: v })}
          />

          <ThemedTextInput
            placeholder="Apellidos"
            autoCapitalize="words"
            icon="person-outline"
            value={form.lastName}
            onChangeText={(v) => setForm({ ...form, lastName: v })}
          />

          <ThemedTextInput
            placeholder="Teléfono"
            keyboardType="phone-pad"
            autoCapitalize="none"
            icon="call-outline"
            value={form.phone}
            onChangeText={(v) => setForm({ ...form, phone: v })}
          />

          <ThemedTextInput
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
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

          <ThemedTextInput
            placeholder="Confirmar contraseña"
            secureTextEntry
            icon="lock-closed-outline"
            value={form.confirm}
            onChangeText={(v) => setForm({ ...form, confirm: v })}
          />
        </View>

        {/* Términos */}
        <View style={{ marginTop: 10, marginBottom: 14 }}>
          <ThemedText style={{ fontSize: 12, lineHeight: 18 }}>
            Al hacer clic en el botón{" "}
            <ThemedText style={{ fontWeight: "bold", fontSize: 14 }}>
              Registrarse
            </ThemedText>
            , aceptas los{" "}
            <ThemedLink href="/" style={{ fontSize: 12 }}>
              términos de uso
            </ThemedLink>
            .
          </ThemedText>
        </View>

        {/* Botón principal */}
        <ThemedButton onPress={onRegister} disabled={isPosting}>
          Registrarse
        </ThemedButton>

        {/* Separación */}
        <View style={{ height: 24 }} />

        {/* Link a login */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <ThemedText>¿Ya tienes una cuenta?</ThemedText>
          <ThemedLink href="/auth/login" style={{ marginLeft: 6 }}>
            Iniciar sesión
          </ThemedLink>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

import { useState } from "react";
import { KeyboardAvoidingView, Platform, useWindowDimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";

const RegisterScreen = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, "background");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });

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
          <ThemedText style={{fontSize: 12, lineHeight: 18 }}>
            Al hacer clic en el botón <ThemedText style={{ fontWeight: "bold", fontSize: 14 }}>Registrarse</ThemedText>, aceptas los{" "}
            <ThemedLink href="/" style={{ fontSize: 12 }}>
              términos de uso
            </ThemedLink>.
          </ThemedText>
        </View>

        {/* Botón principal */}
        <ThemedButton icon="arrow-forward-outline">
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

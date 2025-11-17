// app/(products-app)/(home)/information.tsx

import { useProfile } from "@/presentation/auth/hooks/useProfile";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";

const InformationScreen = () => {
  const backgroundColor = useThemeColor({}, "background");
  const { profile, isLoading, refetch } = useProfile();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Cuando llegue el perfil, llenamos el formulario
  useEffect(() => {
    if (!profile) return;

    setForm({
      firstName: profile.nombres || profile.fullname || "",
      lastName: profile.apellidos || "",
      phone: profile.telefono || "",
      email: profile.email || "",
    });
  }, [profile]);

  const handleSave = async () => {
    const { firstName, lastName, phone, email } = form;

    if (!firstName || !lastName || !email) {
      Alert.alert("Validación", "Nombres, apellidos y correo son obligatorios");
      return;
    }

    setIsSaving(true);
    try {
      // AQUÍ debes llamar a tu lógica real de actualización

      // Por ahora solo simulamos éxito:
      await new Promise((res) => setTimeout(res, 700));

      await refetch();

      Alert.alert("Éxito", "Tu información ha sido actualizada");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message || "No se pudo actualizar tu información"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={30} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={{ flex: 1, backgroundColor }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24, // 👈 empieza mucho más arriba
          paddingBottom: 40,
        }}
      >
        {/* Título */}
        <View style={{ marginBottom: 18 }}>
          <ThemedText type="title" style={{ fontSize: 32, lineHeight: 40 }}>
            Mi información
          </ThemedText>
        </View>

        {/* Campos EDITABLES */}
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
        </View>

        {/* Separación */}
        <View style={{ height: 20 }} />

        {/* Botón GUARDAR */}
        <ThemedButton onPress={handleSave} disabled={isSaving}>
          {isSaving ? "Guardando..." : "Guardar"}
        </ThemedButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default InformationScreen;

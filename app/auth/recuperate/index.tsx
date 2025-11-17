import { Ionicons } from "@expo/vector-icons";
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
  const [loading, setLoading] = useState(false);

  const handleSendEmail = () => {
    if (!email.trim()) {
      Alert.alert("Validación", "Por favor ingresa tu correo electrónico");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Éxito",
        "Te hemos enviado un mensaje para que puedas cambiar o recuperar tu contraseña"
      );
      setEmail("");
    }, 1500);
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

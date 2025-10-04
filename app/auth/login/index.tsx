import ThemedLink from "@/presentation/theme/components/ThemedLink";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";

import { KeyboardAvoidingView, useWindowDimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const LoginScreen = () => {
  const { height } = useWindowDimensions();

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <View
          style={{
            paddingTop: height * 0.35,
          }}
        >
          <ThemedText type="title">Bienvenido</ThemedText>
          <ThemedText style={{ color: "grey" }}>
            Inicia sesión para continuar
          </ThemedText>
        </View>

        <View>
          <ThemedTextInput
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
          />

          <ThemedTextInput
            placeholder="Contraseña"
            secureTextEntry
            icon="lock-closed-outline"
          />
        </View>

        <View>
          <ThemedLink href="/auth/register" style={{ marginHorizontal: 20 }}>
            Registrarse
          </ThemedLink>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default LoginScreen;

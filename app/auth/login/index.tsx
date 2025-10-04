import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";

import { KeyboardAvoidingView, useWindowDimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const LoginScreen = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView style={{ 
        paddingHorizontal: 20,
        backgroundColor: backgroundColor
      }}>
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

        {/*espacio entre inputs y botones*/}
        <View style={{ marginTop: 10 }} />

        {/*bootón de login*/}
        <ThemedButton icon="arrow-forward-outline">Ingresar</ThemedButton>

        {/*link a register*/}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ThemedText>¿Aún no tienes cuenta?</ThemedText>
          <ThemedLink href="/auth/register" style={{ marginHorizontal: 20 }}>
            Crear cuenta
          </ThemedLink>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default LoginScreen;

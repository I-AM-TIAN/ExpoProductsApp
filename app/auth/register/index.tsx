import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";

import { KeyboardAvoidingView, useWindowDimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const RegisterScreen = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView style={{
         paddingHorizontal: 20,
         backgroundColor: backgroundColor,
         }}>
        <View
          style={{
            paddingTop: height * 0.35,
          }}
        >
          <ThemedText type="title">Crear cuenta</ThemedText>
          <ThemedText style={{ color: "grey" }}>
            Registrese para continuar
          </ThemedText>
        </View>

        <View>
          <ThemedTextInput
            placeholder="Nombre completo"
            keyboardType="default"
            autoCapitalize="words"
            icon="person-outline"
          />

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

        {/*bootón de login*/}
        <ThemedButton icon="arrow-forward-outline">Crear cuenta</ThemedButton>
        
        <View style={{ marginTop: 50 }} />
        
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ThemedText>¿Ya tienes una cuenta?</ThemedText>
          <ThemedLink href="/auth/login" style={{ marginHorizontal: 5 }}>
            Iniciar sesión
          </ThemedLink>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default RegisterScreen;

import { ThemedText } from "@/presentation/theme/components/ThemeText";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import React from "react";
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

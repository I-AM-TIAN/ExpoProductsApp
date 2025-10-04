import { ThemedText } from "@/presentation/theme/components/themed-text";
import React from "react";
import { KeyboardAvoidingView, useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
const LoginScreen = () => {
  const { height } = useWindowDimensions();

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView>
        <view
          style={{
            padding: height * 0.35,
          }}
        >
          <ThemedText>Login Screen</ThemedText>
        </view>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default LoginScreen;

import { ThemedText } from "@/presentation/theme/components/ThemeText";
import React from "react";
import { View } from "react-native";

const RegisterScreen = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  return (
    <View>
      <ThemedText>RegisterScreen</ThemedText>
    </View>
  );
};

export default RegisterScreen;

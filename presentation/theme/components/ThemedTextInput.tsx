import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewProps,
} from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

interface Props extends Omit<TextInputProps, "style"> {
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewProps["style"];
}

const ThemedTextInput = ({ icon, style, ...rest }: Props) => {
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");

  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<TextInput>(null);

  return (
    <View
      style={[
        {
          ...styles.container,
          borderColor: isActive ? primaryColor : "#E5E7EB",
        },
        style,
      ]}
      onTouchStart={() => inputRef.current?.focus()}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={isActive ? primaryColor : "#6B7280"} // gris medio
          style={{ marginRight: 10 }}
        />
      )}

      <TextInput
        ref={inputRef}
        placeholderTextColor="#676767"
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        style={[styles.input, { color: textColor }]}
        {...rest}
      />
    </View>
  );
};

export default ThemedTextInput;

const styles = StyleSheet.create({
  // contenedor visual del input
  container: {
    height: 50, // alto como la maqueta
    backgroundColor: "#F4F4F5", // gris claro de relleno
    borderWidth: 1,
    borderRadius: 12, // más redondeado
    paddingHorizontal: 14, // padding lateral
    marginBottom: 14, // separación entre inputs
    flexDirection: "row",
    alignItems: "center",
  },
  // campo de texto
  input: {
    flex: 1,
    marginRight: 4,
    fontSize: 16,
  },
});

import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

interface Props extends PressableProps {
  children: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

const ThemedButton = ({ children, icon, style, ...rest }: Props) => {
  const primaryColor = useThemeColor({}, "primary");

  // Permite combinar estilo externo (objeto o función) con el interno
  const combineStyle = (pressed: boolean) => {
    const base = [
      styles.buttonBase,
      { backgroundColor: primaryColor, opacity: pressed ? 0.95 : 1 },
    ] as StyleProp<ViewStyle>;

    if (typeof style === "function") {
      return [base, style({
        pressed,
        hovered: false
      })];
    }
    return [base, style];
  };

  return (
    <Pressable style={({ pressed }) => combineStyle(pressed)} {...rest}>
      <Text style={styles.text}>{children}</Text>
      {icon && (
        <Ionicons name={icon} size={20} color="white" style={{ marginLeft: 6 }} />
      )}
    </Pressable>
  );
};

export default ThemedButton;

const styles = StyleSheet.create({
  buttonBase: {
    width: "100%",          // ancho completo
    minHeight: 50,          // alto cómodo como la maqueta
    paddingHorizontal: 12,
    borderRadius: 12,       // más redondeado
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

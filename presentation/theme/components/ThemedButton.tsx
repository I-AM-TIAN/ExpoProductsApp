import { Ionicons } from "@expo/vector-icons";
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

interface Props extends PressableProps {
  children: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

const ThemedButton = ({ children, icon, ...rest }: Props) => {
  const primaryColor = useThemeColor({}, "primary");
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: primaryColor,
        },
        styles.button,
      ]}
    >
      <Text style={{ color: "white" }}>{children}</Text>
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color="white"
          style={{ marginHorizontal: 5 }}
        />
      )}
    </Pressable>
  );
};

export default ThemedButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

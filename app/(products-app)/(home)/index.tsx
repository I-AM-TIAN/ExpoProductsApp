import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { View } from "react-native";

const HomeScreen = () => {
  const primary = useThemeColor({}, "primary");

  return (
    <View style={{ paddingTop: 100, paddingHorizontal: 20 }}>
      <ThemedText style={{ fontFamily: "KanitBold", color: primary }}>
        Home screen
      </ThemedText>
      <ThemedText style={{ fontFamily: "KanitRegular" }}>
        This is a themed text component
      </ThemedText>
      <ThemedText style={{ fontFamily: "KanitThin" }}>
        This is a themed text component
      </ThemedText>
    </View>
  );
};

export default HomeScreen;

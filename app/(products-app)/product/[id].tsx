// ...existing code...
import ProductImages from "@/presentation/products/components/ProductImages";
import { useProduct } from "@/presentation/products/hooks/useProduct";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
// ...existing code...

const ProductScreen = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const { productQuery } = useProduct(`${id}`);

  const primary = useThemeColor({}, "primary");
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Ionicons name="camera-outline" size={24} />,
    });
  }, []);

  useEffect(() => {
    if (productQuery.data) {
      navigation.setOptions({
        title: "",
      });
    }
  }, [productQuery.data]);

  if (productQuery.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={30} />
      </View>
    );
  }

  if (!productQuery.data) {
    return <Redirect href="/(products-app)/(home)" />;
  }

  const product = productQuery.data!;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView>
        <ProductImages images={product.images} />

        {/* título abajo de la imagen */}
        <View style={styles.headerContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {product.transactionType ?? "undefined"}
            </Text>
          </View>
          <Text style={styles.title}>{product.title}</Text>

          {/* Ubicación (fallback "undefined" si no viene del producto) */}
          <View style={styles.row}>
            <Ionicons name="location-sharp" size={16} color={primary} />
            <Text style={styles.locationText}>
              {product.location ?? "undefined"}
            </Text>
          </View>
        </View>

        {/* Descripción: mostrar como texto plano debajo del título */}
        <View style={{ marginHorizontal: 17, marginTop: 8 }}>
          <Text style={styles.description}>{product.description ?? "-"}</Text>
        </View>

        <ThemedView
          style={{
            marginHorizontal: 30,
            marginVertical: 5,
            flexDirection: "row",
            gap: 10,
          }}
        >
          <ThemedTextInput placeholder="Precio" style={{ flex: 1 }} />
        </ThemedView>
        <View style={{ width: "100%", marginTop: 10, paddingHorizontal: 30 }}>
          <ThemedButton onPress={() => {}} style={{ width: "100%" }}>
            Contactar
          </ThemedButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default ProductScreen;

const styles = StyleSheet.create({
  headerContainer: {
    marginHorizontal: 14,
    marginTop: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },

  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  badgeText: {
    fontSize: 12,
    color: "#374151",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  locationText: {
    marginLeft: 6,
    color: "#6B7280",
    fontSize: 14,
  },

  description: {
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
  },
});

import { Product } from "@/core/products/interfaces/product.interface";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  const onPress = () => router.push(`/product/${product.id}`);

  const hasImage = product.images?.length > 0;
  const pillText = String((product as any).transactionType); // “undefined” visible
  const locationLabel = String((product as any).location); // “undefined” visible

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      {/* Contenedor sin tarjeta: transparente, sin sombra ni borde */}
      <ThemedView style={styles.row}>
        <View style={styles.thumbWrap}>
          <Image
            source={
              hasImage
                ? { uri: product.images[0] }
                : require("../../../assets/images/no-product-image.png")
            }
            style={styles.thumb}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.pill}>
            <ThemedText style={styles.pillText} darkColor="#3F3F46">
              {pillText}
            </ThemedText>
          </View>

          <ThemedText
            numberOfLines={1}
            style={styles.title}
            darkColor="#111827"
          >
            {product.title}
          </ThemedText>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#6B7280" />
            <ThemedText style={styles.locationText} darkColor="#6B7280">
              {locationLabel}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // fila simple, sin fondo/sombra/borde → lista “plana”
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6, // aire vertical suave
    backgroundColor: "transparent",
  },

  thumbWrap: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: "#F3F4F6",
  },
  thumb: { width: "100%", height: "100%", resizeMode: "cover" },

  content: { flex: 1, justifyContent: "center" },

  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 6,
  },
  pillText: { fontSize: 12, fontWeight: "600" },

  title: { fontSize: 18, fontWeight: "700", marginBottom: 6 },

  locationRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  locationText: { fontSize: 13 },
});

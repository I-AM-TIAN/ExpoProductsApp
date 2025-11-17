// ...existing code...
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { useCreateConversation } from "@/presentation/chat/hooks/useCreateConversation";
import ProductImages from "@/presentation/products/components/ProductImages";
import { useProduct } from "@/presentation/products/hooks/useProduct";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import {
  Redirect,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
// ...existing code...

const ProductScreen = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();

  const { productQuery } = useProduct(`${id}`);
  const { createOrGetConversation, loading: creatingConversation } =
    useCreateConversation();
  const { user } = useAuthStore();

  const primary = useThemeColor({}, "primary");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (productQuery.data) {
      navigation.setOptions({
        title: "",
      });
    }
  }, [productQuery.data]);

  // Refrescar cuando la pantalla recupera el foco
  useFocusEffect(
    useCallback(() => {
      productQuery.refetch();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await productQuery.refetch();
    setRefreshing(false);
  }, []);

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

  const handleContactSeller = async () => {
    if (!user || !product.user) {
      alert("Debes iniciar sesión para contactar al vendedor");
      return;
    }

    if (user.id === product.user.id) {
      alert("No puedes contactarte a ti mismo");
      return;
    }

    // Validar si el producto está reservado
    if (product.status === "reservado") {
      Alert.alert(
        "Producto reservado",
        "Este producto ya está reservado. No puedes contactar al vendedor en este momento.",
        [{ text: "OK" }]
      );
      return;
    }

    // Validar si el producto no está disponible
    if (product.status === "no_disponible") {
      Alert.alert(
        "Producto no disponible",
        "Este producto ya no está disponible.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      console.log("📞 Creando conversación con:", product.user.id, "para producto:", product.id);
      
      // Siempre incluye productId - el backend creará conversaciones separadas por producto
      console.log("Creando conversación con:", product.user.id);

      const conversation = await createOrGetConversation({
        otherUserId: product.user.id,
        productId: product.id,
      });

      console.log("✅ Conversación obtenida:", conversation.id);

      // Detectar si es conversación existente (ya tiene mensajes)
      const isExistingConversation = conversation.lastMessage != null;
      console.log("Conversación creada:", conversation.id);

      router.push({
        pathname: "/(products-app)/chat/[id]",
        params: {
          id: conversation.id,
          otherUserName: `${product.user.nombres} ${product.user.apellidos}`,
          // Solo enviar mensaje inicial si es conversación nueva
          initialMessage: isExistingConversation 
            ? undefined 
            : `Hola, estoy interesado en este producto: ${product.name}`,
          productId: product.id,
          productName: product.name,
          productImage: product.images && product.images.length > 0 ? product.images[0] : undefined,
        },
      });
    } catch (error: any) {
      console.error("❌ Error creando conversación:", error);
      Alert.alert("Error", `No se pudo crear la conversación: ${error.message || 'Desconocido'}`);
      console.error("Error creando conversación:", error);
      alert(
        `Error al crear la conversación: ${error.message || "Desconocido"}`
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4F7942"]}
          />
        }
      >
        <ProductImages images={product.images} />

        {/* título abajo de la imagen */}
        <View style={styles.headerContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {product.modality?.name ?? "N/A"}
            </Text>
          </View>
          <Text style={styles.title}>{product.name}</Text>

          {/* Ubicación */}
          <View style={styles.row}>
            <Ionicons name="location-sharp" size={16} color={primary} />
            <Text style={styles.locationText}>
              {product.location
                ? `${product.location.city}, ${product.location.state}, ${product.location.country}`
                : "N/A"}
            </Text>
          </View>
        </View>

        {/* Descripción: mostrar como texto plano debajo del título */}
        <View style={{ marginHorizontal: 17, marginTop: 8 }}>
          <Text style={styles.description}>{product.description ?? "-"}</Text>
        </View>

        {/* Mostrar precio solo si la modalidad es "Venta" */}
        {product.modality?.name?.toLowerCase() === "venta" && (
          <ThemedView
            style={{
              marginHorizontal: 30,
              marginVertical: 5,
              flexDirection: "row",
              gap: 10,
            }}
          >
            <ThemedTextInput
              placeholder="Precio"
              style={{ flex: 1 }}
              value={`$${product.price.toLocaleString()}`}
              editable={false}
            />
          </ThemedView>
        )}

        {/* Información del vendedor */}
        {product.user && (
          <View style={styles.sellerContainer}>
            <Text style={styles.sellerTitle}>Publicado por</Text>
            <View style={styles.sellerInfo}>
              <Image
                source={{
                  uri:
                    product.user.profileImage ||
                    product.user.images?.find((img) => img.isProfileImage)
                      ?.url || "https://via.placeholder.com/50",
                }}
                style={styles.sellerImage}
              />
              <View style={styles.sellerDetails}>
                <Text style={styles.sellerName}>
                  {product.user.nombres} {product.user.apellidos}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ width: "100%", marginTop: 10, paddingHorizontal: 30 }}>
          {product.status === "reservado" && (
            <View style={styles.statusBanner}>
              <Ionicons name="time-outline" size={20} color="#F59E0B" />
              <Text style={styles.statusBannerText}>
                Este producto está reservado
              </Text>
            </View>
          )}
          {product.status === "no_disponible" && (
            <View style={[styles.statusBanner, { backgroundColor: "#FEE2E2" }]}>
              <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
              <Text style={[styles.statusBannerText, { color: "#DC2626" }]}>
                Este producto ya no está disponible
              </Text>
            </View>
          )}
          <ThemedButton
            onPress={handleContactSeller}
            style={{ width: "100%" }}
            disabled={
              creatingConversation || 
              product.status === "reservado" || 
              product.status === "no_disponible"
            }
          >
            {creatingConversation 
              ? "Conectando..." 
              : product.status === "reservado" 
                ? "Producto reservado" 
                : product.status === "no_disponible"
                  ? "No disponible"
                  : "Contactar"}
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

  sellerContainer: {
    marginHorizontal: 30,
    marginTop: 20,
    marginBottom: 10,
    padding: 15,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sellerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  sellerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E5E7EB",
  },
  sellerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sellerPhone: {
    marginLeft: 6,
    fontSize: 14,
    color: "#6B7280",
  },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  statusBannerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D97706",
    flex: 1,
  },
});

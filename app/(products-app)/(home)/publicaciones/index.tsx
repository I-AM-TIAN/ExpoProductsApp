import { getMyProductsAction } from "@/core/products/actions/get-my-products.action";
import { updateProductStatusAction } from "@/core/products/actions/update-product-status.action";
import { Product } from "@/core/products/interfaces/product.interface";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const getStatusLabel = (status?: string) => {
  switch (status) {
    case "disponible":
      return "Disponible";
    case "reservado":
      return "Reservado";
    case "no_disponible":
      return "No disponible";
    default:
      return "Disponible";
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case "disponible":
      return "#10B981"; // Verde
    case "reservado":
      return "#F59E0B"; // Naranja
    case "no_disponible":
      return "#EF4444"; // Rojo
    default:
      return "#10B981";
  }
};

const MyProductsScreen = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMyProducts();
  }, []);

  const loadMyProducts = async () => {
    try {
      setLoading(true);
      const data = await getMyProductsAction();
      setProducts(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
      Alert.alert("Error", "No se pudieron cargar tus productos");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMyProducts();
    setRefreshing(false);
  }, []);

  const handleStatusChange = (
    productId: string,
    productName: string
  ) => {
    Alert.alert(
      "Cambiar estado",
      `${productName}\n\nSelecciona el nuevo estado:`,
      [
        {
          text: "🟢 Disponible",
          onPress: () => updateStatus(productId, "disponible"),
        },
        {
          text: "🟠 Reservado",
          onPress: () => updateStatus(productId, "reservado"),
        },
        {
          text: "🔴 No disponible",
          onPress: () => updateStatus(productId, "no_disponible"),
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ]
    );
  };

  const updateStatus = async (
    productId: string,
    newStatus: "disponible" | "reservado" | "no_disponible"
  ) => {
    try {
      await updateProductStatusAction(productId, newStatus);
      
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status: newStatus } : p))
      );

      Alert.alert("Éxito", `Estado actualizado a: ${getStatusLabel(newStatus)}`);
    } catch (error: any) {
      console.error("Error actualizando estado:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "No se pudo actualizar el estado"
      );
    }
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/product/${productId}` as any);
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString("es-CO")}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getProductImage = (images: any[]) => {
    if (!images || images.length === 0) return undefined;
    
    const validImages = images
      .map((img: any) => {
        if (typeof img === 'string') return img;
        if (img && typeof img === 'object' && typeof img.url === 'string') return img.url;
        return null;
      })
      .filter((url: string | null): url is string => 
        url !== null && url.length > 0 && !url.startsWith('file:///')
      );
    
    return validImages.length > 0 ? validImages[0] : undefined;
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const productImage = getProductImage(item.images);

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <TouchableOpacity
            onPress={() => handleViewProduct(item.id)}
            activeOpacity={0.8}
          >
            {productImage ? (
              <Image source={{ uri: productImage }} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="image-outline" size={40} color="#9CA3AF" />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.info}>
            <TouchableOpacity onPress={() => handleViewProduct(item.id)}>
              <Text style={styles.title} numberOfLines={2}>
                {item.name}
              </Text>
            </TouchableOpacity>

            <Text style={styles.meta}>
              {item.location.city}, {item.location.state} • {formatDate(item.createdAt)}
            </Text>

            <View style={styles.statusPriceRow}>
              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
                onPress={() => handleStatusChange(item.id, item.name)}
                activeOpacity={0.8}
              >
                <Text style={styles.statusBtnText}>
                  {getStatusLabel(item.status)}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#FFFFFF" />
              </TouchableOpacity>

              <Text style={styles.price}>{formatPrice(item.price)}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F7942" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Historial de publicaciones</Text>
            <Text style={styles.headerSubtitle}>
              {products.length} {products.length === 1 ? "producto" : "productos"}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Sin publicaciones</Text>
            <Text style={styles.emptyText}>
              Aún no has publicado ningún producto
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4F7942"]}
          />
        }
      />
    </View>
  );
};

export default MyProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    padding: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
    lineHeight: 22,
  },
  meta: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  statusPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
});

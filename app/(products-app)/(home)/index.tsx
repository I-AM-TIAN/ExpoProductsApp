import ProductList from "@/presentation/products/components/ProductList";
import { useProducts } from "@/presentation/products/hooks/useProducts";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

const HomeScreen = () => {
  const { productsQuery, loadNextPage } = useProducts();
  const navigation = useNavigation();
  const primary = useThemeColor({}, "primary");

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          name="camera-outline"
          size={24}
          style={{ marginRight: 15 }}
          onPress={() => {
            // Aquí puedes definir la acción del botón, como navegar a otra pantalla
            console.log("Camera button pressed");
          }}
        />
      ),
    });
  }, [navigation, primary]);

  if (productsQuery.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={30} />
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <ProductList
        products={productsQuery.data?.pages.flatMap((page) => page) ?? []}
        loadNextPage={loadNextPage}
      />
    </View>
  );
};

export default HomeScreen;

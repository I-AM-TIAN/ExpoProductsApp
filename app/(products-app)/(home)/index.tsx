import ProductList from "@/presentation/products/components/ProductList";
import { useProducts } from "@/presentation/products/hooks/useProducts";
import { ActivityIndicator, View } from "react-native";

const HomeScreen = () => {
  const { productsQuery, loadNextPage } = useProducts(); // Replace with actual data fetching logic

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

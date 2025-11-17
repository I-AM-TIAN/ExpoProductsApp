import { Product } from "@/core/products/interfaces/product.interface";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { ProductCard } from "./ProductCard";

interface Props {
  products: Product[];
  loadNextPage: () => void;
  ListHeaderComponent?: React.ReactElement | null;
}

const ProductList = ({
  products,
  loadNextPage,
  ListHeaderComponent,
}: Props) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onPullToRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 200));

    queryClient.invalidateQueries({ queryKey: ["products", "infinite"] });

    setIsRefreshing(false);
  };

  return (
    <FlatList
      data={products}
      numColumns={1}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProductCard product={item} />}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      onEndReached={loadNextPage}
      onEndReachedThreshold={0.8}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onPullToRefresh} />
      }
    />
  );
};

export default ProductList;

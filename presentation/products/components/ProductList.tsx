import { Product } from "@/core/products/interfaces/product.interface";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { ProductCard } from "./ProductCard";

interface Props {
  products: Product[];

  loadNextPage: () => void;
}

const ProductList = ({ products, loadNextPage }: Props) => {
  return (
    <FlatList
      data={products}
      numColumns={2}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );
};

export default ProductList;

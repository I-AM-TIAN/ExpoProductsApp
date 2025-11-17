import { productsApi } from "@/core/api/productsApi";
import { Product } from "../interfaces/product.interface";

export const getMyProductsAction = async (): Promise<Product[]> => {
  try {
    const response = await productsApi.get<Product[]>("/products/my-products");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo mis productos:", error);
    throw error;
  }
};

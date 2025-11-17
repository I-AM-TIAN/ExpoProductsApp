import { productsApi } from "@/core/api/productsApi";
import { Product } from "../interfaces/product.interface";

export const getProducts = async (limit = 20, offset = 0) => {
  try {
    const { data } = await productsApi.get<Product[]>("/products", {
      params: { limit, offset },
    });

    // El backend ya retorna las imágenes en el formato correcto
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching products");
  }
};

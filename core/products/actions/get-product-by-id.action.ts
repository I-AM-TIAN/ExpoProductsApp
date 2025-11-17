import { productsApi } from "@/core/api/productsApi";
import { Product } from "../interfaces/product.interface";

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const { data } = await productsApi.get<Product>(`/products/${id}`);

    // El backend ya retorna las imágenes en el formato correcto
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("product with id ${ id } not found");
  }
};

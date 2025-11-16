import { API_URL, productsApi } from "@/core/api/productsApi";
import { Product } from "../interfaces/product.interface";

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const { data } = await productsApi.get<Product>(`/products/${id}`);

    return {
      ...data,
      images: data.images.map((image) => {
        // Si la imagen ya es una URL completa (http:// o https://), usarla directamente
        if (image.startsWith('http://') || image.startsWith('https://')) {
          return image;
        }
        // Si no, construir la URL con el API_URL
        return `${API_URL}/files/product/${image}`;
      }),
    };
  } catch (error) {
    console.log(error);
    throw new Error("product with id ${ id } not found");
  }
};

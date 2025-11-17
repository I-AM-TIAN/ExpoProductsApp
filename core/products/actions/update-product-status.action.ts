import { productsApi } from "@/core/api/productsApi";

interface UpdateProductStatusDto {
  status: "disponible" | "reservado" | "no_disponible";
}

export const updateProductStatusAction = async (
  productId: string,
  status: "disponible" | "reservado" | "no_disponible"
): Promise<void> => {
  try {
    const response = await productsApi.patch(
      `/products/${productId}/status`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error("Error actualizando estado del producto:", error);
    throw error;
  }
};

import { productsApi } from '@/core/api/productsApi';
import {
    CreateProductDto,
    CreateProductResponse,
} from '../interfaces/create-product.dto';

/**
 * Crea un nuevo producto
 * @param productData - Datos del producto a crear
 * @returns Producto creado con toda su información
 */
export const createProductAction = async (
  productData: CreateProductDto
): Promise<CreateProductResponse> => {
  try {
    const { data } = await productsApi.post<CreateProductResponse>(
      '/products',
      productData
    );

    // El backend ya retorna las imágenes en el formato correcto
    // No necesitamos transformarlas
    return data;
  } catch (error: any) {
    // Manejo de errores específicos del backend
    if (error.response?.data?.message) {
      const message = error.response.data.message;

      // Errores comunes
      if (Array.isArray(message)) {
        throw new Error(message.join(', '));
      }

      throw new Error(message);
    }

    throw new Error('Error al crear el producto');
  }
};
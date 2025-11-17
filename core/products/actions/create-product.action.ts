import { productsApi } from '@/core/api/productsApi';
import {
    CreateProductDto,
    CreateProductResponse,
} from '../interfaces/create-product.dto';

/**
 * Crea un nuevo producto
 * @param productData - Datos del producto a crear (con imágenes en base64)
 * @returns Producto creado con toda su información
 */
export const createProductAction = async (
  productData: CreateProductDto
): Promise<CreateProductResponse> => {
  try {
    // Enviar datos directamente - el backend espera las imágenes en base64
    const { data } = await productsApi.post<CreateProductResponse>(
      '/products',
      {
        name: productData.name,
        description: productData.description,
        location: productData.location,
        modality: productData.modality,
        price: productData.price,
        tags: productData.tags,
        images: productData.images, // Array de strings base64
      }
    );

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
import { createProductAction } from '@/core/products/actions/create-product.action';
import { CreateProductDto } from '@/core/products/interfaces/create-product.dto';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  location: string;
  modality: 'Venta' | 'Intercambio' | 'Donación' | '';
  images: string[];
  tags: string[];
}

export const useCreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  /**
   * Valida los datos del producto antes de enviar
   */
  const validateProduct = (data: ProductFormData): string | null => {
    if (!data.name || data.name.trim().length === 0) {
      return 'El nombre del producto es requerido';
    }

    if (!data.description || data.description.trim().length === 0) {
      return 'La descripción es requerida';
    }

    if (!data.location || data.location.trim().length === 0) {
      return 'La ubicación es requerida';
    }

    if (!data.modality) {
      return 'Selecciona una modalidad válida';
    }

    if (!['Venta', 'Intercambio', 'Donación'].includes(data.modality)) {
      return 'La modalidad debe ser: Venta, Intercambio o Donación';
    }

    // Validar precio si está presente
    if (data.price && data.price.trim() !== '') {
      const priceNumber = parseFloat(data.price);
      if (isNaN(priceNumber) || priceNumber < 0) {
        return 'El precio debe ser un número válido y no puede ser negativo';
      }
    }

    return null; // Válido
  };

  /**
   * Crea un nuevo producto
   */
  const createProduct = async (formData: ProductFormData) => {
    setLoading(true);
    setError(null);

    try {
      // Validar datos
      const validationError = validateProduct(formData);
      if (validationError) {
        throw new Error(validationError);
      }

      // Preparar DTO - El backend procesará las URIs locales directamente
      const productDto: CreateProductDto = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        modality: formData.modality as 'Venta' | 'Intercambio' | 'Donación',
        images: formData.images.length > 0 ? formData.images : undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      };

      // Agregar precio solo si está presente y es válido
      if (formData.price && formData.price.trim() !== '') {
        productDto.price = parseFloat(formData.price);
      }

      // Llamar al action
      const response = await createProductAction(productDto);
      
      // Invalidar la caché de productos para que se recargue automáticamente
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      
      setLoading(false);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear el producto';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  /**
   * Resetea el estado de error
   */
  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    createProduct,
    validateProduct,
    clearError,
  };
};

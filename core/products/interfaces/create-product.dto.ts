/**
 * DTO para crear un nuevo producto
 * Endpoint: POST /products
 */
export interface CreateProductDto {
  name: string;
  description: string;
  price?: number;
  location: string; // Formato: "Ciudad" o "Ciudad, Estado, País"
  modality: 'Venta' | 'Intercambio' | 'Donación';
  images?: string[];
  tags?: string[];
}

/**
 * Respuesta del endpoint de crear producto
 */
export interface CreateProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  tags: string[];
  location: {
    id: string;
    city: string;
    state: string;
    country: string;
  };
  modality: {
    id: string;
    name: string;
    description: string;
  };
  user: {
    id: string;
    nombres: string;
    apellidos: string;
    email: string;
    telefono?: string;
    roles: string[];
    isActive: boolean;
    ecopoints: number;
    ecoStatus?: string;
  };
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  slug: string;
  tags: string[];
  location: Location;
  modality: Modality;
  images: string[];
  user: User;
  status?: "disponible" | "reservado" | "no_disponible";
  createdAt?: string;
}

export interface Location {
  id: string;
  city: string;
  state: string;
  country: string;
}

export interface Modality {
  id: string;
  name: string;
  description: string;
}

export interface User {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  roles: string[];
  isActive: boolean;
  ecopoints: number;
  ecoStatus?: string;
  profileImage?: string;
  images?: UserImage[];
}

export interface UserImage {
  id: number;
  url: string;
  isProfileImage: boolean;
}

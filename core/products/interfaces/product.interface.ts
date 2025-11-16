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

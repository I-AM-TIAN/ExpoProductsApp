export interface User {
    id: string;
    email: string;
    fullname?: string;
    nombres?: string;
    apellidos?: string;
    telefono?: string;
    isActive: boolean;
    roles: string[];
    profileImage?: string; // Foto principal (la más reciente)
    images?: string[]; // Historial de todas las fotos
    ecopoints?: number;
    ecoStatus?: string;
}
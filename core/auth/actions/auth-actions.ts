import { productsApi } from "../../api/productsApi";
import { User } from "../interface/user";

export interface AuthResponse {
    id: string;
    email: string;
    fullname: string;
    isActive: boolean;
    roles: string[];
    token: string;
}

const returnUserToken = (data: AuthResponse): { user: User; token: string } => {
    const { token, ...user } = data;

    return { 
        user,
        token 
    };
};

import axios from 'axios';

export interface RegisterData {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  confirmPassword: string;
  telefono: string;
}

export const authLogin = async (email: string, password: string) => {
  email = email.toLowerCase();

  try {
    console.log('LOGIN → baseURL:', productsApi.defaults.baseURL, 'endpoint:', '/auth/login');
    const { data } = await productsApi.post<AuthResponse>('/auth/login', { email, password });
    return returnUserToken(data);

  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.log('LOGIN ERROR →', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: (err.config?.baseURL || '') + (err.config?.url || ''),
      });
      throw new Error(err.response?.data?.message || `Fallo login (${err.response?.status ?? 'sin status'}).`);
    }
    console.log('LOGIN ERROR (no-axios) →', err);
    throw new Error('Error al iniciar sesión');
  }
};

export const authRegister = async (registerData: RegisterData) => {
  const { email, ...restData } = registerData;
  const normalizedEmail = email.toLowerCase();

  try {
    console.log('REGISTER → baseURL:', productsApi.defaults.baseURL, 'endpoint:', '/auth/register');
    const { data } = await productsApi.post<AuthResponse>('/auth/register', {
      ...restData,
      email: normalizedEmail,
    });
    return returnUserToken(data);

  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.log('REGISTER ERROR →', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: (err.config?.baseURL || '') + (err.config?.url || ''),
      });
      throw new Error(err.response?.data?.message || `Fallo en registro (${err.response?.status ?? 'sin status'}).`);
    }
    console.log('REGISTER ERROR (no-axios) →', err);
    throw new Error('Error al registrar usuario');
  }
};

export const authCheckStatus = async () => {
    try {
        const { data } = await productsApi.get<AuthResponse>('/auth/check-status');
        return returnUserToken(data);
    } catch (error) {
        return null;
    }
}
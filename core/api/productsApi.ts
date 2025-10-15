import { SecureStorageAdapter } from '@/helpers/adapters/secure-storage.adapter';
import axios from 'axios';
import { Platform } from 'react-native';

const STAGE = process.env.EXPO_PUBLIC_STAGE || 'dev';

const API_URL_RAW =
  STAGE === 'prod'
    ? process.env.EXPO_PUBLIC_API_URL
    : Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_API_URL_IOS
    : process.env.EXPO_PUBLIC_API_URL_ANDROID;

// Asegura string y quita slashes finales duplicados
const BASE_URL = String(API_URL_RAW ?? '').trim().replace(/\/+$/, '');

console.log('ENV URLS →', {
  STAGE,
  platform: Platform.OS,
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_API_URL_IOS: process.env.EXPO_PUBLIC_API_URL_IOS,
  EXPO_PUBLIC_API_URL_ANDROID: process.env.EXPO_PUBLIC_API_URL_ANDROID,
});
console.log('productsApi BASE_URL →', BASE_URL);

const productsApi = axios.create({
  baseURL: BASE_URL,               // <— aquí ya NO puede quedar "API_URL"
  timeout: 10000,
});

productsApi.interceptors.request.use(async (config) => {
  const token = await SecureStorageAdapter.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export { productsApi };

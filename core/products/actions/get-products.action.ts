import { productsApi } from '@/core/api/productsApi';

export const getProducts = async (limit = 20, offset = 0) => {
    try {
        const { data } = await productsApi.get('/products', {
            params: { limit, offset }
        });
        return data;
    } catch (error) {
        console.log(error);
        throw new Error('Error fetching products');
    }
};
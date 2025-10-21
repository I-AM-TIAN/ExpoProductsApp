import { getProductById } from '@/core/products/actions/get-product-by-id.action';
import { useQuery } from '@tanstack/react-query';

export const useProduct = (productId: string) => {

    const productQuery = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId),
    staleTime: 1000 * 60 * 60, // 1 hora
    })

    //mutación


    //Mantener el ID del producto en cado de ser uno nuevo

  return{
    productQuery,
  }
}



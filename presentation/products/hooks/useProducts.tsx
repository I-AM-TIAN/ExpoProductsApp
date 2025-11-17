import { getProducts } from '@/core/products/actions/get-products.action';
import { useInfiniteQuery } from '@tanstack/react-query';


export const useProducts = () => {

    const productsQuery = useInfiniteQuery({
    queryKey: ['products', 'infinite'],
    queryFn: ({ pageParam }) => getProducts(20, pageParam * 20),

    staleTime: 1000 * 60 * 5, // Reducido a 5 minutos
    refetchOnWindowFocus: true, // Refrescar cuando vuelve a la app
    refetchOnMount: true, // Refrescar al montar el componente
    
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // Si la última página tiene menos de 20 productos, no hay más páginas
      if (lastPage.length < 20) {
        return undefined;
      }
      // Si tiene 20 o más, hay más páginas
      return allPages.length;
    },
});

  return {
    productsQuery,

    loadNextPage: productsQuery.fetchNextPage,
  }

}

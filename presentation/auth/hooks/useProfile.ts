import { getProfile } from "@/core/auth/actions/profile-actions";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true, // Refrescar cuando vuelve a la app
    refetchOnMount: true, // Refrescar al montar el componente
  });

  return {
    profileQuery,
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    refetch: profileQuery.refetch,
  };
};

import { getConversationsAction } from "@/core/chat/actions/get-conversations.action";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook para obtener las conversaciones del usuario
 */
export const useConversations = () => {
  const conversationsQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversationsAction,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchInterval: 1000 * 30, // Refetch cada 30 segundos para actualizar
  });

  return {
    conversations: conversationsQuery.data ?? [],
    isLoading: conversationsQuery.isLoading,
    error: conversationsQuery.error,
    refetch: conversationsQuery.refetch,
  };
};

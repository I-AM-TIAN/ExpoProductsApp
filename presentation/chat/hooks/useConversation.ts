import { getConversationAction } from "@/core/chat/actions/get-conversation.action";
import { Conversation } from "@/core/chat/interfaces/conversation.interface";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook para obtener una conversación individual
 */
export const useConversation = (conversationId: string) => {
  const conversationQuery = useQuery<Conversation>({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversationAction(conversationId),
    enabled: !!conversationId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    conversation: conversationQuery.data,
    isLoading: conversationQuery.isLoading,
    error: conversationQuery.error,
    refetch: conversationQuery.refetch,
  };
};

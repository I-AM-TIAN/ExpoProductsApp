import { createConversationAction } from "@/core/chat/actions/create-conversation.action";
import { CreateConversationDto } from "@/core/chat/interfaces/conversation.interface";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Hook para crear o recuperar una conversación
 */
export const useCreateConversation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const createOrGetConversation = async (dto: CreateConversationDto) => {
    try {
      setLoading(true);
      setError(null);

      const conversation = await createConversationAction(dto);

      // Invalidar la lista de conversaciones
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });

      return conversation;
    } catch (err: any) {
      const errorMessage = err.message || "Error al crear la conversación";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrGetConversation,
    loading,
    error,
  };
};

import { productsApi } from "@/core/api/productsApi";
import { Conversation } from "../interfaces/conversation.interface";

/**
 * Obtiene una conversación por su ID
 * @param conversationId ID de la conversación
 * @returns Conversación con información del producto
 */
export const getConversationAction = async (
  conversationId: string
): Promise<Conversation> => {
  try {
    const { data } = await productsApi.get<Conversation>(
      `/chat/conversations/${conversationId}`
    );
    return data;
  } catch (error: any) {
    console.error("Error al obtener conversación:", error);
    throw new Error(
      error.response?.data?.message || "Error al obtener la conversación"
    );
  }
};

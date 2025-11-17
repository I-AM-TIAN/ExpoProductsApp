import { productsApi } from "@/core/api/productsApi";

/**
 * Marca todos los mensajes de una conversación como leídos
 */
export const markAsReadAction = async (
  conversationId: string
): Promise<void> => {
  try {
    await productsApi.post(`/chat/conversations/${conversationId}/read`);
  } catch (error) {
    console.error("Error marking messages as read:", error);
    // No lanzar error, es una acción secundaria
  }
};

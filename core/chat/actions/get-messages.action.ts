import { productsApi } from "@/core/api/productsApi";
import { Message } from "../interfaces/message.interface";

/**
 * Obtiene los mensajes de una conversación con paginación
 */
export const getMessagesAction = async (
  conversationId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Message[]> => {
  try {
    const { data } = await productsApi.get<Message[]>(
      `/chat/conversations/${conversationId}/messages`,
      {
        params: { limit, offset },
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("No se pudieron cargar los mensajes");
  }
};

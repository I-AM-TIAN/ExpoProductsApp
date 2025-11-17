import { productsApi } from "@/core/api/productsApi";
import { Conversation } from "../interfaces/conversation.interface";

/**
 * Obtiene todas las conversaciones del usuario autenticado
 */
export const getConversationsAction = async (): Promise<Conversation[]> => {
  try {
    const { data } = await productsApi.get<Conversation[]>("/chat/conversations");
    return data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw new Error("No se pudieron cargar las conversaciones");
  }
};

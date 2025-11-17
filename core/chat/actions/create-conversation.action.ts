import { productsApi } from "@/core/api/productsApi";
import {
    Conversation,
    CreateConversationDto,
} from "../interfaces/conversation.interface";

/**
 * Crea una nueva conversación o retorna una existente
 */
export const createConversationAction = async (
  dto: CreateConversationDto
): Promise<Conversation> => {
  try {
    const { data } = await productsApi.post<Conversation>(
      "/chat/conversations",
      dto
    );
    return data;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw new Error("No se pudo crear la conversación");
  }
};

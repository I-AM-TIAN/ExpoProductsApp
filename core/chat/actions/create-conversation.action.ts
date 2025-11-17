import { productsApi } from "@/core/api/productsApi";
import {
    Conversation,
    CreateConversationDto,
} from "../interfaces/conversation.interface";

/**
 * Crea una nueva conversación o retorna una existente
 * El mensaje inicial se enviará desde el componente usando WebSocket
 */
export const createConversationAction = async (
  dto: CreateConversationDto
): Promise<Conversation> => {
  try {
    const { initialMessage, ...conversationDto } = dto;
    
    // Crear o obtener la conversación
    const { data } = await productsApi.post<Conversation>(
      "/chat/conversations",
      conversationDto
    );
    
    // Retornar la conversación con el mensaje inicial para enviarlo después
    return { ...data, initialMessage } as any;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw new Error("No se pudo crear la conversación");
  }
};

import { getMessagesAction } from "@/core/chat/actions/get-messages.action";
import { Message } from "@/core/chat/interfaces/message.interface";
import { useEffect, useState } from "react";

/**
 * Hook para manejar los mensajes de una conversación
 */
export const useMessages = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const data = await getMessagesAction(conversationId);
      setMessages(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error al cargar mensajes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (conversationId) {
      loadMessages();
    }
  }, [conversationId]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const markMessagesAsRead = () => {
    setMessages((prev) =>
      prev.map((msg) => ({ ...msg, isRead: true }))
    );
  };

  return {
    messages,
    isLoading,
    error,
    addMessage,
    markMessagesAsRead,
    refetch: loadMessages,
  };
};

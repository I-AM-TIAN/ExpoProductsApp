import { API_URL } from "@/core/api/productsApi";
import {
    JoinChatDto,
    MarkAsReadDto,
    Message,
    SendMessageDto,
    TypingEvent,
} from "@/core/chat/interfaces/message.interface";
import { SecureStorageAdapter } from "@/helpers/adapters/secure-storage.adapter";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  joinChat: (dto: JoinChatDto) => void;
  sendMessage: (dto: SendMessageDto) => void;
  startTyping: (event: TypingEvent) => void;
  stopTyping: (event: Omit<TypingEvent, "userName">) => void;
  markAsRead: (dto: MarkAsReadDto) => void;
  onNewMessage: (callback: (message: Message) => void) => () => void;
  onUserTyping: (callback: (data: TypingEvent) => void) => () => void;
  onUserStoppedTyping: (callback: () => void) => () => void;
  onMessagesRead: (callback: () => void) => () => void;
  disconnect: () => void;
}

/**
 * Hook para manejar conexión y eventos de WebSocket
 */
export const useSocket = (): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectSocket = async () => {
      const token = await SecureStorageAdapter.getItem("token");

      if (!token) {
        console.warn("No hay token, no se puede conectar al chat");
        return;
      }

      // Crear conexión WebSocket
      // Remover /api del final de la URL para Socket.IO
      const socketUrl = API_URL!.replace(/\/api$/, '');
      
      const socketInstance = io(socketUrl, {
        auth: { token },
        transports: ["websocket"],
      });

      socketInstance.on("connect", () => {
        console.log("✅ Conectado al servidor de chat");
        console.log("🔑 Socket ID:", socketInstance.id);
        setIsConnected(true);
      });

      socketInstance.on("disconnect", () => {
        console.log("❌ Desconectado del servidor de chat");
        setIsConnected(false);
      });

      socketInstance.on("error", (error) => {
        console.error("❌ Error en WebSocket:", error);
      });

      socketInstance.on("joinedChat", (data) => {
        console.log("✅ Unido al chat exitosamente:", data);
      });

      socketRef.current = socketInstance;
    };

    connectSocket();

    // Cleanup al desmontar
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const joinChat = (dto: JoinChatDto) => {
    if (!socketRef.current) return;
    socketRef.current.emit("joinChat", dto);
  };

  const sendMessage = (dto: SendMessageDto) => {
    if (!socketRef.current) return;
    socketRef.current.emit("sendMessage", dto);
  };

  const startTyping = (event: TypingEvent) => {
    if (!socketRef.current) return;
    socketRef.current.emit("typing", event);
  };

  const stopTyping = (event: Omit<TypingEvent, "userName">) => {
    if (!socketRef.current) return;
    socketRef.current.emit("stopTyping", event);
  };

  const markAsRead = (dto: MarkAsReadDto) => {
    if (!socketRef.current) return;
    socketRef.current.emit("markAsRead", dto);
  };

  const onNewMessage = (callback: (message: Message) => void) => {
    if (!socketRef.current) return () => {};
    socketRef.current.on("newMessage", callback);
    
    // Retornar función de limpieza
    return () => {
      if (socketRef.current) {
        socketRef.current.off("newMessage", callback);
      }
    };
  };

  const onUserTyping = (callback: (data: TypingEvent) => void) => {
    if (!socketRef.current) return () => {};
    socketRef.current.on("userTyping", callback);
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off("userTyping", callback);
      }
    };
  };

  const onUserStoppedTyping = (callback: () => void) => {
    if (!socketRef.current) return () => {};
    socketRef.current.on("userStoppedTyping", callback);
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off("userStoppedTyping", callback);
      }
    };
  };

  const onMessagesRead = (callback: () => void) => {
    if (!socketRef.current) return () => {};
    socketRef.current.on("messagesRead", callback);
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off("messagesRead", callback);
      }
    };
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    joinChat,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    onNewMessage,
    onUserTyping,
    onUserStoppedTyping,
    onMessagesRead,
    disconnect,
  };
};

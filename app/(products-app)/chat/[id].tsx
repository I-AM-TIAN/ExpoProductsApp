import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { ChatInput } from "@/presentation/chat/components/ChatInput";
import { MessageBubble } from "@/presentation/chat/components/MessageBubble";
import { useMessages } from "@/presentation/chat/hooks/useMessages";
import { useSocket } from "@/presentation/chat/hooks/useSocket";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";

const ChatScreen = () => {
  const { id: conversationId, otherUserName, productName } = useLocalSearchParams<{
    id: string;
    otherUserName: string;
    productName: string;
  }>();

  const { user: authUser } = useAuthStore();
  const user = (authUser as any)?.user || authUser; // Manejar estructura anidada
  
  // Debug: verificar usuario
  useEffect(() => {
    console.log("🔍 Usuario completo:", JSON.stringify(authUser, null, 2));
    console.log("👤 Usuario procesado - ID:", user?.id);
  }, [authUser]);

  const { messages, isLoading, addMessage, markMessagesAsRead } = useMessages(
    conversationId!
  );
  const {
    isConnected,
    joinChat,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    onNewMessage,
    onUserTyping,
    onUserStoppedTyping,
  } = useSocket();

  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const flatListRef = React.useRef<FlatList>(null);

  useEffect(() => {
    if (!isConnected || !conversationId || !user) {
      console.log("⏳ Esperando conexión...", { isConnected, conversationId: !!conversationId, user: !!user });
      return;
    }

    // Validar que conversationId sea un UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(conversationId)) {
      setConnectionError("ID de conversación inválido");
      return;
    }

    console.log("🔗 Uniéndose al chat:", conversationId);
    console.log("👤 Usuario ID:", user.id);

    // Dar un pequeño delay para asegurar que el socket esté listo
    const timeout = setTimeout(() => {
      // Unirse al chat
      joinChat({
        conversationId,
        userId: user.id,
      });
    }, 100);

    // Marcar mensajes como leídos
    markAsRead({
      conversationId,
      userId: user.id,
    });

    // Escuchar nuevos mensajes
    onNewMessage((message) => {
      addMessage(message);

      // Si el mensaje es del otro usuario, marcarlo como leído
      if (message.senderId !== user.id) {
        markAsRead({
          conversationId,
          userId: user.id,
        });
        markMessagesAsRead();
      }

      // Scroll al final
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    // Escuchar indicador de escritura
    onUserTyping((data) => {
      if (data.userId !== user.id) {
        setIsOtherUserTyping(true);
      }
    });

    onUserStoppedTyping(() => {
      setIsOtherUserTyping(false);
    });

    return () => {
      clearTimeout(timeout);
    };
  }, [isConnected, conversationId, user]);

  const handleSend = (message: string) => {
    if (!user || !conversationId) return;

    sendMessage({
      conversationId,
      message,
      senderId: user.id,
    });
  };

  const handleTypingStart = () => {
    if (!user || !conversationId) return;

    startTyping({
      conversationId,
      userId: user.id,
      userName: `${user.nombres} ${user.apellidos}`,
    });
  };

  const handleTypingStop = () => {
    if (!user || !conversationId) return;

    stopTyping({
      conversationId,
      userId: user.id,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size={30} color="#4F7942" />
      </View>
    );
  }

  if (connectionError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>❌ {connectionError}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Información del producto (opcional) */}
      {productName && (
        <View style={styles.productBanner}>
          <Text style={styles.productText} numberOfLines={1}>
            📦 {productName}
          </Text>
        </View>
      )}

      {/* Lista de mensajes */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble message={item} isOwn={item.senderId === user?.id} />
        )}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Inicia la conversación con {otherUserName}
            </Text>
          </View>
        }
      />

      {/* Indicador de escritura */}
      {isOtherUserTyping && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>{otherUserName} está escribiendo...</Text>
        </View>
      )}

      {/* Input de mensaje */}
      <ChatInput
        onSend={handleSend}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
      />

      {/* Indicador de desconexión */}
      {!isConnected && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Sin conexión al chat</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  productBanner: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  productText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  messagesList: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#DC2626",
    textAlign: "center",
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F9FAFB",
  },
  typingText: {
    fontSize: 13,
    color: "#6B7280",
    fontStyle: "italic",
  },
  offlineBanner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FEE2E2",
    paddingVertical: 8,
    alignItems: "center",
  },
  offlineText: {
    fontSize: 12,
    color: "#991B1B",
    fontWeight: "600",
  },
});

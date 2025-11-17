import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { ChatInput } from "@/presentation/chat/components/ChatInput";
import { MessageBubble } from "@/presentation/chat/components/MessageBubble";
import { ProductMessageCard } from "@/presentation/chat/components/ProductMessageCard";
import { useConversation } from "@/presentation/chat/hooks/useConversation";
import { useMessages } from "@/presentation/chat/hooks/useMessages";
import { useSocket } from "@/presentation/chat/hooks/useSocket";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";

const ChatScreen = () => {
  const { 
    id: conversationId, 
    otherUserName, 
    initialMessage,
    productId,
    productName,
    productImage,
  } = useLocalSearchParams<{
    id: string;
    otherUserName: string;
    initialMessage?: string;
    productId?: string;
    productName?: string;
    productImage?: string;
  }>();

  const { user: authUser } = useAuthStore();
  const user = (authUser as any)?.user || authUser; // Manejar estructura anidada
  
  // Obtener información de la conversación (incluyendo producto)
  const { conversation } = useConversation(conversationId!);
  
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
  const [initialMessageSent, setInitialMessageSent] = useState(false);
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
    const unsubscribeNewMessage = onNewMessage((message) => {
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
    const unsubscribeTyping = onUserTyping((data) => {
      if (data.userId !== user.id) {
        setIsOtherUserTyping(true);
      }
    });

    const unsubscribeStopTyping = onUserStoppedTyping(() => {
      setIsOtherUserTyping(false);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribeNewMessage();
      unsubscribeTyping();
      unsubscribeStopTyping();
    };
  }, [isConnected, conversationId, user]);

  // Efecto separado para enviar mensaje inicial después de cargar
  useEffect(() => {
    if (
      isConnected &&
      conversationId &&
      user &&
      !isLoading &&
      initialMessage &&
      !initialMessageSent &&
      messages.length === 0
    ) {
      console.log("📤 Enviando mensaje inicial:", initialMessage);
      const timeout = setTimeout(() => {
        sendMessage({
          conversationId,
          message: initialMessage,
          senderId: user.id,
        });
        setInitialMessageSent(true);
      }, 800); // Esperar a que el socket esté completamente listo

      return () => clearTimeout(timeout);
    }
  }, [isConnected, conversationId, user, isLoading, initialMessage, initialMessageSent, messages.length]);

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

  const handleSendImage = async (imageBase64: string) => {
    if (!user || !conversationId) return;

    try {
      // Enviar la imagen directamente como base64 en el mensaje
      sendMessage({
        conversationId,
        message: imageBase64,
        senderId: user.id,
      });
    } catch (error) {
      console.error("Error al enviar imagen:", error);
      Alert.alert("Error", "No se pudo enviar la imagen. Intenta de nuevo.");
    }
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
      {/* Lista de mensajes */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          // Detectar si es un mensaje de producto
          const isProductMessage = 
            item.content?.includes("Hola, estoy interesado en este producto") ||
            item.content?.includes("Hola, también estoy interesado en este producto");

          // Si es el primer mensaje y es un mensaje de producto
          const isFirstMessage = index === 0;
          
          if (isFirstMessage && isProductMessage && conversation?.product) {
            // Manejar tanto strings como objetos {url: string}
            const validImages = conversation.product.images
              ?.map((img: any) => {
                // Si es string, devolverlo directamente
                if (typeof img === 'string') return img;
                // Si es objeto con url, extraer la url
                if (img && typeof img === 'object' && typeof img.url === 'string') return img.url;
                return null;
              })
              .filter((url: string | null): url is string => 
                url !== null && url.length > 0 && !url.startsWith('file:///')
              ) ?? [];
            
            const productImage = validImages.length > 0 ? validImages[0] : undefined;
            
            console.log('🖼️ Imagen del producto:', productImage);
            console.log('📦 Todas las imágenes:', validImages);
            
            return (
              <ProductMessageCard
                productId={conversation.product.id}
                productName={conversation.product.name}
                productImage={productImage}
                isOwn={item.senderId === user?.id}
              />
            );
          }

          return (
            <MessageBubble message={item} isOwn={item.senderId === user?.id} />
          );
        }}
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
        onSendImage={handleSendImage}
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

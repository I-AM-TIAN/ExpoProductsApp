import { Message } from "@/core/chat/interfaces/message.interface";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Detectar si el mensaje es una imagen (data:image)
  const isImageMessage = message.content?.startsWith("data:image");

  return (
    <View
      style={[styles.container, isOwn ? styles.ownMessage : styles.otherMessage]}
    >
      {!isOwn && message.sender && (
        <Text style={styles.senderName}>
          {message.sender.nombres} {message.sender.apellidos}
        </Text>
      )}
      
      {isImageMessage ? (
        <Image 
          source={{ uri: message.content }} 
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.content, isOwn && styles.ownContent]}>
          {message.content}
        </Text>
      )}
      
      <View style={styles.footer}>
        <Text style={[styles.time, isOwn && styles.ownTime]}>
          {formatTime(message.createdAt)}
        </Text>
        {isOwn && (
          <Text style={styles.readStatus}>{message.isRead ? "✓✓" : "✓"}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: "75%",
    marginVertical: 4,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 16,
  },
  ownMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4F7942",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#F3F4F6",
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  content: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 20,
  },
  ownContent: {
    color: "#FFFFFF",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
    gap: 4,
  },
  time: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  ownTime: {
    color: "#E5E7EB",
  },
  readStatus: {
    fontSize: 12,
    color: "#E5E7EB",
  },
});

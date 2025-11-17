import { Conversation } from "@/core/chat/interfaces/conversation.interface";
import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface ConversationItemProps {
  conversation: Conversation;
  onPress: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onPress,
}) => {
  const otherUser = conversation.otherUser;
  const product = conversation.product;
  const hasUnread = (conversation.unreadCount ?? 0) > 0;

  const getProfileImage = () => {
    const profileImage = otherUser?.images?.find((img) => img.isProfileImage);
    return profileImage?.url || "https://via.placeholder.com/50";
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
      });
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: getProfileImage() }} style={styles.avatar} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, hasUnread && styles.boldText]}>
            {otherUser?.nombres} {otherUser?.apellidos}
          </Text>
          <Text style={styles.time}>{formatTime(conversation.updatedAt)}</Text>
        </View>

        {product && (
          <View style={styles.productBadge}>
            <Text style={styles.productIcon}>📦</Text>
            <Text style={styles.productName} numberOfLines={1}>
              {product.name}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text
            style={[styles.lastMessage, hasUnread && styles.boldText]}
            numberOfLines={1}
          >
            {conversation.lastMessage || "Iniciá la conversación..."}
          </Text>
          {hasUnread && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{conversation.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E5E7EB",
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    color: "#111827",
  },
  boldText: {
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  productName: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  productBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
    alignSelf: "flex-start",
  },
  productIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: "#6B7280",
  },
  badge: {
    backgroundColor: "#4F7942",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
});

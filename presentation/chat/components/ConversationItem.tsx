import { Conversation } from "@/core/chat/interfaces/conversation.interface";
import { Ionicons } from "@expo/vector-icons";
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
    // Priorizar profileImage sobre el array images (que puede tener rutas locales)
    if (otherUser?.profileImage) {
      return otherUser.profileImage;
    }
    
    // Fallback al array si existe
    const profileImage = otherUser?.images?.find((img) => img.isProfileImage);
    return profileImage?.url || null;
  };

  const renderAvatar = () => {
    const imageUri = getProfileImage();
    
    if (imageUri) {
      return <Image source={{ uri: imageUri }} style={styles.avatar} />;
    }
    
    // Mostrar avatar con iniciales si no hay imagen
    let initials = '';
    if (otherUser?.fullName) {
      const names = otherUser.fullName.split(' ');
      initials = names.length >= 2 
        ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`
        : names[0].charAt(0);
    } else {
      initials = `${otherUser?.nombres?.charAt(0) || ''}${otherUser?.apellidos?.charAt(0) || ''}`;
    }
    
    return (
      <View style={[styles.avatar, styles.avatarPlaceholder]}>
        <Text style={styles.avatarText}>{initials.toUpperCase()}</Text>
      </View>
    );
  };

  const getUserFullName = () => {
    // Priorizar fullName si existe
    if (otherUser?.fullName) {
      return otherUser.fullName;
    }
    // Fallback a nombres + apellidos
    const nombres = otherUser?.nombres || '';
    const apellidos = otherUser?.apellidos || '';
    return `${nombres} ${apellidos}`.trim() || 'Usuario';
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
    <TouchableOpacity 
      style={[
        styles.container, 
        hasUnread && styles.containerUnread
      ]} 
      onPress={onPress}
    >
      <View style={styles.avatarContainer}>
        {renderAvatar()}
        {hasUnread && <View style={styles.unreadDot} />}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, hasUnread && styles.nameUnread]}>
            {getUserFullName()}
          </Text>
          {hasUnread && (
            <View style={styles.badgeContainer}>
              <Ionicons name="mail-unread" size={16} color="#5D8370" style={styles.mailIcon} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{conversation.unreadCount}</Text>
              </View>
            </View>
          )}
        </View>

        {product && (
          <View style={styles.productBadge}>
            <Text style={styles.productIcon}>📦</Text>
            <Text style={[styles.productName, hasUnread && styles.productNameUnread]} numberOfLines={1}>
              {product.name}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  containerUnread: {
    backgroundColor: "#F0F9FF",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E5E7EB",
  },
  avatarPlaceholder: {
    backgroundColor: "#5D8370",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  unreadDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#5D8370",
    borderWidth: 3,
    borderColor: "#FFFFFF",
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
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  nameUnread: {
    fontWeight: "700",
    color: "#000000",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  mailIcon: {
    marginRight: 2,
  },
  productBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  productIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  productName: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  productNameUnread: {
    color: "#374151",
    fontWeight: "600",
  },
  badge: {
    backgroundColor: "#5D8370",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});

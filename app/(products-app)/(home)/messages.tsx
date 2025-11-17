import { ConversationItem } from "@/presentation/chat/components/ConversationItem";
import { useConversations } from "@/presentation/chat/hooks/useConversations";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

const MessagesScreen = () => {
  const router = useRouter();
  const { conversations, isLoading, refetch } = useConversations();

  if (isLoading && conversations.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size={30} color="#4F7942" />
      </View>
    );
  }

  if (conversations.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No tienes conversaciones</Text>
        <Text style={styles.emptySubtext}>
          Comienza contactando a un vendedor
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            onPress={() => {
              router.push({
                pathname: "/(products-app)/chat/[id]",
                params: {
                  id: item.id,
                  otherUserName: `${item.otherUser?.nombres} ${item.otherUser?.apellidos}`,
                  productName: item.product?.name || "",
                },
              });
            }}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#4F7942"
          />
        }
      />
    </View>
  );
};

export default MessagesScreen;

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
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});


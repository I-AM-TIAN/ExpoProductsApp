import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Post = {
  id: string;
  title: string;
  image?: string;
  location?: string;
  price?: string;
  status: "disponible" | "reservado" | "no_disponible";
  createdAt: string;
};

const initialData: Post[] = [
  {
    id: "1",
    title: "Sofá Moderno Gris",
    image:
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b3f?w=800&q=80",
    location: "Bogotá, Cundinamarca",
    price: "$450.000",
    status: "disponible",
    createdAt: "2025-11-10",
  },
  {
    id: "2",
    title: "Camisa Quilted",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
    location: "Medellín, Antioquia",
    price: "$45.000",
    status: "reservado",
    createdAt: "2025-10-20",
  },
  {
    id: "3",
    title: "Camiseta Negra",
    image:
      "https://images.unsplash.com/photo-1520975914305-0d4d0c4c4eaf?w=800&q=80",
    location: "Cali, Valle",
    price: "$30.000",
    status: "no_disponible",
    createdAt: "2025-09-05",
  },
];

const getStatusLabel = (status: string) => {
  switch (status) {
    case "disponible":
      return "Disponible";
    case "reservado":
      return "Reservado";
    case "no_disponible":
      return "No disponible";
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "disponible":
      return "#10B981";
    case "reservado":
      return "#F59E0B";
    case "no_disponible":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};

const ShoppingcartScreen = () => {
  const [posts, setPosts] = useState<Post[]>(initialData);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const openStatusModal = (id: string) => {
    setSelectedPostId(id);
    setModalVisible(true);
  };

  const changeStatus = (
    newStatus: "disponible" | "reservado" | "no_disponible"
  ) => {
    if (selectedPostId) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === selectedPostId ? { ...p, status: newStatus } : p
        )
      );
    }
    setModalVisible(false);
  };

  const removePost = (id: string) => {
    Alert.alert("Eliminar publicación", "¿Deseas eliminar esta publicación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => setPosts((prev) => prev.filter((p) => p.id !== id)),
      },
    ]);
  };

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>
          {item.location} • {item.createdAt}
        </Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.statusBtn,
              { backgroundColor: getStatusColor(item.status) },
            ]}
            onPress={() => openStatusModal(item.id)}
          >
            <Text style={styles.statusBtnTxt}>
              {getStatusLabel(item.status)}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color="#fff"
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => removePost(item.id)}
          >
            <Text style={styles.deleteTxt}>Eliminar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.price}>{item.price}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Historial de publicaciones</Text>

      {posts.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTxt}>No tienes publicaciones todavía.</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      {/* Modal para cambiar estado */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cambiar estado</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => changeStatus("disponible")}
            >
              <View
                style={[styles.modalBadge, { backgroundColor: "#10B981" }]}
              />
              <Text style={styles.modalOptionTxt}>Disponible</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => changeStatus("reservado")}
            >
              <View
                style={[styles.modalBadge, { backgroundColor: "#F59E0B" }]}
              />
              <Text style={styles.modalOptionTxt}>Reservado</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => changeStatus("no_disponible")}
            >
              <View
                style={[styles.modalBadge, { backgroundColor: "#EF4444" }]}
              />
              <Text style={styles.modalOptionTxt}>No disponible</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelTxt}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ShoppingcartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111",
  },
  card: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 1,
  },
  image: {
    width: 110,
    height: 110,
    backgroundColor: "#eee",
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  meta: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  statusBtn: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  statusBtnTxt: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  deleteBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  deleteTxt: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 12,
  },
  price: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyTxt: {
    color: "#6b7280",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 12,
  },
  modalOptionTxt: {
    fontSize: 16,
    color: "#111",
    fontWeight: "600",
  },
  modalCancel: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    alignItems: "center",
  },
  modalCancelTxt: {
    color: "#6b7280",
    fontWeight: "600",
  },
});

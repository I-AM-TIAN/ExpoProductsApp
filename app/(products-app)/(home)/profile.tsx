import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const ProfileScreen = () => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header con avatar y nombre */}
      <View style={{ alignItems: "center", paddingVertical: 24 }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#E91E63",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 40, color: "#fff" }}>👤</Text>
        </View>

        <Text style={{ fontSize: 24, fontWeight: "700", color: "#111827" }}>
          Natalia
        </Text>

        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
        >
          <Ionicons name="star" size={16} color="#5D8370" />
          <Text style={{ marginLeft: 6, color: "#6B7280" }}>
            1450 Ecopuntos
          </Text>
        </View>
      </View>

      {/* Mis intercambios */}
      <TouchableOpacity
        style={{
          marginHorizontal: 16,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>
          Mis intercambios
        </Text>
        <Ionicons name="chevron-forward" size={24} color="#6B7280" />
      </TouchableOpacity>

      {/* Mis donaciones */}
      <TouchableOpacity
        style={{
          marginHorizontal: 16,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>
          Mis donaciones
        </Text>
        <Ionicons name="chevron-forward" size={24} color="#6B7280" />
      </TouchableOpacity>

      {/* Estatus ecológico */}
      <View style={{ marginHorizontal: 16, marginTop: 24 }}>
        <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>
          Estatus ecológico
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
          }}
        >
          <Ionicons name="leaf" size={20} color="#5D8370" />
          <Text
            style={{
              marginLeft: 8,
              fontSize: 16,
              fontWeight: "600",
              color: "#111827",
            }}
          >
            Embajador circular
          </Text>
        </View>
      </View>

      {/* Mapa */}
      <View style={{ marginHorizontal: 16, marginTop: 24, marginBottom: 100 }}>
        <View
          style={{
            width: "100%",
            height: 200,
            backgroundColor: "#E0E0E0",
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <Text style={{ color: "#999" }}>Mapa aquí</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

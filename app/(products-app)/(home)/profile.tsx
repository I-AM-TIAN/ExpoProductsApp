import { useProfile } from "@/presentation/auth/hooks/useProfile";
import { useProfileImagePicker } from "@/presentation/auth/hooks/useProfileImagePicker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileScreen = () => {
  const { profile, isLoading, refetch } = useProfile();
  const { showImagePickerOptions, isUploading } = useProfileImagePicker({
    onSuccess: () => refetch(),
  });

  const router = useRouter();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={30} />
      </View>
    );
  }

  // Valores por defecto
  const userName = profile?.nombres || profile?.fullname || "Usuario";
  const userLastName = profile?.apellidos || "";
  const fullName = userLastName ? `${userName} ${userLastName}` : userName;
  const ecopoints = profile?.ecopoints ?? 0;
  const ecoStatus = profile?.ecoStatus || "Nuevo miembro";
  const profileImage = profile?.profileImage;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header con avatar y nombre */}
      <View style={{ alignItems: "center", paddingVertical: 24 }}>
        <View style={{ position: "relative" }}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginBottom: 16,
                backgroundColor: "#E5E7EB",
              }}
              resizeMode="cover"
            />
          ) : (
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
              <Ionicons name="person" size={50} color="#fff" />
            </View>
          )}

          {/* Botón de cámara */}
          <TouchableOpacity
            onPress={showImagePickerOptions}
            disabled={isUploading}
            style={{
              position: "absolute",
              bottom: 12,
              right: 0,
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#5D8370",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 3,
              borderColor: "#fff",
            }}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="camera" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 24, fontWeight: "700", color: "#111827" }}>
          {fullName}
        </Text>

        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
        >
          <Ionicons name="star" size={16} color="#5D8370" />
          <Text style={{ marginLeft: 6, color: "#6B7280" }}>
            {ecopoints} Ecopuntos
          </Text>
        </View>
      </View>

      {/* Mis publicaciones */}
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
        onPress={() => router.push("/publicaciones")} // -> /historial/index.tsx
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>
          Mis publicaciones
        </Text>
        <Ionicons name="chevron-forward" size={24} color="#6B7280" />
      </TouchableOpacity>

      {/* Mi información */}
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
        onPress={() => router.push("/information")} // -> /historial/index.tsx
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>
          Mi información
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
            {ecoStatus}
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

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
                backgroundColor: "#5D8370",
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
        onPress={() => router.push("/publicaciones")}
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
        onPress={() => router.push("/information")}
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

      {/* Bloque de consejos ReUse (reemplaza al mapa) */}
      <View
        style={{
          marginHorizontal: 16,
          marginTop: 10,
          marginBottom: 100,
        }}
      >
        <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>
          Consejos ReUse
        </Text>

        <View
          style={{
            borderRadius: 12,
            backgroundColor: "#F9FAFB",
            padding: 14,
          }}
        >
          {/* Fila 1 */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#E5F3EB",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Ionicons
                name="swap-horizontal-outline"
                size={18}
                color="#4B7B63"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#111827" }}
              >
                Intercambia antes de comprar
              </Text>
              <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                Publica lo que no usas y cámbialo por algo que sí necesitas.
              </Text>
            </View>
          </View>

          {/* Fila 2 */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#E5F3EB",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Ionicons name="heart-outline" size={18} color="#4B7B63" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#111827" }}
              >
                Dona cuando puedas
              </Text>
              <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                Lo que ya no usas puede ser de gran ayuda para otra persona.
              </Text>
            </View>
          </View>

          {/* Fila 3 */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#E5F3EB",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Ionicons name="bag-handle-outline" size={18} color="#4B7B63" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#111827" }}
              >
                Prefiere productos usados
              </Text>
              <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                Ahorras dinero, reduces residuos y aumentas tus Ecopuntos.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

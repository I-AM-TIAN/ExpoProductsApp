import LogoutIconButton from "@/presentation/auth/components/LogoutIconButton";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Stack, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const CheckAutenticationLayout = () => {
  const { status, checkStatus } = useAuthStore();
  const backgroundColor = useThemeColor({}, "background");
  const router = useRouter();

  React.useEffect(() => {
    checkStatus();
  }, []);

  if (status === "checking") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (status === "unauthenticated") {
    return <Redirect href="/auth/login" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          contentStyle: {
            backgroundColor: backgroundColor,
            paddingBottom: 90,
          },
        }}
      >
        <Stack.Screen
          name="(home)/index"
          options={{
            title: "Productos",
            headerLeft: () => <LogoutIconButton />,
            headerShown: true,
          }}
        />

        <Stack.Screen
          name="(home)/profile"
          options={{
            title: "Perfil",
            headerShown: true,
          }}
        />

        <Stack.Screen
          name="(home)/messages"
          options={{
            title: "Mensajes",
            headerShown: true,
          }}
        />

        <Stack.Screen
          name="(home)/shoppingcart"
          options={{
            title: "Carrito",
            headerShown: true,
          }}
        />

        <Stack.Screen
          name="(home)/settings"
          options={{
            title: "Agregar producto",
            headerShown: true,
          }}
        />

        <Stack.Screen
          name="product/[id]"
          options={{
            title: "Productos",
            headerShown: true,
          }}
        />
      </Stack>

      {/* Menú inferior navegable */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          backgroundColor: "white",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 16,
          paddingBottom: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => router.push("/(products-app)/(home)")}
          >
            <Ionicons name="home-outline" size={24} color="gray" />
            <Text style={{ color: "gray", fontSize: 12, marginTop: 4 }}>
              Inicio
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => router.push("/(products-app)/(home)/profile")}
          >
            <Ionicons name="person-outline" size={24} color="gray" />
            <Text style={{ color: "gray", fontSize: 12, marginTop: 4 }}>
              Perfil
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <TouchableOpacity
            style={{
              height: 60,
              width: 60,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 30,
              backgroundColor: "#5D8370",
              marginBottom: 20,
            }}
            onPress={() => router.push("/(products-app)/(home)/settings")}
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => router.push("/(products-app)/(home)/shoppingcart")}
          >
            <Ionicons name="cart-outline" size={24} color="gray" />
            <Text style={{ color: "gray", fontSize: 12, marginTop: 4 }}>
              Carrito
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => router.push("/(products-app)/(home)/messages")}
          >
            <Ionicons name="chatbubble-outline" size={24} color="gray" />
            <Text style={{ color: "gray", fontSize: 12, marginTop: 4 }}>
              Mensajes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CheckAutenticationLayout;

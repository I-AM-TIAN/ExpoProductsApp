// app/(products-app)/(home)/reuse-home.tsx  (por ejemplo)

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View,
  useWindowDimensions,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";

const ReUseHomeScreen = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, "background");
  const cardColor = "#F6E9DC";

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={{ flex: 1, backgroundColor }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          // empieza arriba, no en medio
          paddingBottom: 40,
        }}
      >
        {/* Título ReUse */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <ThemedText
            type="title"
            style={{ fontSize: 32, lineHeight: 38, marginBottom: 4 }}
          >
            ReUse
          </ThemedText>
          <ThemedText
            style={{ fontSize: 14, lineHeight: 20, textAlign: "center" }}
          >
            ReUse es un espacio para darle una segunda vida a lo que ya existe:
            intercambiar, donar y comprar productos nuevos o usados en buen
            estado de manera simple y responsable.
          </ThemedText>
        </View>

        {/* Sección principal de acciones */}
        <View style={{ gap: 12, marginBottom: 24 }}>
          {/* Fila: Intercambiar / Donar */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
            }}
          >
            {/* Intercambiar */}
            <View
              style={{
                flex: 1,
                backgroundColor: cardColor,
                borderRadius: 16,
                paddingVertical: 18,
                paddingHorizontal: 14,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="swap-horizontal-outline"
                size={28}
                color="#26453B"
                style={{ marginBottom: 8 }}
              />
              <ThemedText
                style={{ fontSize: 14, fontWeight: "600", marginBottom: 4 }}
              >
                Intercambiar
              </ThemedText>
              <ThemedText
                style={{ fontSize: 12, lineHeight: 16, textAlign: "center" }}
              >
                Cambia lo que ya no usas por algo que sí necesitas.
              </ThemedText>
            </View>

            {/* Donar */}
            <View
              style={{
                flex: 1,
                backgroundColor: cardColor,
                borderRadius: 16,
                paddingVertical: 18,
                paddingHorizontal: 14,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="heart-outline"
                size={28}
                color="#26453B"
                style={{ marginBottom: 8 }}
              />
              <ThemedText
                style={{ fontSize: 14, fontWeight: "600", marginBottom: 4 }}
              >
                Donar
              </ThemedText>
              <ThemedText
                style={{ fontSize: 12, lineHeight: 16, textAlign: "center" }}
              >
                Deja que tus cosas sigan ayudando a alguien más.
              </ThemedText>
            </View>
          </View>

          {/* Bloque: Comprar usado (ancho completo) */}
          <View
            style={{
              backgroundColor: cardColor,
              borderRadius: 16,
              paddingVertical: 18,
              paddingHorizontal: 14,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="bag-handle-outline"
              size={28}
              color="#26453B"
              style={{ marginBottom: 8 }}
            />
            <ThemedText
              style={{ fontSize: 14, fontWeight: "600", marginBottom: 4 }}
            >
              Comprar usado
            </ThemedText>
            <ThemedText
              style={{ fontSize: 12, lineHeight: 16, textAlign: "center" }}
            >
              Encuentra productos con historia, ahorra dinero y reduces
              residuos.
            </ThemedText>
          </View>
        </View>

        {/* Texto sobre la importancia de reutilizar */}
        <View style={{ marginBottom: 24 }}>
          <ThemedText
            style={{ fontSize: 16, fontWeight: "600", marginBottom: 6 }}
          >
            ¿Por qué reutilizar?
          </ThemedText>
          <ThemedText style={{ fontSize: 13, lineHeight: 19 }}>
            Es una forma sencilla de cuidar el planeta, ahorrar dinero y
            conectar con personas que también creen en un consumo más
            consciente.
          </ThemedText>
        </View>

        {/* Botón para ir a productos */}
        <ThemedButton
          onPress={
            () => router.push("/(products-app)/(home)/shoppingcart") // 🔁 Ajusta esta ruta a tu pantalla de productos
          }
        >
          Ir a ver productos
        </ThemedButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ReUseHomeScreen;

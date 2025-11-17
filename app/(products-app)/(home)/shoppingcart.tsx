import ProductList from "@/presentation/products/components/ProductList";
import { useProducts } from "@/presentation/products/hooks/useProducts";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ShopScreen = () => {
  const { productsQuery, loadNextPage } = useProducts();
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "category" | "location"
  >("all");

  // Filtrar productos según búsqueda y filtro seleccionado
  const filteredProducts = useMemo(() => {
    const allProducts = productsQuery.data?.pages.flatMap((page) => page) ?? [];
    
    if (!searchText.trim()) {
      return allProducts;
    }

    return allProducts.filter((product) => {
      const searchLower = searchText.toLowerCase().trim();
      
      // Filtrar según el tipo de filtro seleccionado
      if (selectedFilter === "all") {
        // Buscar en todos los campos
        return product.name.toLowerCase().includes(searchLower) ||
               product.description.toLowerCase().includes(searchLower) ||
               product.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
               product.modality.name.toLowerCase().includes(searchLower) ||
               product.location.city.toLowerCase().includes(searchLower) ||
               product.location.state.toLowerCase().includes(searchLower);
      }

      if (selectedFilter === "category") {
        // Buscar solo en modalidad
        return product.modality.name.toLowerCase().includes(searchLower);
      }

      if (selectedFilter === "location") {
        // Buscar solo en ubicación
        return product.location.city.toLowerCase().includes(searchLower) ||
               product.location.state.toLowerCase().includes(searchLower);
      }

      return false;
    });
  }, [productsQuery.data, searchText, selectedFilter]);

  if (productsQuery.isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={30} />
      </View>
    );
  }

  const header = (
    <View
      style={{
        paddingTop: 10,
        paddingBottom: 12,
      }}
    >
      {/* Título */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: "#111827",
          }}
        >
          Explorar
        </Text>
      </View>

      {/* Search bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#f3f4f6",
          borderRadius: 24,
          paddingHorizontal: 12,
          paddingVertical: 10,
          gap: 8,
        }}
      >
        <Ionicons name="search" size={16} color="#6B7280" />
        <TextInput
          style={{ flex: 1, fontSize: 14, color: "#111827" }}
          placeholder="Buscar"
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Filtros debajo del buscador */}
      <View
        style={{
          flexDirection: "row",
          marginTop: 12,
          columnGap: 8,
        }}
      >
        {/* TODO */}
        <TouchableOpacity
          onPress={() => setSelectedFilter("all")}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: selectedFilter === "all" ? "#5D8370" : "#E5E7EB",
            backgroundColor: selectedFilter === "all" ? "#5D8370" : "#FFFFFF",
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "500",
              color: selectedFilter === "all" ? "#FFFFFF" : "#4B5563",
            }}
          >
            Todo
          </Text>
        </TouchableOpacity>

        {/* CATEGORÍA */}
        <TouchableOpacity
          onPress={() => setSelectedFilter("category")}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: selectedFilter === "category" ? "#5D8370" : "#E5E7EB",
            backgroundColor:
              selectedFilter === "category" ? "#5D8370" : "#FFFFFF",
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "500",
              color: selectedFilter === "category" ? "#FFFFFF" : "#4B5563",
            }}
          >
            Categoría
          </Text>
        </TouchableOpacity>

        {/* UBICACIÓN */}
        <TouchableOpacity
          onPress={() => setSelectedFilter("location")}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: selectedFilter === "location" ? "#5D8370" : "#E5E7EB",
            backgroundColor:
              selectedFilter === "location" ? "#5D8370" : "#FFFFFF",
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "500",
              color: selectedFilter === "location" ? "#FFFFFF" : "#4B5563",
            }}
          >
            Ubicación
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ProductList
        products={filteredProducts}
        loadNextPage={loadNextPage}
        ListHeaderComponent={header}
      />
    </View>
  );
};

export default ShopScreen;

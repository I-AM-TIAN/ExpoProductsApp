// Imports: librerías externas, hooks, componentes
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SettingsScreen = () => {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"venta" | "donacion" | "intercambio">(
    "venta"
  );
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permiso denegado",
            "Necesitamos acceso a la galería para subir imágenes."
          );
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.6,
      });

      const uri =
        // @ts-ignore
        result?.assets?.[0]?.uri ?? // nuevas versiones
        // @ts-ignore
        result?.uri; // versiones antiguas

      if (uri) {
        setImages((prev) => [uri, ...prev].slice(0, 6));
      }
    } catch (error) {
      console.error("pickImage error:", error);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim())
      return Alert.alert("Validación", "Ingresa el nombre del producto.");
    if (!location.trim())
      return Alert.alert("Validación", "Ingresa la ubicación.");
    if (!description.trim())
      return Alert.alert("Validación", "Ingresa la descripción.");
    if (type === "venta" && !price.trim())
      return Alert.alert("Validación", "Ingresa el precio.");

    setSubmitting(true);
    // SOLO SIMULACIÓN: aquí guardas localmente o envías al backend cuando quieras
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert("Listo", "Producto guardado localmente (simulado).");
      // opcional: limpiar formulario
      // setImages([]);
      // setTitle("");
      // setType("venta");
      // setLocation("");
      // setDescription("");
      // setPrice("");
    }, 900);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Imagen principal / placeholder */}
        <View style={styles.headerImageWrap}>
          {images[0] ? (
            <Image source={{ uri: images[0] }} style={styles.headerImage} />
          ) : (
            <View style={styles.headerPlaceholder}>
              <Ionicons name="image-outline" size={44} color="#bbb" />
              <Text style={styles.placeholderText}>
                Agrega imágenes de tu producto
              </Text>
            </View>
          )}
        </View>

        {/* Mini galería: botones + thumbs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.galleryScroll}
        >
          <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
            <Ionicons name="images" size={22} color="#666" />
            <Text style={styles.galleryLabel}>Galería</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
            <Ionicons name="camera" size={22} color="#666" />
            <Text style={styles.galleryLabel}>Cámara</Text>
          </TouchableOpacity>

          {images.map((uri, i) => (
            <View key={uri + i} style={styles.thumbWrap}>
              <Image source={{ uri }} style={styles.thumb} />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeImage(i)}
              >
                <Ionicons name="close-circle" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Tipo */}
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[
              styles.typeBtn,
              type === "venta" ? styles.typeBtnActive : undefined,
            ]}
            onPress={() => setType("venta")}
          >
            <Text
              style={[
                styles.typeTxt,
                type === "venta" ? styles.typeTxtActive : undefined,
              ]}
            >
              Venta
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeBtn,
              type === "intercambio" ? styles.typeBtnActive : undefined,
            ]}
            onPress={() => setType("intercambio")}
          >
            <Text
              style={[
                styles.typeTxt,
                type === "intercambio" ? styles.typeTxtActive : undefined,
              ]}
            >
              Intercambio
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeBtn,
              type === "donacion" ? styles.typeBtnActive : undefined,
            ]}
            onPress={() => setType("donacion")}
          >
            <Text
              style={[
                styles.typeTxt,
                type === "donacion" ? styles.typeTxtActive : undefined,
              ]}
            >
              Donacion
            </Text>
          </TouchableOpacity>
        </View>

        {/* Nombre */}
        <View style={styles.field}>
          <Text style={styles.label}>Nombre del producto</Text>
          <TextInput
            style={styles.input}
            placeholder="Sofá moderno gris"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Ubicación */}
        <View style={styles.field}>
          <Text style={styles.label}>Ubicación</Text>
          <TextInput
            style={styles.input}
            placeholder="Bogotá, Cundinamarca, Colombia"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Descripción */}
        <View style={styles.field}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Describe tu producto..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Precio */}
        {type === "venta" && (
          <View style={styles.field}>
            <Text style={styles.label}>Precio</Text>
            <TextInput
              style={styles.input}
              placeholder="$0"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>
        )}

        {/* Botón agregar */}
        <View
          style={{ paddingHorizontal: 16, marginTop: 20, marginBottom: 40 }}
        >
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSave}
            disabled={submitting}
          >
            <Text style={styles.submitTxt}>
              {submitting ? "Enviando..." : "Agregar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 120,
    backgroundColor: "#fff",
  },
  headerImageWrap: {
    backgroundColor: "#f6f6f6",
  },
  headerImage: {
    width: "100%",
    height: 240,
  },
  headerPlaceholder: {
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { color: "#888", marginTop: 8 },
  galleryScroll: { padding: 10 },
  galleryButton: {
    height: 64,
    width: 64,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e6e6e6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  galleryLabel: { fontSize: 11, color: "#666", marginTop: 4 },
  thumbWrap: { marginRight: 10, position: "relative" },
  thumb: { height: 64, width: 64, borderRadius: 8 },
  removeBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 2,
  },
  typeRow: {
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  typeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#f3f4f6",
  },
  typeBtnActive: { backgroundColor: "#5D8370" },
  typeTxt: { color: "#6b7280", fontWeight: "600" },
  typeTxtActive: { color: "#fff" },
  field: { paddingHorizontal: 16, marginTop: 12 },
  label: { color: "#6b7280", marginBottom: 6 },
  input: {
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ececec",
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
  },
  textarea: { minHeight: 100 },
  submitBtn: {
    backgroundColor: "#5D8370",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  submitTxt: { color: "#fff", fontWeight: "700", fontSize: 16 },
});

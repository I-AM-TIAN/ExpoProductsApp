import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProductMessageCardProps {
  productId: string;
  productName: string;
  productImage?: string;
  isOwn?: boolean;
}

export const ProductMessageCard = ({
  productId,
  productName,
  productImage,
  isOwn = false,
}: ProductMessageCardProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/product/${productId}` as any);
  };

  return (
    <View style={[styles.container, isOwn ? styles.ownContainer : styles.otherContainer]}>
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {/* Imagen del producto */}
        {productImage && typeof productImage === 'string' && productImage.length > 0 && !productImage.startsWith('file:///') ? (
          <Image
            source={{ uri: productImage }}
            style={styles.productImage}
            resizeMode="cover"
            onError={(error) => {
              console.log('❌ Error cargando imagen:', productImage, error.nativeEvent);
            }}
            onLoad={() => {
              console.log('✅ Imagen cargada correctamente:', productImage);
            }}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="image-outline" size={40} color="#9CA3AF" />
            <Text style={styles.placeholderText}>Sin imagen</Text>
          </View>
        )}

        {/* Contenido */}
        <View style={styles.content}>
          <Text style={styles.label}>PRODUCTO DE INTERÉS</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {productName}
          </Text>
          
          <View style={styles.footer}>
            <Ionicons name="arrow-forward-circle-outline" size={18} color="#4F7942" />
            <Text style={styles.linkText}>Ver producto</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Mensaje de texto */}
      <View style={[styles.messageBubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        <Text style={[styles.messageText, isOwn ? styles.ownText : styles.otherText]}>
          Hola, estoy interesado en este producto 👋
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    maxWidth: '80%',
  },
  ownContainer: {
    alignSelf: 'flex-end',
    marginRight: 16,
  },
  otherContainer: {
    alignSelf: 'flex-start',
    marginLeft: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#F3F4F6',
  },
  placeholderImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  content: {
    padding: 12,
  },
  label: {
    fontSize: 11,
    color: '#6B7280',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  linkText: {
    fontSize: 13,
    color: '#4F7942',
    fontWeight: '600',
  },
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: '100%',
  },
  ownBubble: {
    backgroundColor: '#4F7942',
  },
  otherBubble: {
    backgroundColor: '#F3F4F6',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  ownText: {
    color: '#FFFFFF',
  },
  otherText: {
    color: '#1F2937',
  },
});

import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";

interface Pops {
  images: string[];
}

const { width: screenWidth } = Dimensions.get("window");

const ProductImages = ({ images }: Pops) => {
  if (images.length === 0) {
    return (
      <View style={styles.container}>
        <Image
          source={require("../../../assets/images/no-product-image.png")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <FlatList
      data={images}
      keyExtractor={(item, index) => `${item}-${index}`}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: 300,
    backgroundColor: "#F3F4F6",
  },
  imageContainer: {
    width: screenWidth,
    height: 300,
    backgroundColor: "#F3F4F6",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ProductImages;

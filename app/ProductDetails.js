import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { COLORS, SHADOWS } from '../constants/theme';

const ProductDetails = () => {
  const router = useRouter();
  const { product } = useLocalSearchParams();
  let parsedProduct = null;

  if (product) {
    try {
      parsedProduct = JSON.parse(decodeURIComponent(product));
    } catch (e) {
      console.error('Error parsing product data:', e);
    }
  }

  if (!parsedProduct) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product data not available</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header with Back Button */}
        <View style={styles.header}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                <Text style={styles.icon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Product Details</Text>
            <View style={{ width: 40 }} /> 
        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: parsedProduct.imageUrl || 'https://via.placeholder.com/300' }} 
            style={styles.productImage} 
          />
        </View>

        {/* Product Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{parsedProduct.name || parsedProduct.productName}</Text>
            <Text style={styles.productPrice}>₹{parsedProduct.price}</Text>
          </View>
          
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{parsedProduct.category || 'General'}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {parsedProduct.description || 'No description provided for this product.'}
          </Text>

          <View style={styles.specsContainer}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Stock Status</Text>
              <Text style={[
                styles.specValue, 
                { color: (parsedProduct.quantity || parsedProduct.stockQuantity) > 0 ? COLORS.success : COLORS.error }
              ]}>
                {(parsedProduct.quantity || parsedProduct.stockQuantity) > 0 ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Available Qty</Text>
              <Text style={styles.specValue}>{parsedProduct.quantity || parsedProduct.stockQuantity || 0}</Text>
            </View>
            {parsedProduct.sku ? (
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>SKU / Code</Text>
                <Text style={styles.specValue}>{parsedProduct.sku}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Shop Info Section */}
        <View style={styles.shopSection}>
          <Text style={styles.sectionTitle}>Available At</Text>
          <View style={styles.shopCard}>
            <Text style={styles.shopIcon}>🏪</Text>
            <View style={styles.shopInfoText}>
              <Text style={styles.shopName}>This Shop</Text>
              <Text style={styles.shopLocation}>
                📍 {parsedProduct.shopLocation || 'Dukan ki location'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Contact Shopkeeper</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: verticalScale(100),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
    backgroundColor: 'white',
    ...SHADOWS.small,
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  imageContainer: {
    width: '100%',
    height: verticalScale(300),
    backgroundColor: 'white',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  infoCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: moderateScale(30),
    borderTopRightRadius: moderateScale(30),
    marginTop: -verticalScale(30),
    padding: scale(25),
    ...SHADOWS.medium,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(10),
  },
  productName: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    marginRight: scale(10),
  },
  productPrice: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  categoryBadge: {
    backgroundColor: COLORS.secondary + '20',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(20),
    alignSelf: 'flex-start',
    marginBottom: verticalScale(20),
  },
  categoryText: {
    color: COLORS.secondary,
    fontWeight: 'bold',
    fontSize: moderateScale(12),
  },
  divider: {
    height:1,
    backgroundColor: COLORS.border,
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: verticalScale(10),
  },
  description: {
    fontSize: moderateScale(15),
    color: COLORS.textLight,
    lineHeight: verticalScale(22),
    marginBottom: verticalScale(25),
  },
  specsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(10),
  },
  specItem: {
    width: '45%',
    backgroundColor: '#F7FAFC',
    padding: scale(12),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  specLabel: {
    fontSize: moderateScale(12),
    color: COLORS.textLight,
    marginBottom: verticalScale(4),
  },
  specValue: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  shopSection: {
    padding: scale(25),
  },
  shopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: scale(15),
    borderRadius: moderateScale(15),
    ...SHADOWS.small,
  },
  shopIcon: {
    fontSize: moderateScale(30),
    marginRight: scale(15),
  },
  shopInfoText: {
    flex: 1,
  },
  shopName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  shopLocation: {
    fontSize: moderateScale(14),
    color: COLORS.textLight,
    marginTop: verticalScale(2),
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: scale(20),
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  buyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(15),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    ...SHADOWS.small,
  },
  buyButtonText: {
    color: 'white',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  errorText: {
    fontSize: moderateScale(18),
    color: COLORS.error,
    marginBottom: verticalScale(20),
  },
  backButton: {
    padding: scale(10),
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(5),
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default ProductDetails;

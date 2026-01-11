import { getShopProducts } from '@/Services/productService';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { COLORS, SHADOWS } from '../constants/theme';

const MyProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      // In a real app, we would get the shop ID from context or navigation params
      const shopId = 'demo-shop-id';
      const response = await getShopProducts(shopId);
      setProducts(response);
    } catch (error) {
      console.error('Error loading products:', error);
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => router.push(`/ProductDetails?product=${encodeURIComponent(JSON.stringify(item))}`)}
    >
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
      </View>
      <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>
      <View style={styles.productFooter}>
        <Text style={styles.productQuantity}>Qty: {item.quantity || 0}</Text>
        <Text style={[
          styles.productStatus, 
          { color: item.quantity > 0 ? COLORS.success : COLORS.error }
        ]}>
          {item.quantity > 0 ? 'In Stock' : 'Out of Stock'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading your products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Products</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/AddProduct')}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>
      
      {products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id || Math.random().toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products yet</Text>
          <Text style={styles.emptySubtext}>Add your first product to get started</Text>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/AddProduct')}
          >
            <Text style={styles.primaryButtonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: verticalScale(10),
    fontSize: moderateScale(16),
    color: COLORS.textLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(15),
    backgroundColor: 'white',
    ...SHADOWS.small,
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(14),
  },
  listContainer: {
    padding: scale(20),
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: moderateScale(12),
    padding: scale(15),
    marginBottom: verticalScale(15),
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(5),
  },
  productName: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  productPrice: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  productDescription: {
    fontSize: moderateScale(14),
    color: COLORS.textLight,
    marginBottom: verticalScale(8),
  },
  locationContainer: {
    marginBottom: verticalScale(8),
    padding: verticalScale(6),
    backgroundColor: '#F0F4F8',
    borderRadius: moderateScale(6),
  },
  locationText: {
    fontSize: moderateScale(12),
    color: COLORS.textLight,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(5),
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: verticalScale(8),
  },
  productQuantity: {
    fontSize: moderateScale(12),
    color: COLORS.text,
    fontWeight: '500',
  },
  productStatus: {
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  emptyText: {
    fontSize: moderateScale(18),
    color: COLORS.textLight,
    fontWeight: 'bold',
    marginBottom: verticalScale(5),
  },
  emptySubtext: {
    fontSize: moderateScale(14),
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
    ...SHADOWS.small,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MyProducts;
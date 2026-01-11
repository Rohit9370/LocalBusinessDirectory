import { getNearbyShops } from '@/Services/productService';
import LeafletMap from '@/components/LeafletMap';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { COLORS } from '../constants/theme';

const NearbyShops = () => {
  const router = useRouter();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      loadNearbyShops(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const loadNearbyShops = async (lat, lng) => {
    try {
      const nearbyShops = await getNearbyShops(lat, lng);
      setShops(nearbyShops);
    } catch (error) {
      console.error('Error loading nearby shops:', error);
      Alert.alert('Error', 'Failed to load nearby shops');
    } finally {
      setLoading(false);
    }
  };

  const renderShopItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.shopCard}
      onPress={() => router.push(`/ShopDetails?shop=${encodeURIComponent(JSON.stringify(item))}`)}
    >
      <View style={styles.shopHeader}>
        <Text style={styles.shopName}>{item.name || 'Unnamed Shop'}</Text>
        <Text style={styles.distance}>{item.distance ? `${item.distance.toFixed(2)} km` : 'Distance unknown'}</Text>
      </View>
      <Text style={styles.shopOwner}>{item.ownerName || 'Shop Owner'}</Text>
      <Text style={styles.shopAddress}>{item.location?.address || 'Address not available'}</Text>
      <View style={styles.shopFooter}>
        <Text style={styles.shopPhone}>{item.phone || 'Phone not available'}</Text>
        <Text style={styles.shopType}>{item.type || 'General Store'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Finding nearby shops...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setErrorMsg(null);
              (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                  let location = await Location.getCurrentPositionAsync({});
                  setLocation(location);
                  loadNearbyShops(location.coords.latitude, location.coords.longitude);
                } else {
                  setErrorMsg('Permission to access location was denied');
                  setLoading(false);
                }
              })();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Nearby Shops</Text>
            <Text style={styles.headerSubtitle}>Within 3 km radius</Text>
          </View>
          <TouchableOpacity 
            style={styles.mapToggleButton}
            onPress={() => setShowMap(!showMap)}
          >
            <Text style={styles.mapToggleText}>{showMap ? 'List View' : 'Map View'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {showMap && location ? (
        <View style={styles.mapContainer}>
          <LeafletMap 
            latitude={location.coords.latitude}
            longitude={location.coords.longitude}
            markers={shops.map(shop => ({
              latitude: shop.location?.latitude,
              longitude: shop.location?.longitude,
              name: shop.name,
              address: shop.location?.address,
              ...shop
            }))}
            height={verticalScale(500)}
            onMarkerClick={(shop) => {
              router.push(`/ShopDetails?shop=${encodeURIComponent(JSON.stringify(shop))}`);
            }}
          />
        </View>
      ) : (
        shops.length > 0 ? (
          <FlatList
            data={shops}
            renderItem={renderShopItem}
            keyExtractor={(item) => item.id || Math.random().toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No shops found nearby</Text>
            <Text style={styles.emptySubtext}>Try moving to an area with more shops</Text>
          </View>
        )
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: scale(20),
  },
  errorText: {
    fontSize: moderateScale(16),
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(8),
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: verticalScale(10),
    fontSize: moderateScale(16),
    color: COLORS.textLight,
  },
  header: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(10),
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: moderateScale(16),
    color: COLORS.textLight,
    marginTop: verticalScale(5),
  },
  mapToggleButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
  },
  mapToggleText: {
    color: 'white',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
  },
  listContainer: {
    padding: scale(20),
  },
  shopCard: {
    backgroundColor: 'white',
    borderRadius: moderateScale(12),
    padding: scale(15),
    marginBottom: verticalScale(15),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(5),
  },
  shopName: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  distance: {
    fontSize: moderateScale(14),
    color: COLORS.primary,
    fontWeight: '600',
  },
  shopOwner: {
    fontSize: moderateScale(14),
    color: COLORS.textLight,
    marginBottom: verticalScale(5),
  },
  shopAddress: {
    fontSize: moderateScale(14),
    color: COLORS.textLight,
    marginBottom: verticalScale(8),
  },
  shopFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(5),
  },
  shopPhone: {
    fontSize: moderateScale(12),
    color: COLORS.textLight,
  },
  shopType: {
    fontSize: moderateScale(12),
    color: COLORS.secondary,
    fontWeight: '600',
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
  },
});

export default NearbyShops;
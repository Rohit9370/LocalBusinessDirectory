import { useLocalSearchParams } from 'expo-router';
import {
    Alert,
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { COLORS } from '../constants/theme';

const ShopDetails = () => {
  const { shop } = useLocalSearchParams();
  let parsedShop = null;
  
  // Parse the shop data passed from NearbyShops screen
  if (shop) {
    try {
      parsedShop = JSON.parse(decodeURIComponent(shop));
    } catch (e) {
      console.error('Error parsing shop data:', e);
    }
  }

  const handleCall = (phone) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleDirection = (lat, lng) => {
    if (lat && lng) {
      const url = `geo:${lat},${lng}`;
      Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Location coordinates are not available for this shop');
    }
  };

  if (!parsedShop) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Shop data not available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Image 
            source={{ uri: parsedShop.imageUrl || 'https://via.placeholder.com/300x200' }} 
            style={styles.shopImage} 
          />
          <View style={styles.shopInfo}>
            <Text style={styles.shopName}>{parsedShop.name || 'Shop Name'}</Text>
            <Text style={styles.shopOwner}>{parsedShop.ownerName || 'Shop Owner'}</Text>
            <Text style={styles.shopType}>{parsedShop.type || 'General Store'}</Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <TouchableOpacity onPress={() => handleCall(parsedShop.phone)}>
              <Text style={styles.infoValue}>{parsedShop.phone || 'Not available'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{parsedShop.email || 'Not available'}</Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.address}>{parsedShop.location?.address || 'Address not available'}</Text>
          {parsedShop.location?.latitude && parsedShop.location?.longitude ? (
            <TouchableOpacity 
              style={styles.directionButton}
              onPress={() => handleDirection(parsedShop.location.latitude, parsedShop.location.longitude)}
            >
              <Text style={styles.directionButtonText}>Get Directions</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.noLocationText}>Location coordinates not available</Text>
          )}
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Distance</Text>
          <Text style={styles.distance}>
            {parsedShop.distance ? `${parsedShop.distance.toFixed(2)} km away` : 'Distance unknown'}
          </Text>
        </View>

        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Popular Items</Text>
          {parsedShop.popularItems && parsedShop.popularItems.length > 0 ? (
            <View style={styles.itemsContainer}>
              {parsedShop.popularItems.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.itemRow}
                  onPress={() => router.push({
                    pathname: '/ProductDetails',
                    params: { 
                      product: JSON.stringify({
                        ...item,
                        shopLocation: parsedShop.location?.address || 'Shop Location'
                      }) 
                    }
                  })}
                >
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.noItems}>No items listed yet</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: scale(20),
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
    textAlign: 'center',
  },
  header: {
    backgroundColor: 'white',
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(20),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shopImage: {
    width: '100%',
    height: verticalScale(200),
  },
  shopInfo: {
    padding: scale(15),
  },
  shopName: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: verticalScale(5),
  },
  shopOwner: {
    fontSize: moderateScale(16),
    color: COLORS.textLight,
    marginBottom: verticalScale(5),
  },
  shopType: {
    fontSize: moderateScale(14),
    color: COLORS.secondary,
    fontWeight: '600',
  },
  detailsSection: {
    backgroundColor: 'white',
    borderRadius: moderateScale(12),
    padding: scale(15),
    marginBottom: verticalScale(15),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: verticalScale(10),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  infoLabel: {
    fontSize: moderateScale(16),
    color: COLORS.textLight,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: moderateScale(16),
    color: COLORS.primary,
  },
  address: {
    fontSize: moderateScale(16),
    color: COLORS.textLight,
    lineHeight: verticalScale(22),
  },
  directionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(15),
    borderRadius: moderateScale(8),
    alignSelf: 'flex-start',
    marginTop: verticalScale(10),
  },
  directionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noLocationText: {
    fontSize: moderateScale(14),
    color: COLORS.placeholder,
    fontStyle: 'italic',
    marginTop: verticalScale(10),
  },
  distance: {
    fontSize: moderateScale(16),
    color: COLORS.textLight,
  },
  productsSection: {
    backgroundColor: 'white',
    borderRadius: moderateScale(12),
    padding: scale(15),
    marginBottom: verticalScale(15),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemsContainer: {
    marginTop: verticalScale(10),
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemName: {
    fontSize: moderateScale(16),
    color: COLORS.text,
  },
  itemPrice: {
    fontSize: moderateScale(16),
    color: COLORS.secondary,
    fontWeight: '600',
  },
  noItems: {
    fontSize: moderateScale(16),
    color: COLORS.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: verticalScale(20),
  },
});

export default ShopDetails;
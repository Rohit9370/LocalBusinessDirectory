import { shopkeeperRegister } from '@/Services/authservice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { COLORS } from '../constants/theme';
import MapSearch from '../src/components/MapSearch';

const ShopkeeperRegister = () => {
  const router = useRouter();
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [locationText, setLocationText] = useState('');
  const [locationCoords, setLocationCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  // Product details state
  const [products, setProducts] = useState([{ name: '', price: '', quantity: '', description: '' }]);

  // Function to handle location selection from map
  const handleLocationSelect = async (location) => {
    const { lat, lng } = location;
    
    // Reverse geocode to get address
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (reverseGeocode && reverseGeocode.length > 0) {
        const address = `${reverseGeocode[0].name || ''} ${reverseGeocode[0].street || ''}, ${reverseGeocode[0].city || ''}, ${reverseGeocode[0].region || ''}, ${reverseGeocode[0].postalCode || ''}`.trim();
        setLocationText(address);
      } else {
        setLocationText(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      setLocationText(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
    }
    
    setLocationCoords({
      latitude: lat,
      longitude: lng
    });
  };

  // Functions to manage products
  const addProduct = () => {
    setProducts([...products, { name: '', price: '', quantity: '', description: '' }]);
  };

  const removeProduct = (index) => {
    if (products.length > 1) {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setProducts(newProducts);
    }
  };

  const updateProduct = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const handleGetCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Reverse geocode to get address
      const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (reverseGeocode && reverseGeocode.length > 0) {
        const address = `${reverseGeocode[0].name || ''} ${reverseGeocode[0].street || ''}, ${reverseGeocode[0].city || ''}, ${reverseGeocode[0].region || ''}, ${reverseGeocode[0].postalCode || ''}`.trim();
        setLocationText(address);
        setLocationCoords({ latitude, longitude });
      } else {
        setLocationText(`Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`);
        setLocationCoords({ latitude, longitude });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Could not retrieve current location');
    }
  };

  const handleRegister = async () => {
    if (!shopName || !ownerName || !email || !phone || !password || !confirmPassword || !locationText) {
      Alert.alert('Error', 'Please fill all fields including location');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!locationCoords) {
      Alert.alert('Error', 'Please select a location');
      return;
    }

    // Validate products if any are added
    const validProducts = products.filter(product => product.name && product.price);
    if (validProducts.length === 0) {
      Alert.alert('Error', 'Please add at least one product');
      return;
    }

    setLoading(true);
    try {
      const data = await shopkeeperRegister(
        shopName, 
        ownerName, 
        email, 
        phone, 
        password, 
        {
          address: locationText,
          latitude: locationCoords.latitude,
          longitude: locationCoords.longitude,
          products: validProducts // Include products in registration
        }
      );
      if (data.success) {
        // Save token and user type to AsyncStorage if available
        if (data.token) {
          await AsyncStorage.setItem('token', data.token);
          await AsyncStorage.setItem('userType', 'shopkeeper');
        }
        
        Alert.alert('Success', 'Registration successful! Wait for admin approval.', [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]);
      }
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContainer}>
          {/* Header Section - Matches Login Style */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>Sign Up</Text>
            </View>
            <Text style={styles.welcomeText}>Register Shop</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Create your shop profile</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Shop Name</Text>
                <TextInput
                  style={styles.input}
                  value={shopName}
                  onChangeText={setShopName}
                  placeholder="Enter shop name"
                  placeholderTextColor={COLORS.placeholder}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Owner Name</Text>
                <TextInput
                  style={styles.input}
                  value={ownerName}
                  onChangeText={setOwnerName}
                  placeholder="Enter owner name"
                  placeholderTextColor={COLORS.placeholder}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter phone number"
                  placeholderTextColor={COLORS.placeholder}
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Location *</Text>
                <TextInput
                  style={[styles.input, styles.locationInput]}
                  value={locationText}
                  editable={false}
                  placeholder="Use button or map below"
                  placeholderTextColor={COLORS.placeholder}
                />
                <TouchableOpacity 
                  style={styles.getLocationButton}
                  onPress={handleGetCurrentLocation}
                >
                  <Text style={styles.getLocationButtonText}>📍 Get Current Location</Text>
                </TouchableOpacity>
              </View>

               {/* Map for manual selection */}
               <View style={styles.mapContainer}>
                  <Text style={styles.label}>Or pick on map:</Text>
                  <MapSearch onLocationSelect={handleLocationSelect} /> 
               </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  placeholderTextColor={COLORS.placeholder}
                  secureTextEntry
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  placeholderTextColor={COLORS.placeholder}
                  secureTextEntry
                />
              </View>
              
              {/* Product Details Section */}
              <Text style={styles.sectionTitle}>Initial Products</Text>
              <Text style={styles.sectionSubtitle}>Add your shop's initial products</Text>
              
              {products.map((product, index) => (
                <View key={index} style={styles.productContainer}>
                  <View style={styles.productHeader}>
                    <Text style={styles.productNumber}>Product {index + 1}</Text>
                    {products.length > 1 && (
                      <TouchableOpacity onPress={() => removeProduct(index)} style={styles.removeProductButton}>
                        <Text style={styles.removeProductText}>Remove</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  <View style={styles.productRow}>
                    <View style={styles.halfInputContainer}>
                      <Text style={styles.label}>Product Name</Text>
                      <TextInput
                        style={styles.input}
                        value={product.name}
                        onChangeText={(value) => updateProduct(index, 'name', value)}
                        placeholder="Enter product name"
                        placeholderTextColor={COLORS.placeholder}
                      />
                    </View>
                    
                    <View style={styles.halfInputContainer}>
                      <Text style={styles.label}>Price (₹)</Text>
                      <TextInput
                        style={styles.input}
                        value={product.price}
                        onChangeText={(value) => updateProduct(index, 'price', value)}
                        placeholder="0.00"
                        placeholderTextColor={COLORS.placeholder}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  
                  <View style={styles.productRow}>
                    <View style={styles.halfInputContainer}>
                      <Text style={styles.label}>Quantity</Text>
                      <TextInput
                        style={styles.input}
                        value={product.quantity}
                        onChangeText={(value) => updateProduct(index, 'quantity', value)}
                        placeholder="0"
                        placeholderTextColor={COLORS.placeholder}
                        keyboardType="numeric"
                      />
                    </View>
                    
                    <View style={styles.halfInputContainer}>
                      <Text style={styles.label}>Category</Text>
                      <TextInput
                        style={styles.input}
                        value={product.category || ''}
                        onChangeText={(value) => updateProduct(index, 'category', value)}
                        placeholder="e.g., Grocery"
                        placeholderTextColor={COLORS.placeholder}
                      />
                    </View>
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                      style={[styles.input, styles.descriptionInput]}
                      value={product.description}
                      onChangeText={(value) => updateProduct(index, 'description', value)}
                      placeholder="Product description"
                      placeholderTextColor={COLORS.placeholder}
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </View>
              ))}
              
              <TouchableOpacity style={styles.addButton} onPress={addProduct}>
                <Text style={styles.addButtonText}>+ Add Another Product</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.registerButton} 
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.registerButtonText}>
                  {loading ? 'Registering...' : 'Complete Registration'}
                </Text>
              </TouchableOpacity>

              <View style={styles.loginOptionsContainer}>
                <TouchableOpacity 
                  style={styles.loginLink}
                  onPress={() => router.back()}
                >
                  <Text style={styles.loginText}>
                    Already have an account? <Text style={styles.loginLinkText}>Login here</Text>
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.dualLoginLink}
                  onPress={() => router.push('/DualLogin')}
                >
                  <Text style={styles.dualLoginText}>
                    Switch to <Text style={styles.dualLoginLinkText}>Dual Login</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  headerSection: {
    padding: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(120),
    backgroundColor: COLORS.background,
  },
  logoContainer: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(8),
    backgroundColor: COLORS.secondary,
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
    elevation: 3,
  },
  logoText: {
    color: 'white',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  formSection: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: moderateScale(30),
    borderTopRightRadius: moderateScale(30),
    padding: scale(20),
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(20),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: verticalScale(15),
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: verticalScale(8),
    marginLeft: scale(4),
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: moderateScale(12),
    padding: moderateScale(15),
    fontSize: moderateScale(16),
    backgroundColor: '#FAFAFA',
    color: COLORS.text,
  },
  locationInput: {
    marginBottom: verticalScale(10),
    backgroundColor: '#F0F4F8',
  },
  getLocationButton: {
    backgroundColor: COLORS.success,
    padding: verticalScale(12),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  getLocationButtonText: {
    color: 'white',
    fontSize: moderateScale(15),
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    padding: verticalScale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginTop: verticalScale(15),
    marginBottom: verticalScale(15),
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  registerButtonText: {
    color: 'white',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  loginOptionsContainer: {
    alignItems: 'center',
    gap: verticalScale(10),
  },
  loginLink: {
    alignItems: 'center',
    padding: verticalScale(10),
  },
  loginText: {
    color: COLORS.textLight,
    fontSize: moderateScale(15),
  },
  loginLinkText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  dualLoginLink: {
    alignItems: 'center',
    padding: verticalScale(5),
  },
  dualLoginText: {
    color: COLORS.textLight,
    fontSize: moderateScale(14),
  },
  dualLoginLinkText: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: verticalScale(20),
    marginBottom: verticalScale(5),
  },
  sectionSubtitle: {
    fontSize: moderateScale(14),
    color: COLORS.textLight,
    marginBottom: verticalScale(15),
    marginLeft: scale(4),
  },
  productContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: moderateScale(12),
    padding: scale(15),
    marginBottom: verticalScale(15),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  productNumber: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  removeProductButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(6),
  },
  removeProductText: {
    color: 'white',
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(15),
  },
  halfInputContainer: {
    width: '48%',
  },
  descriptionInput: {
    height: verticalScale(80),
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: COLORS.success,
    padding: verticalScale(12),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  addButtonText: {
    color: 'white',
    fontSize: moderateScale(15),
    fontWeight: 'bold',
  },
  mapContainer: {
    marginBottom: verticalScale(15),
  }
});

export default ShopkeeperRegister;
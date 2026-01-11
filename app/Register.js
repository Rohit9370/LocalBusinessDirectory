import { setAuthToken } from '@/Services/api';
import { register } from '@/Services/authservice';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
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
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const CATEGORIES = [
  "Grocery",
  "Food & Restaurant",
  "Clothing & Fashion",
  "Electronics & Mobile",
  "Health & Pharmacy",
  "Beauty & Salon",
  "Hardware & Tools",
  "Automobile",
  "Home & Furniture",
  "Education & Stationery",
  "Repair & Services",
  "Pet & Animal Care",
  "Travel & Transport",
  "Gifts & Lifestyle",
  "Other"
];

const Register = () => {
 
  const router = useRouter();
  const [form, setForm] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    phone: '',
    category: '',
    customType: '',
    locationString: '',
    latitude: null,
    longitude: null,
    password: '',
    confirmPassword: ''
  });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const handleRegister = async () => {
    const { shopName, ownerName, email, phone, password, confirmPassword, category, customType, locationString } = form;
    
    if (!shopName || !ownerName || !email || !phone || !password || !confirmPassword || !category || !locationString) {
      setError('Please fill all required fields');
      setShowError(true);
      return;
    }

    if (category === 'Other' && !customType) {
      setError('Please specify your shop type');
      setShowError(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      const finalType = category === 'Other' ? customType : category;
      const data = await register(ownerName, email, form.phone, password, { 
        shopName, 
        location: form.locationString,
        type: finalType 
      });
      if (data.token) {
        setAuthToken(data.token);
        router.replace('/HomeScreen');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        setShowError(true);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Get address string
      const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      let address = '';
      if (reverseGeocode && reverseGeocode.length > 0) {
        const item = reverseGeocode[0];
        address = `${item.name || ''} ${item.street || ''}, ${item.city || ''}, ${item.region || ''}`.trim();
      } else {
        address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }

      setForm({
        ...form,
        latitude,
        longitude,
        locationString: address
      });
    } catch (err) {
      setError('Failed to get location');
      setShowError(true);
    } finally {
      setLocationLoading(false);
    }
  };

  const updateForm = (key, value) => setForm({ ...form, [key]: value });

  const mapHtml = (lat, lng) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <style>
          #map { height: 100vh; width: 100vw; margin: 0; padding: 0; }
          body { margin: 0; padding: 0; overflow: hidden; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <script>
          var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([${lat}, ${lng}], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
          L.marker([${lat}, ${lng}]).addTo(map);
        </script>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ErrorMessage message={error} visible={showError} onDismiss={() => setShowError(false)} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Top Header Design */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
               <Image
                source={require('./assets/images/mobile_10101166.png')}
                style={styles.logo}
                contentFit="contain"
              />
            </View>
            <Text style={styles.welcomeTitle}>Create Account</Text>
            <Text style={styles.subtitle}>Fill in the details to register your shop</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formCard}>
            <InputField 
              label="Shop Name *" 
              placeholder="Modern Bakery" 
              value={form.shopName}
              onChangeText={(v) => updateForm('shopName', v)} 
            />
            <InputField 
              label="Owner Name *" 
              placeholder="John Doe" 
              value={form.ownerName}
              onChangeText={(v) => updateForm('ownerName', v)} 
            />
            <InputField 
              label="Email Address *" 
              placeholder="example@mail.com" 
              keyboardType="email-address"
              value={form.email}
              onChangeText={(v) => updateForm('email', v)} 
            />
            <InputField 
              label="Phone Number *" 
              placeholder="+91 00000 00000" 
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(v) => updateForm('phone', v)} 
            />

            {/* Category Picker */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Shop Category *</Text>
              <TouchableOpacity 
                style={styles.pickerButton}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={[styles.pickerButtonText, !form.category && { color: '#A0A0A0' }]}>
                  {form.category || "Select Category"}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
            </View>

            {form.category === 'Other' && (
              <InputField 
                label="Specify Type" 
                placeholder="Enter your shop type" 
                value={form.customType}
                onChangeText={(v) => updateForm('customType', v)} 
              />
            )}

            {/* Location Section */}
            <View style={styles.locationContainer}>
              <View style={styles.locationHeader}>
                <Text style={styles.inputLabel}>Shop Location *</Text>
                <TouchableOpacity 
                   style={styles.circleButton}
                   onPress={getCurrentLocation}
                   disabled={locationLoading}
                >
                  {locationLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.circleButtonText}>📍</Text>
                  )}
                </TouchableOpacity>
              </View>
              
              <TextInput 
                numberOfLines={4}
                style={[styles.textInput, { backgroundColor: '#F0F0F0', height: 80, textAlignVertical: 'top' }]} 
                placeholder="Click the icon to get location"
                value={form.locationString}
                editable={false}
                placeholderTextColor="#A0A0A0"
                multiline
              />

              {form.latitude && form.longitude && (
                <View style={styles.mapWrapper}>
                  <WebView
                    originWhitelist={['*']}
                    source={{ html: mapHtml(form.latitude, form.longitude) }}
                    style={styles.map}
                    scrollEnabled={false}
                  />
                </View>
              )}
            </View>

            <InputField 
              label="Password *" 
              placeholder="••••••••" 
              secureTextEntry 
              value={form.password}
              onChangeText={(v) => updateForm('password', v)} 
            />
            <InputField 
              label="Confirm Password *" 
              placeholder="••••••••" 
              secureTextEntry 
              value={form.confirmPassword}
              onChangeText={(v) => updateForm('confirmPassword', v)} 
            />

            <TouchableOpacity 
              style={[styles.primaryButton, loading && { opacity: 0.7 }]} 
              onPress={handleRegister}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Register'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.footerLink}
              onPress={() => router.push('/Login')}
            >
              <Text style={styles.footerText}>
                Already have an account? <Text style={styles.linkText}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.categoryOption}
                  onPress={() => {
                    updateForm('category', item);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={[
                     styles.categoryText,
                     form.category === item && styles.selectedCategoryText
                  ]}>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Reusable Input Component
const InputField = ({ label, ...props }) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput 
      style={styles.textInput} 
      placeholderTextColor="#A0A0A0"
      {...props} 
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerSection: {
    paddingTop: 40,
    paddingHorizontal: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#FFF0F6',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: "#ff69b4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    width: 50,
    height: 50,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7C7C7C',
    marginTop: 5,
    textAlign: 'center',
  },
  formCard: {
    paddingHorizontal: 25,
  },
  inputWrapper: {
    marginBottom: 18,
  },
  locationContainer: {
    marginBottom: 18,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  circleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ff69b4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  circleButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginLeft: 4,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 15 : 12,
    fontSize: 16,
    color: '#1A1A1A',
  },
  pickerButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 15 : 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#7C7C7C',
  },
  mapWrapper: {
    height: 220,
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  map: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#ff69b4',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: "#ff69b4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  footerLink: {
    marginTop: 25,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: '#666',
  },
  linkText: {
    color: '#ff69b4',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: height * 0.7,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  closeButton: {
    fontSize: 20,
    color: '#666',
    padding: 5,
  },
  categoryOption: {
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  categoryText: {
    fontSize: 16,
    color: '#444',
  },
  selectedCategoryText: {
    color: '#ff69b4',
    fontWeight: '700',
  },
});

export default Register;

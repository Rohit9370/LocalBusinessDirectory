import { addProduct, uploadImage } from '@/Services/productService';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ErrorMessage } from '../components/ErrorMessage';

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { COLORS, SHADOWS } from '../constants/theme';

const AddProduct = () => {
  const router = useRouter();
  const { shopId } = useLocalSearchParams(); // Get shopId from route parameters
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [sku, setSku] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  // Image picker state
  const [image, setImage] = useState(null);

  // Function to pick image from camera or gallery
  const pickImage = async () => {
    // Request media library permissions
    const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (mediaLibraryStatus !== 'granted') {
      alert('Sorry, we need media library permissions to make this work!');
      return;
    }
    
    // Request camera permissions
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }
    
    // Show options to pick from camera or gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // Update imageUrl field with the selected image
      setImageUrl(result.assets[0].uri);
    }
  };
  
  // Function to take picture with camera
  const takePicture = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // Update imageUrl field with the captured image
      setImageUrl(result.assets[0].uri);
    }
  };
  
  const handleAddProduct = async () => {
    if (!productName || !price) {
      setError('Please enter product name and price');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = 'https://via.placeholder.com/150';
      
      // If there's an image, upload it to Appwrite storage first
      if (image) {
        finalImageUrl = await uploadImage(image);
      } else if (imageUrl) {
        finalImageUrl = imageUrl;
      }
      
      const productData = {
        name: productName, // This will be mapped to productName in the service
        description: productDescription,
        price: parseFloat(price),
        quantity: parseInt(quantity) || 0,
        imageUrl: finalImageUrl,
        category: category || 'General',
        sku: sku || '',
        stockQuantity: parseInt(quantity) || 0 // Map quantity to stockQuantity
      };

      // Use shopId from route parameters
      const actualShopId = shopId || 'current-shop-id'; // Fallback to placeholder if not provided
      await addProduct(actualShopId, productData);
      
      router.back();
    } catch (error) {
      setError(error.message || 'Failed to add product');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ErrorMessage
        message={error}
        visible={showError}
        onDismiss={() => setShowError(false)}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.mainContainer, !isTablet && styles.mobileContainer]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add New Product</Text>
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Form Section */}
            <View style={styles.formSection}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Product Name *</Text>
                <TextInput
                  style={styles.input}
                  value={productName}
                  onChangeText={setProductName}
                  placeholder="e.g. Rice, Sugar, Soap"
                  placeholderTextColor={COLORS.placeholder}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={productDescription}
                  onChangeText={setProductDescription}
                  placeholder="Enter product details..."
                  placeholderTextColor={COLORS.placeholder}
                  multiline
                  numberOfLines={3}
                />
              </View>
              
              {/* Image Section */}
              <View style={styles.imageSection}>
                <Text style={styles.label}>Product Photo</Text>
                {image ? (
                  <View style={styles.imagePlaceholder}>
                    <Image 
                      source={{ uri: image }} 
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  </View>
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <View style={styles.placeholderContent}>
                      <Text style={styles.imageText}>No image selected</Text>
                    </View>
                  </View>
                )}
                
                <View style={styles.locationContainer}>
                  <TouchableOpacity 
                    style={[styles.getLocationButton, { flex: 1, marginRight: scale(5) }]}
                    onPress={takePicture}
                  >
                    <Text style={styles.getLocationButtonText}>📷 Camera</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.getLocationButton, { flex: 1, marginLeft: scale(5) }]}
                    onPress={pickImage}
                  >
                    <Text style={styles.getLocationButtonText}>🖼️ Gallery</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.rowContainer}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Price (₹) *</Text>
                  <TextInput
                    style={styles.input}
                    value={price}
                    onChangeText={setPrice}
                    placeholder="0.00"
                    placeholderTextColor={COLORS.placeholder}
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Quantity</Text>
                  <TextInput
                    style={styles.input}
                    value={quantity}
                    onChangeText={setQuantity}
                    placeholder="0"
                    placeholderTextColor={COLORS.placeholder}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.rowContainer}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Category</Text>
                  <TextInput
                    style={styles.input}
                    value={category}
                    onChangeText={setCategory}
                    placeholder="e.g. Grocery"
                    placeholderTextColor={COLORS.placeholder}
                  />
                </View>
                
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>SKU / Code</Text>
                  <TextInput
                    style={styles.input}
                    value={sku}
                    onChangeText={setSku}
                    placeholder="Optional"
                    placeholderTextColor={COLORS.placeholder}
                  />
                </View>
              </View>
              

              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.addButton} 
                  onPress={handleAddProduct}
                  disabled={loading}
                >
                  <Text style={styles.addButtonText}>
                    {loading ? 'Processing...' : 'Add Product'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => router.back()}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
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
    backgroundColor: COLORS.background,
  },
  mobileContainer: {
    flexDirection: 'column',
  },
  header: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(10),
  },
  imageSection: {
    marginBottom: verticalScale(20),
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: verticalScale(180),
    backgroundColor: 'white',
    borderRadius: moderateScale(15),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContent: {
    alignItems: 'center',
  },
  imageText: {
    color: COLORS.textLight,
    fontSize: moderateScale(14),
    fontFamily: 'RobotoCondensed-Regular',
  },
  title: {
    fontSize: moderateScale(28),
    fontFamily: 'RobotoCondensed-Bold',
    color: COLORS.text,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(30),
  },
  imageSection: {
    marginBottom: verticalScale(20),
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: verticalScale(180),
    backgroundColor: 'white',
    borderRadius: moderateScale(15),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContent: {
    alignItems: 'center',
  },
  imageText: {
    color: COLORS.textLight,
    fontSize: moderateScale(14),
    fontFamily: 'RobotoCondensed-Regular',
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: moderateScale(20),
    padding: scale(20),
    ...SHADOWS.medium,
  },
  inputContainer: {
    marginBottom: verticalScale(15),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: moderateScale(14),
    fontFamily: 'RobotoCondensed-SemiBold',
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
    fontFamily: 'RobotoCondensed-Regular',
    backgroundColor: '#FAFAFA',
    color: COLORS.text,
  },
  textArea: {
    height: verticalScale(80),
    textAlignVertical: 'top',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  locationInput: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: '#F0F4F8',
  },
  getLocationButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(15),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  getLocationButtonText: {
    color: 'white',
    fontSize: moderateScale(14),
    fontFamily: 'RobotoCondensed-Bold',
  },
  buttonContainer: {
    marginTop: verticalScale(10),
    gap: verticalScale(12),
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: verticalScale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    ...SHADOWS.small,
  },
  addButtonText: {
    color: 'white',
    fontSize: moderateScale(18),
    fontFamily: 'RobotoCondensed-Bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: verticalScale(12),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    color: COLORS.textLight,
    fontSize: moderateScale(16),
    fontFamily: 'RobotoCondensed-SemiBold',
  },
});

export default AddProduct;
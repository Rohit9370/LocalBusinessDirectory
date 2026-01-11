import { addProduct } from '@/Services/productService';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { COLORS, SHADOWS } from '../constants/theme';

const AddProduct = () => {
  const router = useRouter();
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

  const handleAddProduct = async () => {
    if (!productName || !price) {
      setError('Please enter product name and price');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      const productData = {
        name: productName,
        description: productDescription,
        price: parseFloat(price),
        quantity: parseInt(quantity) || 0,
        imageUrl: imageUrl || 'https://via.placeholder.com/150',
        category: category || 'General',
        sku: sku || ''
      };

      // In a real app, shopId would come from auth context or route params
      const shopId = 'current-shop-id'; 
      await addProduct(shopId, productData);
      
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
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Image URL</Text>
                <TextInput
                  style={styles.input}
                  value={imageUrl}
                  onChangeText={setImageUrl}
                  placeholder="https://example.com/image.jpg"
                  placeholderTextColor={COLORS.placeholder}
                />
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
  placeholderIcon: {
    fontSize: moderateScale(40),
    marginBottom: verticalScale(5),
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
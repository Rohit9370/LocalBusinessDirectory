import { adminLogin, setAuthToken, shopkeeperLogin } from '@/Services/authservice';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { account } from '@/lib/appwrite'; // Import the account service to check sessions

const { width } = Dimensions.get('window');

const DualLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('shopkeeper'); // 'admin' or 'shopkeeper'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        // First check if there's an active session with Appwrite
        const currentSession = await account.getSession('current');
        if (currentSession) {
          // Session exists, determine user type from AsyncStorage
          const storedUserType = await AsyncStorage.getItem('userType');
          if (storedUserType === 'admin') {
            router.replace('/AdminHome');
          } else {
            router.replace('/ShopkeeperHome');
          }
        }
      } catch (err) {
        // No active session found, user needs to log in
        // Only log if it's not a 404 (session not found) error
        if (err.code !== 404) {
          console.log('Error checking session:', err.message);
        }
      }
    };

    // Only run this once when the component mounts
    checkExistingSession();
  }, []); // Empty dependency array to run only once

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      let data;
      if (userType === 'admin') {
        data = await adminLogin(email, password);
      } else {
        data = await shopkeeperLogin(email, password);
      }

      if (data.token) {
        setAuthToken(data.token);
        // Save token and user type to AsyncStorage
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('userType', userType);
        
        // Navigate based on user type
        if (userType === 'admin') {
          router.replace('/AdminHome');
        } else {
          router.replace('/ShopkeeperHome');
        }
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPress = () => {
    router.push('/Register');
    // router.push('/Register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContainer}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>Dukan App</Text>
            </View>
            <Text style={styles.welcomeText}>Welcome Back</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Login to your account</Text>
              
              {/* User Type Selector */}
              <View style={styles.userTypeSelector}>
                <TouchableOpacity 
                  style={[
                    styles.userTypeButton,
                    userType === 'admin' && styles.activeUserTypeButton
                  ]}
                  onPress={() => setUserType('admin')}
                >
                  <Text style={[
                    styles.userTypeButtonText,
                    userType === 'admin' && styles.activeUserTypeButtonText
                  ]}>
                    Admin
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.userTypeButton,
                    userType === 'shopkeeper' && styles.activeUserTypeButton
                  ]}
                  onPress={() => setUserType('shopkeeper')}
                >
                  <Text style={[
                    styles.userTypeButtonText,
                    userType === 'shopkeeper' && styles.activeUserTypeButtonText
                  ]}>
                    Shopkeeper
                  </Text>
                </TouchableOpacity>
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
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.placeholder}
                  secureTextEntry
                />
              </View>
              
              <TouchableOpacity 
                style={styles.loginButton} 
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? 'Logging in...' : 'Login'}
                </Text>
              </TouchableOpacity>

              {userType === 'shopkeeper' && (
                <TouchableOpacity 
                  style={styles.registerLink}
                  onPress={handleRegisterPress}
                >
                  <Text style={styles.loginText}>
                    Don't have an account? <Text style={styles.loginLinkText}>Register here</Text>
                  </Text>
                </TouchableOpacity>
              )}
              
              {userType === 'admin' && (
                <View style={styles.adminInfo}>
                  <Text style={styles.adminInfoText}>
                    Contact system administrator for access
                  </Text>
                </View>
              )}
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
    flexDirection: 'column', // Changed to column for mobile first
  },
  headerSection: {
    padding: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(150),
    backgroundColor: COLORS.background,
  },
  logoContainer: {
    width: scale(80),
    height: scale(80),
    backgroundColor: COLORS.primary,
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoText: {
    color: 'white',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    textAlign: 'center',
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
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  userTypeSelector: {
    flexDirection: 'row',
    marginBottom: verticalScale(25),
    backgroundColor: COLORS.background,
    borderRadius: moderateScale(12),
    padding: scale(4),
  },
  userTypeButton: {
    flex: 1,
    padding: verticalScale(10),
    alignItems: 'center',
    borderRadius: moderateScale(10),
  },
  activeUserTypeButton: {
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  userTypeButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: COLORS.textLight,
  },
  activeUserTypeButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: verticalScale(20),
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
  loginButton: {
    backgroundColor: COLORS.primary,
    padding: verticalScale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(20),
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  registerLink: {
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
  adminInfo: {
    alignItems: 'center',
    marginTop: verticalScale(10),
    padding: verticalScale(10),
    backgroundColor: '#F7FAFC',
    borderRadius: moderateScale(8),
  },
  adminInfoText: {
    color: COLORS.textLight,
    fontSize: moderateScale(13),
    fontStyle: 'italic',
  },
});

export default DualLogin;
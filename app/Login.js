import { setAuthToken } from '@/Services/api';
import { adminLogin, shopkeeperLogin } from '@/Services/authservice';
import { ErrorMessage } from '@/components/ErrorMessage';
import { account } from '@/lib/appwrite'; // Import the account service to check sessions
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
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
import { COLORS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('shopkeeper'); // 'admin' or 'shopkeeper'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

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
      setError('Please enter email and password');
      setShowError(true);
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
      setError(error.message || 'Invalid credentials');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
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
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to manage your shop</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formCard}>
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

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput 
                style={styles.textInput} 
                placeholder="example@mail.com" 
                placeholderTextColor="#A0A0A0"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput 
                style={styles.textInput} 
                placeholder="••••••••" 
                placeholderTextColor="#A0A0A0"
                secureTextEntry 
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity 
              style={[styles.primaryButton, loading && { opacity: 0.7 }]} 
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.footerLink}
              onPress={() => router.push('/Register')}
            >
              <Text style={styles.footerText}>
                Don't have an account? <Text style={styles.linkText}>Register</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.footerLink, { marginTop: 15 }]}
              onPress={() => router.push('/DualLogin')}
            >
              <Text style={styles.footerText}>
                Access via <Text style={styles.linkText}>Dual Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
    paddingHorizontal: scale(25),
  },
  headerSection: {
    paddingTop: verticalScale(60),
    paddingHorizontal: scale(25),
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  logoContainer: {
    width: scale(80),
    height: scale(80),
    backgroundColor: COLORS.secondary,
    borderRadius: scale(22),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(20),
    ...SHADOWS.medium,
  },
  logo: {
    width: scale(50),
    height: scale(50),
  },
  welcomeTitle: {
    fontSize: moderateScale(28),
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: COLORS.textLight,
    marginTop: verticalScale(5),
  },
  formCard: {
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
  inputWrapper: {
    marginBottom: verticalScale(18),
  },
  inputLabel: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: verticalScale(8),
    marginLeft: scale(4),
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(16),
    paddingVertical: Platform.OS === 'ios' ? verticalScale(15) : verticalScale(12),
    fontSize: moderateScale(16),
    color: COLORS.text,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(14),
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    marginTop: verticalScale(10),
    ...SHADOWS.small,
  },
  buttonText: {
    color: 'white',
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  footerLink: {
    marginTop: verticalScale(25),
    alignItems: 'center',
  },
  footerText: {
    fontSize: moderateScale(15),
    color: COLORS.textLight,
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
  linkText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default Login;

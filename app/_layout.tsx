import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '../hooks/use-color-scheme';
import { useFonts } from '../hooks/useFonts';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const fontsLoaded = useFonts();

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff69b4" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Add the drawer group */}
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />

        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="HomeScreen" options={{ title: 'Home', headerShown: false }} />
        <Stack.Screen name="Login" options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen name="Register" options={{ title: 'Register', headerShown: false }} />
        <Stack.Screen name="DualLogin" options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen name="AdminLogin" options={{ title: 'Admin Login', headerShown: false }} />
        <Stack.Screen name="ShopkeeperRegister" options={{ title: 'Register Shop', headerShown: false }} />

        {/* Removed AdminHome and ShopkeeperHome as they are now in (drawer) */}

        <Stack.Screen name="AddProduct" options={{ title: 'Add Product', headerShown: false }} />
        <Stack.Screen name="NearbyShops" options={{ title: 'Nearby Shops', headerShown: false }} />
        <Stack.Screen name="ShopDetails" options={{ title: 'Shop Details', headerShown: false }} />
        <Stack.Screen name="MyProducts" options={{ title: 'My Products', headerShown: false }} />
        <Stack.Screen name="OTP" options={{ title: 'Verify OTP', headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

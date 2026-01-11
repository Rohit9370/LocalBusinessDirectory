import AsyncStorage from '@react-native-async-storage/async-storage';
import { account, databases, DB_ID, ID, SHOPS_COLLECTION_ID } from '../lib/appwrite';

// Set auth token for API requests (optional with Appwrite as it handles sessions, but kept for compatibility)
export const setAuthToken = async (token) => {
  if (token) {
    await AsyncStorage.setItem('token', token);
    console.log('Auth token stored in AsyncStorage:', !!token);
  }
};

// Function for general user registration (Shopkeeper)
export const register = async (ownerName, email, phone, password, shopDetails) => {
  try {
    // 1. Create Appwrite Account
    const userAccount = await account.create(
      ID.unique(),
      email,
      password,
      ownerName
    );

    // 2. Create Session (Login)
    await account.createEmailPasswordSession(email, password);

    // 3. Create Shop Entry in Databases
    const shopEntry = await databases.createDocument(
      DB_ID,
      SHOPS_COLLECTION_ID,
      ID.unique(),
      {
        ownerName: ownerName,
        shopName: shopDetails.shopName,
        email: email,
        phone: phone || '',
        location: shopDetails.location || '',
        registrationDate: new Date().toISOString(),
        isActive: true,
        type: shopDetails.type || 'shopkeeper'
      }
    );

    return { success: true, user: userAccount, shop: shopEntry, token: 'session_active' };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Function for general user login
export const login = async (email, password) => {
  try {
    // First, try to get the current session to check if one exists
    try {
      const currentSession = await account.getSession('current');
      // If we get here, there's an existing session, so we delete it
      await account.deleteSession(currentSession.$id);
    } catch (sessionErr) {
      // If no session exists, this will fail with status 404, which is OK
      if (sessionErr.code !== 404) {
        console.log('Error checking/deleting session:', sessionErr.message);
      }
    }
    
    const session = await account.createEmailPasswordSession(email, password);
    return { success: true, token: session.$id, user: session };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Function for admin login
export const adminLogin = async (email, password) => {
  try {
    // First, try to get the current session to check if one exists
    try {
      const currentSession = await account.getSession('current');
      // If we get here, there's an existing session, so we delete it
      await account.deleteSession(currentSession.$id);
    } catch (sessionErr) {
      // If no session exists, this will fail with status 404, which is OK
      if (sessionErr.code !== 404) {
        console.log('Error checking/deleting session:', sessionErr.message);
      }
    }
    
    // Admin login uses the same auth but might need extra checks
    const session = await account.createEmailPasswordSession(email, password);
    // You could verify admin role here via document or team if configured
    return { success: true, token: session.$id, user: session, isAdmin: true };
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};

// Function for shopkeeper registration
export const shopkeeperRegister = async (shopName, ownerName, email, phone, password, shopDetails) => {
  try {
    // 1. Create Appwrite Account
    const userAccount = await account.create(
      ID.unique(),
      email,
      password,
      ownerName
    );

    // 2. Create Session (Login)
    await account.createEmailPasswordSession(email, password);

    // 3. Create Shop Entry in Databases
    const shopEntry = await databases.createDocument(
      DB_ID,
      SHOPS_COLLECTION_ID,
      ID.unique(),
      {
        ownerName: ownerName,
        shopName: shopName,
        email: email,
        phone: phone || '',
        location: shopDetails.address || '',
        locationCoords: {
          latitude: shopDetails.latitude,
          longitude: shopDetails.longitude
        },
        registrationDate: new Date().toISOString(),
        isActive: true,
        type: shopDetails.type || 'shopkeeper',
        // Add initial products if provided
        products: shopDetails.products || []
      }
    );

    return { success: true, user: userAccount, shop: shopEntry, token: 'session_active' };
  } catch (error) {
    console.error('Shopkeeper registration error:', error);
    throw error;
  }
};

// Function for shopkeeper login (alias for login for now)
export const shopkeeperLogin = login;

export const logout = async () => {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

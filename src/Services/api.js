
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from './baseapi';

// Set auth token for API requests
export const setAuthToken = async (token) => {
  if (token) {
    await AsyncStorage.setItem('api_token', token);
    console.log('Auth token stored in AsyncStorage:', !!token);
  }
};

// Get auth token
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('api_token');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};



// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  
  // Get auth token
  const token = await getAuthToken();
  
  const config = {
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// GET request
export const get = async (endpoint) => {
  return apiRequest(endpoint, { method: 'GET' });
};

// POST request
export const post = async (endpoint, data) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// PUT request
export const put = async (endpoint, data) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// DELETE request
export const del = async (endpoint) => {
  return apiRequest(endpoint, { method: 'DELETE' });
};
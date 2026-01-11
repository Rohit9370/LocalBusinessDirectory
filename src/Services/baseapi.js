// Base API configuration
const BASE_URL = 'http://localhost:3000/api'; // Replace with your actual backend URL

export const API_URL = BASE_URL;

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// API base configuration
export const API_CONFIG = {
  baseUrl: BASE_URL,
  timeout: 10000, // 10 seconds
  headers: DEFAULT_HEADERS,
};
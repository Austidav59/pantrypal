import Constants from 'expo-constants';
import { Platform } from 'react-native';

// API URL type
type ApiUrl = string;

// Function to get the appropriate API base URL based on platform
const getApiBaseUrl = (): ApiUrl => {
  if (Platform.OS === 'ios') {
    // For iOS simulator
    return 'http://127.0.0.1:8081';
  } else if (Platform.OS === 'android') {
    // For Android emulator
    return 'http://10.0.2.2:8081';
  } else {
    // For web
    return 'http://localhost:8081';
  }
};

// API configuration
export const API_BASE_URL: ApiUrl = getApiBaseUrl();

// API request configuration
export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
} as const;

// Error handling configuration
export const errorConfig = {
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

// Logging configuration
export const loggingConfig = {
  enabled: true,
  logLevel: 'debug',
} as const;

// Default config object
const config = {
  apiBaseUrl: API_BASE_URL,
  apiConfig,
  errorConfig,
  loggingConfig,
} as const;

export default config; 
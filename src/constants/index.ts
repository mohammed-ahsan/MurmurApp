// Application constants and configuration

export const APP_CONFIG = {
  name: 'Murmur',
  version: '1.0.0',
  description: 'A social media app for sharing thoughts and ideas',
} as const;

// Firebase configuration
export const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    RESET_PASSWORD: '/auth/reset-password',
  },
  // Users
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    SEARCH: '/users/search',
    FOLLOWERS: '/users/:userId/followers',
    FOLLOWING: '/users/:userId/following',
    FOLLOW: '/users/:userId/follow',
    UNFOLLOW: '/users/:userId/unfollow',
  },
  // Murmurs
  MURMURS: {
    BASE: '/murmurs',
    TIMELINE: '/murmurs/timeline',
    USER_MURMURS: '/murmurs/user/:userId',
    TRENDING: '/murmurs/trending',
    SEARCH: '/murmurs/search',
    LIKE: '/murmurs/:id/like',
    UNLIKE: '/murmurs/:id/unlike',
    RETWEET: '/murmurs/:id/retweet',
    UNRETWEET: '/murmurs/:id/unretweet',
  },
  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/read-all',
  },
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  INITIAL_PAGE: 1,
} as const;

// Validation rules
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  DISPLAY_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  MURMUR_CONTENT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 280,
  },
  BIO: {
    MAX_LENGTH: 160,
  },
} as const;

// Error codes
export const ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // Authentication errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  FORBIDDEN: 'FORBIDDEN',
  
  // Server errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  
  // Business logic errors
  CANNOT_FOLLOW_SELF: 'CANNOT_FOLLOW_SELF',
  ALREADY_FOLLOWING: 'ALREADY_FOLLOWING',
  NOT_FOLLOWING: 'NOT_FOLLOWING',
  CANNOT_DELETE_OTHERS_MURMUR: 'CANNOT_DELETE_OTHERS_MURMUR',
  ALREADY_LIKED: 'ALREADY_LIKED',
  NOT_LIKED: 'NOT_LIKED',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  MURMUR_POSTED: 'Murmur posted successfully!',
  MURMUR_DELETED: 'Murmur deleted successfully!',
  USER_FOLLOWED: 'User followed successfully!',
  USER_UNFOLLOWED: 'User unfollowed successfully!',
  MURMUR_LIKED: 'Murmur liked successfully!',
  MURMUR_UNLIKED: 'Murmur unliked successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
} as const;

// Cache keys
export const CACHE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  REFRESH_TOKEN: '@refresh_token',
  USER_PROFILE: '@user_profile',
  THEME: '@theme',
  LANGUAGE: '@language',
  ONBOARDING_COMPLETED: '@onboarding_completed',
  NOTIFICATIONS_ENABLED: '@notifications_enabled',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  PERSISTED_STATE: '@persisted_state',
  OFFLINE_MURMURS: '@offline_murmurs',
  DRAFT_MURMURS: '@draft_murmurs',
  SEARCH_HISTORY: '@search_history',
} as const;

// Animation durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000,
} as const;

// Screen names for navigation and analytics
export const SCREEN_NAMES = {
  // Auth screens
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  
  // Main screens
  TIMELINE: 'Timeline',
  SEARCH: 'Search',
  NOTIFICATIONS: 'Notifications',
  PROFILE: 'Profile',
  
  // Murmur screens
  MURMUR_DETAIL: 'MurmurDetail',
  CREATE_MURMUR: 'CreateMurmur',
  EDIT_MURMUR: 'EditMurmur',
  
  // User screens
  USER_PROFILE: 'UserProfile',
  FOLLOWERS: 'Followers',
  FOLLOWING: 'Following',
  
  // Settings screens
  SETTINGS: 'Settings',
  EDIT_PROFILE: 'EditProfile',
  PRIVACY_SETTINGS: 'PrivacySettings',
  NOTIFICATION_SETTINGS: 'NotificationSettings',
} as const;

// Theme colors
export const COLORS = {
  PRIMARY: '#1DA1F2',
  SECONDARY: '#14171A',
  BACKGROUND: '#FFFFFF',
  SURFACE: '#F7F9FA',
  TEXT: '#14171A',
  TEXT_SECONDARY: '#657786',
  BORDER: '#E1E8ED',
  ERROR: '#E0245E',
  SUCCESS: '#17BF63',
  WARNING: '#FFAD1F',
  INFO: '#1DA1F2',
} as const;

// Spacing
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const;

// Font sizes
export const FONT_SIZES = {
  XS: 12,
  SM: 14,
  MD: 16,
  LG: 18,
  XL: 20,
  XXL: 24,
  XXXL: 32,
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SMALL: 320,
  MEDIUM: 768,
  LARGE: 1024,
  EXTRA_LARGE: 1440,
} as const;

// Debounce and throttle times
export const DEBOUNCE_TIMES = {
  SEARCH: 300,
  TYPING: 500,
  SCROLL: 100,
} as const;

// Rate limiting
export const RATE_LIMITS = {
  MURMUR_POST: 30, // per hour
  MURMUR_DELETE: 100, // per hour
  FOLLOW: 50, // per hour
  LIKE: 200, // per hour
  SEARCH: 100, // per minute
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: true,
  ENABLE_OFFLINE_MODE: true,
  ENABLE_SEARCH: true,
  ENABLE_TRENDING: true,
} as const;

// Environment
export const ENVIRONMENT = {
  isDevelopment: __DEV__,
  isProduction: !__DEV__,
  isTest: process.env.NODE_ENV === 'test',
} as const;

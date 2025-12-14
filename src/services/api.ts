import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API base configuration
const API_BASE_URL = __DEV__ 
  ? 'http://10.96.229.9:3000/api'  
  : 'https://your-production-api.com/api';

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<{
  items: T[];
  pagination: PaginationInfo;
}> {}

// User types
export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  avatar?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  murmursCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isFollowing?: boolean;
  isOwnProfile?: boolean;
}

// Murmur types
export interface Murmur {
  id: string;
  userId: string | User;
  content: string;
  likesCount: number;
  repliesCount: number;
  retweetsCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  isLikedByUser?: boolean;
  user?: User;
}

// Auth types
export interface LoginCredentials {
  identifier: string; // email or username
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  displayName: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Global store reference for automatic logout
let storeRef: any = null;

// Function to set the store reference
export const setApiStore = (store: any) => {
  storeRef = store;
};

// API Logger utility
const logApiCall = (method: string, url: string, data?: any, response?: any, error?: any) => {
  if (__DEV__) {
    const timestamp = new Date().toISOString();
    console.log(`\n🔗 API Call [${timestamp}]`);
    console.log(`📤 ${method.toUpperCase()} ${url}`);
    
    if (data) {
      console.log('📦 Request Data:', data);
    }
    
    if (response) {
      console.log('📥 Response Status:', response.status);
      console.log('📥 Response Data:', response.data);
    }
    
    if (error) {
      console.log('❌ Error:', error.message || error);
      if (error.response) {
        console.log('❌ Error Status:', error.response.status);
        console.log('❌ Error Data:', error.response.data);
      }
    }
    
    console.log('─'.repeat(50));
  }
};

// Create axios instance
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token and log requests
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await AsyncStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log the request
      logApiCall(
        config.method || 'GET',
        config.url || '',
        config.data,
        undefined,
        undefined
      );
      
      return config;
    },
    (error: any) => {
      logApiCall('ERROR', '', undefined, undefined, error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling and logging
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log successful response
      logApiCall(
        response.config.method || 'GET',
        response.config.url || '',
        response.config.data,
        response,
        undefined
      );
      
      return response;
    },
    async (error: any) => {
      // Log the error
      logApiCall(
        error.config?.method || 'GET',
        error.config?.url || '',
        error.config?.data,
        undefined,
        error
      );
      
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem('auth_token');
        
        // Dispatch logout action to Redux store if available
        if (storeRef && storeRef.dispatch) {
          try {
            const { clearAuth } = require('../store/slices/authSlice');
            storeRef.dispatch(clearAuth());
          } catch (err) {
            console.warn('Could not dispatch logout action:', err);
          }
        }
      }
      
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      
      // Handle other API errors
      const errorMessage = error.response.data?.error || 'An unexpected error occurred';
      throw new Error(errorMessage);
    }
  );

  return instance;
};

const api = createApiInstance();

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    const { user, token } = response.data.data!;
    
    // Store token
    await AsyncStorage.setItem('auth_token', token);
    
    return { user, token };
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    const { user, token } = response.data.data!;
    
    // Store token
    await AsyncStorage.setItem('auth_token', token);
    
    return { user, token };
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data.data!.user;
  },

  updateProfile: async (data: Partial<Pick<User, 'displayName' | 'bio'>>): Promise<User> => {
    const response = await api.put<ApiResponse<{ user: User }>>('/auth/me', data);
    return response.data.data!.user;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await api.put('/auth/me/password', data);
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('auth_token');
  },
};

// Murmurs API
export const murmursAPI = {
  getTimeline: async (page: number = 1, limit: number = 10): Promise<{ murmurs: Murmur[]; pagination: PaginationInfo }> => {
    const response = await api.get<ApiResponse<{ murmurs: Murmur[]; pagination: PaginationInfo }>>(
      '/murmurs/timeline',
      { params: { page, limit } }
    );
    return response.data.data!;
  },

  getAllMurmurs: async (page: number = 1, limit: number = 10): Promise<{ murmurs: Murmur[]; pagination: PaginationInfo }> => {
    const response = await api.get<ApiResponse<{ murmurs: Murmur[]; pagination: PaginationInfo }>>(
      '/murmurs',
      { params: { page, limit } }
    );
    return response.data.data!;
  },

  getMurmur: async (id: string): Promise<Murmur> => {
    const response = await api.get<ApiResponse<{ murmur: Murmur }>>(`/murmurs/${id}`);
    return response.data.data!.murmur;
  },

  createMurmur: async (content: string): Promise<Murmur> => {
    const response = await api.post<ApiResponse<{ murmur: Murmur }>>('/murmurs', { content });
    return response.data.data!.murmur;
  },

  deleteMurmur: async (id: string): Promise<void> => {
    await api.delete(`/murmurs/${id}`);
  },

  likeMurmur: async (id: string): Promise<{ isLiked: boolean; likesCount: number }> => {
    const response = await api.post<ApiResponse<{ isLiked: boolean; likesCount: number }>>(`/murmurs/${id}/like`);
    return response.data.data!;
  },

  getUserMurmurs: async (userId: string, page: number = 1, limit: number = 10): Promise<{ user: User; murmurs: Murmur[]; pagination: PaginationInfo }> => {
    const response = await api.get<ApiResponse<{ user: User; murmurs: Murmur[]; pagination: PaginationInfo }>>(
      `/murmurs/user/${userId}`,
      { params: { page, limit } }
    );
    return response.data.data!;
  },
};

// Users API
export const usersAPI = {
  getUserProfile: async (userId: string): Promise<User> => {
    const response = await api.get<ApiResponse<{ user: User }>>(`/users/${userId}`);
    return response.data.data!.user;
  },

  followUser: async (userId: string): Promise<{ isFollowing: boolean; followersCount: number }> => {
    const response = await api.post<ApiResponse<{ isFollowing: boolean; followersCount: number }>>(`/users/${userId}/follow`);
    return response.data.data!;
  },

  unfollowUser: async (userId: string): Promise<{ isFollowing: boolean; followersCount: number }> => {
    const response = await api.delete<ApiResponse<{ isFollowing: boolean; followersCount: number }>>(`/users/${userId}/follow`);
    return response.data.data!;
  },

  getUserFollowers: async (userId: string, page: number = 1, limit: number = 20): Promise<{ followers: User[]; pagination: PaginationInfo }> => {
    const response = await api.get<ApiResponse<{ followers: User[]; pagination: PaginationInfo }>>(
      `/users/${userId}/followers`,
      { params: { page, limit } }
    );
    return response.data.data!;
  },

  getUserFollowing: async (userId: string, page: number = 1, limit: number = 20): Promise<{ following: User[]; pagination: PaginationInfo }> => {
    const response = await api.get<ApiResponse<{ following: User[]; pagination: PaginationInfo }>>(
      `/users/${userId}/following`,
      { params: { page, limit } }
    );
    return response.data.data!;
  },

  searchUsers: async (query: string, page: number = 1, limit: number = 20): Promise<{ users: User[]; pagination: PaginationInfo }> => {
    const response = await api.get<ApiResponse<{ users: User[]; pagination: PaginationInfo }>>(
      `/users/search/${encodeURIComponent(query)}`,
      { params: { page, limit } }
    );
    return response.data.data!;
  },
};

// Utility functions
export const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('auth_token');
};

export const setAuthToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem('auth_token', token);
};

export const removeAuthToken = async (): Promise<void> => {
  await AsyncStorage.removeItem('auth_token');
};

export default api;

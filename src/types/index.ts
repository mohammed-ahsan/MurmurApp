// Core types for the Murmur application

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  murmursCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Murmur {
  id: string;
  userId: string;
  user: User;
  content: string;
  likesCount: number;
  repliesCount: number;
  retweetsCount: number;
  isLikedByUser?: boolean;
  isRetweeted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Like {
  id: string;
  userId: string;
  murmurId: string;
  createdAt: Date;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface MurmurState {
  murmurs: Murmur[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  lastDocument?: any;
}

export interface UserState {
  profile: User | null;
  followers: User[];
  following: User[];
  isLoading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  lastDocument?: any;
  totalCount?: number;
}

export interface CreateMurmurRequest {
  content: string;
}

export interface UpdateMurmurRequest {
  content: string;
}

export interface UpdateUserProfileRequest {
  displayName?: string;
  bio?: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

export interface NavigationState {
  isFocused: boolean;
  currentRoute: string;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Loading states
export interface LoadingState {
  [key: string]: boolean;
}

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: object;
    h2: object;
    h3: object;
    body: object;
    caption: object;
  };
}

// Form types
export interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}

export interface FormState {
  [key: string]: FormField;
}

// Notification types
export interface Notification {
  id: string;
  type: 'like' | 'follow' | 'reply' | 'retweet';
  userId: string;
  actorId: string;
  actor: User;
  murmurId?: string;
  murmur?: Murmur;
  isRead: boolean;
  createdAt: Date;
}

// Search types
export interface SearchResult {
  users: User[];
  murmurs: Murmur[];
  hasMore: boolean;
}

// Analytics types
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: Date;
}

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// UI state interface
interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Navigation
  activeTab: 'timeline' | 'search' | 'profile' | 'notifications';
  
  // Loading states
  globalLoading: boolean;
  
  // Network status
  isOnline: boolean;
  
  // Modals
  createMurmurModal: {
    isVisible: boolean;
    initialContent?: string;
  };
  
  deleteMurmurModal: {
    isVisible: boolean;
    murmurId?: string;
  };
  
  // Toast notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message?: string;
    duration?: number;
    timestamp: number;
  }>;
  
  // Pull to refresh
  refreshing: {
    timeline: boolean;
    profile: boolean;
    search: boolean;
  };
  
  // Infinite scroll
  loadingMore: {
    timeline: boolean;
    profile: boolean;
    search: boolean;
    followers: boolean;
    following: boolean;
  };
  
  // Search
  searchQuery: string;
  searchActive: boolean;
  
  // Error states
  error: {
    global: string | null;
    network: string | null;
  };
}

// Initial state
const initialState: UIState = {
  theme: 'system',
  activeTab: 'timeline',
  globalLoading: false,
  isOnline: true,
  createMurmurModal: {
    isVisible: false,
  },
  deleteMurmurModal: {
    isVisible: false,
  },
  notifications: [],
  refreshing: {
    timeline: false,
    profile: false,
    search: false,
  },
  loadingMore: {
    timeline: false,
    profile: false,
    search: false,
    followers: false,
    following: false,
  },
  searchQuery: '',
  searchActive: false,
  error: {
    global: null,
    network: null,
  },
};

// Create slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },

    // Navigation
    setActiveTab: (state, action: PayloadAction<'timeline' | 'search' | 'profile' | 'notifications'>) => {
      state.activeTab = action.payload;
    },

    // Global loading
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },

    // Network status
    setNetworkStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
      if (!action.payload) {
        state.error.network = 'No internet connection';
      } else {
        state.error.network = null;
      }
    },

    // Create murmur modal
    showCreateMurmurModal: (state, action: PayloadAction<{ initialContent?: string }>) => {
      state.createMurmurModal.isVisible = true;
      state.createMurmurModal.initialContent = action.payload.initialContent;
    },

    hideCreateMurmurModal: (state) => {
      state.createMurmurModal.isVisible = false;
      state.createMurmurModal.initialContent = undefined;
    },

    // Delete murmur modal
    showDeleteMurmurModal: (state, action: PayloadAction<string>) => {
      state.deleteMurmurModal.isVisible = true;
      state.deleteMurmurModal.murmurId = action.payload;
    },

    hideDeleteMurmurModal: (state) => {
      state.deleteMurmurModal.isVisible = false;
      state.deleteMurmurModal.murmurId = undefined;
    },

    // Notifications
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'info' | 'warning';
      title: string;
      message?: string;
      duration?: number;
    }>) => {
      const notification = {
        id: Date.now().toString(),
        ...action.payload,
        timestamp: Date.now(),
        duration: action.payload.duration || 3000,
      };
      state.notifications.push(notification);
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Pull to refresh
    setRefreshing: (state, action: PayloadAction<{
      key: keyof typeof state.refreshing;
      value: boolean;
    }>) => {
      state.refreshing[action.payload.key] = action.payload.value;
    },

    // Loading more
    setLoadingMore: (state, action: PayloadAction<{
      key: keyof typeof state.loadingMore;
      value: boolean;
    }>) => {
      state.loadingMore[action.payload.key] = action.payload.value;
    },

    // Search
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setSearchActive: (state, action: PayloadAction<boolean>) => {
      state.searchActive = action.payload;
    },

    clearSearch: (state) => {
      state.searchQuery = '';
      state.searchActive = false;
    },

    // Error handling
    setGlobalError: (state, action: PayloadAction<string | null>) => {
      state.error.global = action.payload;
    },

    clearGlobalError: (state) => {
      state.error.global = null;
    },

    setNetworkError: (state, action: PayloadAction<string | null>) => {
      state.error.network = action.payload;
    },

    clearNetworkError: (state) => {
      state.error.network = null;
    },

    clearAllErrors: (state) => {
      state.error.global = null;
      state.error.network = null;
    },

    // Reset UI state
    resetUIState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

// Export actions
export const {
  setTheme,
  setActiveTab,
  setGlobalLoading,
  setNetworkStatus,
  showCreateMurmurModal,
  hideCreateMurmurModal,
  showDeleteMurmurModal,
  hideDeleteMurmurModal,
  addNotification,
  removeNotification,
  clearNotifications,
  setRefreshing,
  setLoadingMore,
  setSearchQuery,
  setSearchActive,
  clearSearch,
  setGlobalError,
  clearGlobalError,
  setNetworkError,
  clearNetworkError,
  clearAllErrors,
  resetUIState,
} = uiSlice.actions;

// Selectors
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectActiveTab = (state: { ui: UIState }) => state.ui.activeTab;
export const selectGlobalLoading = (state: { ui: UIState }) => state.ui.globalLoading;
export const selectIsOnline = (state: { ui: UIState }) => state.ui.isOnline;
export const selectCreateMurmurModal = (state: { ui: UIState }) => state.ui.createMurmurModal;
export const selectDeleteMurmurModal = (state: { ui: UIState }) => state.ui.deleteMurmurModal;
export const selectNotifications = (state: { ui: UIState }) => state.ui.notifications;
export const selectRefreshing = (key: keyof UIState['refreshing']) => (state: { ui: UIState }) => state.ui.refreshing[key];
export const selectLoadingMore = (key: keyof UIState['loadingMore']) => (state: { ui: UIState }) => state.ui.loadingMore[key];
export const selectSearchQuery = (state: { ui: UIState }) => state.ui.searchQuery;
export const selectSearchActive = (state: { ui: UIState }) => state.ui.searchActive;
export const selectGlobalError = (state: { ui: UIState }) => state.ui.error.global;
export const selectNetworkError = (state: { ui: UIState }) => state.ui.error.network;

// Export reducer
export default uiSlice.reducer;

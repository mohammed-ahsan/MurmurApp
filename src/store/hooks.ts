import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';
import { 
  loginUser, 
  registerUser, 
  getCurrentUser, 
  updateProfile, 
  changePassword, 
  logoutUser,
  clearError,
  clearAuth,
  setToken,
  restoreToken
} from './slices/authSlice';
import {
  fetchTimeline,
  fetchAllMurmurs,
  fetchUserMurmurs,
  fetchMurmur,
  createMurmur,
  deleteMurmur,
  likeMurmur,
  clearMurmursError,
  resetUserMurmurs
} from './slices/murmursSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Simple selectors that work with persist
export const useAuthState = () => {
  return useAppSelector((state: any) => state.auth);
};

export const useMurmursState = () => {
  return useAppSelector((state: any) => state.murmurs);
};

export const useUsersState = () => {
  return useAppSelector((state: any) => state.users);
};

export const useUIState = () => {
  return useAppSelector((state: any) => state.ui);
};

// Auth hook
export const useAuth = () => {
  const auth = useAuthState();
  const dispatch = useAppDispatch();
  
  return {
    ...auth,
    login: (credentials: any) => dispatch(loginUser(credentials)),
    register: (data: any) => dispatch(registerUser(data)),
    getCurrentUser: () => dispatch(getCurrentUser()),
    updateProfile: (data: any) => dispatch(updateProfile(data)),
    changePassword: (data: any) => dispatch(changePassword(data)),
    logout: () => dispatch(logoutUser()),
    clearError: () => dispatch(clearError()),
    clearAuth: () => dispatch(clearAuth()),
    setToken: (token: string) => dispatch(setToken(token)),
    restoreToken: () => dispatch(restoreToken()),
  };
};

// Murmurs hook
export const useMurmurs = () => {
  const murmurs = useMurmursState();
  const dispatch = useAppDispatch();
  
  return {
    ...murmurs,
    fetchTimeline: (params?: any) => dispatch(fetchTimeline(params)),
    fetchAllMurmurs: (params?: any) => dispatch(fetchAllMurmurs(params)),
    fetchUserMurmurs: (params: any) => dispatch(fetchUserMurmurs(params)),
    fetchMurmur: (id: string) => dispatch(fetchMurmur(id)),
    createMurmur: (content: string) => dispatch(createMurmur(content)),
    deleteMurmur: (id: string) => dispatch(deleteMurmur(id)),
    likeMurmur: (id: string) => dispatch(likeMurmur(id)),
    clearMurmursError: (params?: any) => dispatch(clearMurmursError(params)),
    resetUserMurmurs: (userId: string) => dispatch(resetUserMurmurs(userId)),
  };
};

// Users hook
export const useUsers = () => {
  const users = useUsersState();
  const dispatch = useAppDispatch();
  
  return {
    ...users,
    fetchUserProfile: (userId: string) => dispatch({ type: 'users/fetchUserProfile', payload: userId }),
    fetchUserFollowers: (params: any) => dispatch({ type: 'users/fetchUserFollowers', payload: params }),
    fetchUserFollowing: (params: any) => dispatch({ type: 'users/fetchUserFollowing', payload: params }),
    searchUsersAction: (params: any) => dispatch({ type: 'users/searchUsers', payload: params }),
    followUser: (userId: string) => dispatch({ type: 'users/followUser', payload: userId }),
    unfollowUser: (userId: string) => dispatch({ type: 'users/unfollowUser', payload: userId }),
    clearUsersError: (params?: any) => dispatch({ type: 'users/clearUsersError', payload: params }),
    clearSearch: () => dispatch({ type: 'users/clearSearch' }),
    resetUserProfile: (userId: string) => dispatch({ type: 'users/resetUserProfile', payload: userId }),
    resetUserFollowers: (userId: string) => dispatch({ type: 'users/resetUserFollowers', payload: userId }),
    resetUserFollowing: (userId: string) => dispatch({ type: 'users/resetUserFollowing', payload: userId }),
  };
};

// UI hook
export const useUI = () => {
  const ui = useUIState();
  const dispatch = useAppDispatch();
  
  return {
    ...ui,
    setTheme: (theme: 'light' | 'dark' | 'system') => dispatch({ type: 'ui/setTheme', payload: theme }),
    setActiveTab: (tab: 'timeline' | 'search' | 'profile' | 'notifications') => dispatch({ type: 'ui/setActiveTab', payload: tab }),
    setGlobalLoading: (loading: boolean) => dispatch({ type: 'ui/setGlobalLoading', payload: loading }),
    setNetworkStatus: (status: boolean) => dispatch({ type: 'ui/setNetworkStatus', payload: status }),
    showCreateMurmurModal: (params?: { initialContent?: string }) => dispatch({ type: 'ui/showCreateMurmurModal', payload: params }),
    hideCreateMurmurModal: () => dispatch({ type: 'ui/hideCreateMurmurModal' }),
    showDeleteMurmurModal: (murmurId: string) => dispatch({ type: 'ui/showDeleteMurmurModal', payload: murmurId }),
    hideDeleteMurmurModal: () => dispatch({ type: 'ui/hideDeleteMurmurModal' }),
    addNotification: (notification: any) => dispatch({ type: 'ui/addNotification', payload: notification }),
    removeNotification: (id: string) => dispatch({ type: 'ui/removeNotification', payload: id }),
    clearNotifications: () => dispatch({ type: 'ui/clearNotifications' }),
    setRefreshing: (params: { key: any; value: boolean }) => dispatch({ type: 'ui/setRefreshing', payload: params }),
    setLoadingMore: (params: { key: any; value: boolean }) => dispatch({ type: 'ui/setLoadingMore', payload: params }),
    setSearchQuery: (query: string) => dispatch({ type: 'ui/setSearchQuery', payload: query }),
    setSearchActive: (active: boolean) => dispatch({ type: 'ui/setSearchActive', payload: active }),
    clearSearch: () => dispatch({ type: 'ui/clearSearch' }),
    setGlobalError: (error: string | null) => dispatch({ type: 'ui/setGlobalError', payload: error }),
    clearGlobalError: () => dispatch({ type: 'ui/clearGlobalError' }),
    setNetworkError: (error: string | null) => dispatch({ type: 'ui/setNetworkError', payload: error }),
    clearNetworkError: () => dispatch({ type: 'ui/clearNetworkError' }),
    clearAllErrors: () => dispatch({ type: 'ui/clearAllErrors' }),
    resetUIState: () => dispatch({ type: 'ui/resetUIState' }),
  };
};

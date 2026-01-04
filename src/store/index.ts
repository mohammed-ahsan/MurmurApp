import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import slices
import authSlice from './slices/authSlice';
import murmursSlice from './slices/murmursSlice';
import usersSlice from './slices/usersSlice';
import uiSlice from './slices/uiSlice';
import notificationsSlice from './slices/notificationsSlice';

// Import API service to set store reference
import { setApiStore } from '../services/api';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: ['ui'], // Don't persist UI state
};

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  murmurs: murmursSlice,
  users: usersSlice,
  ui: uiSlice,
  notifications: notificationsSlice,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: __DEV__,
});

// Set store reference for API service
setApiStore(store);

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

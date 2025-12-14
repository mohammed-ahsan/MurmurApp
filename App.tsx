import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// Store
import { store, persistor } from './src/store';

// Navigation
import AppNavigator from './src/navigation/AppNavigator';

// Theme
import { COLORS } from './src/constants';

// Hooks
import { useAuth } from './src/store/hooks';

// App initialization component
const AppInitializer = () => {
  const { restoreToken } = useAuth();

  useEffect(() => {
    // Restore token on app start
    restoreToken();
  }, [restoreToken]);

  return <AppNavigator />;
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.BACKGROUND}
          translucent={false}
        />
        <AppInitializer />
      </PersistGate>
    </Provider>
  );
};

export default App;

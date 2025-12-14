import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../../store/hooks';
import LoadingSpinner from '../common/LoadingSpinner';

interface PrivateRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { isAuthenticated, isLoading, getCurrentUser, token } = useAuth();

  useEffect(() => {
    // Check if we have a token but no user data, try to get current user
    if (token && !isAuthenticated && !isLoading) {
      getCurrentUser();
    }
  }, [token, isAuthenticated, isLoading, getCurrentUser]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </View>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 16 }}>
          Please log in to access this content
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;

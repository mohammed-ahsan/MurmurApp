import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../../store/hooks';
import LoadingSpinner from '../common/LoadingSpinner';

interface PublicRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectToAuth?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  fallback,
  redirectToAuth = true
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </View>
    );
  }

  if (isAuthenticated && redirectToAuth) {
    return fallback || (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 16 }}>
          You are already logged in
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};

export default PublicRoute;

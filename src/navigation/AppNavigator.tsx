import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import TimelineScreen from '../screens/timeline/TimelineScreen';
import SearchScreen from '../screens/search/SearchScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import MurmurDetailScreen from '../screens/murmur/MurmurDetailScreen';
import UserProfileScreen from '../screens/user/UserProfileScreen';
import CreateMurmurScreen from '../screens/murmur/CreateMurmurScreen';

// Route protection components
import PrivateRoute from '../components/navigation/PrivateRoute';
import PublicRoute from '../components/navigation/PublicRoute';

// Hooks
import { useAuth } from '../store/hooks';

// Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  MurmurDetail: { murmurId: string };
  UserProfile: { userId: string };
  CreateMurmur: { initialContent?: string; replyToMurmurId?: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Timeline: undefined;
  Search: undefined;
  Profile: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Auth Navigator
const AuthNavigator = () => {
  return (
    <PublicRoute>
      <AuthStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
      </AuthStack.Navigator>
    </PublicRoute>
  );
};

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <PrivateRoute>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string;

            switch (route.name) {
              case 'Timeline':
                iconName = 'home';
                break;
              case 'Search':
                iconName = 'search';
                break;
              case 'Profile':
                iconName = 'person';
                break;
              case 'Notifications':
                iconName = 'notifications';
                break;
              default:
                iconName = 'help';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#1DA1F2',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 0,
            elevation: 8,
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: {
              height: -2,
              width: 0,
            },
          },
        })}
      >
        <Tab.Screen 
          name="Timeline" 
          component={TimelineScreen}
          options={{
            title: 'Home',
          }}
        />
        <Tab.Screen 
          name="Search" 
          component={SearchScreen}
          options={{
            title: 'Search',
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            title: 'Profile',
          }}
        />
        <Tab.Screen 
          name="Notifications" 
          component={NotificationsScreen}
          options={{
            title: 'Notifications',
          }}
        />
      </Tab.Navigator>
    </PrivateRoute>
  );
};

// Main Navigator
const MainNavigator = () => {
  return (
    <PrivateRoute>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen 
          name="MurmurDetail" 
          component={MurmurDetailScreen}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="UserProfile" 
          component={UserProfileScreen}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="CreateMurmur" 
          component={CreateMurmurScreen}
          options={{
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </PrivateRoute>
  );
};

// Root Navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // You can return a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;

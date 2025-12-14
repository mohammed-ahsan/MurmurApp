import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Components
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

// Hooks
import { useUsers, useUI } from '../../store/hooks';

// Types
import { User } from '../../types';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);
  
  const router = useRouter();
  const { searchUsersAction, clearSearch, ...usersState } = useUsers();
  const { searchQuery, setSearchQuery, setSearchActive } = useUI();

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  useEffect(() => {
    // Sync with global search state
    if (searchQuery !== query) {
      setQuery(searchQuery);
    }
  }, [searchQuery]);

  const handleSearch = useCallback((searchText: string) => {
    setQuery(searchText);
    setSearchQuery(searchText);
    setSearchActive(searchText.length > 0);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (searchText.trim().length === 0) {
      clearSearch();
      return;
    }

    const timeout = setTimeout(() => {
      searchUsersAction({ query: searchText.trim(), limit: 20 });
    }, 300);

    setSearchTimeout(timeout);
  }, [searchTimeout, searchUsersAction, clearSearch, setSearchQuery, setSearchActive]);

  const handleUserPress = useCallback((user: User) => {
    router.push(`/user/${user.id}` as any);
  }, [router]);

  const renderUser = useCallback(({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.displayName.charAt(0).toUpperCase()}
        </Text>
      </View>
      
      <View style={styles.userInfo}>
        <Text style={styles.displayName}>{item.displayName}</Text>
        <Text style={styles.username}>@{item.username}</Text>
        {item.bio && <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>}
        
        <View style={styles.stats}>
          <Text style={styles.statText}>
            <Text style={styles.statNumber}>{item.followingCount}</Text> Following
          </Text>
          <Text style={styles.statText}>
            <Text style={styles.statNumber}>{item.followersCount}</Text> Followers
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  ), [handleUserPress]);

  const renderEmptyState = useCallback(() => {
    if (query.trim().length === 0) {
      return (
        <EmptyState
          title="Search Users"
          subtitle="Find people to follow and see their murmurs"
          icon="🔍"
        />
      );
    }

    if (!usersState.search.isLoading && usersState.search.users.length === 0) {
      return (
        <EmptyState
          title="No Results"
          subtitle={`No users found for "${query}"`}
          icon="🔍"
        />
      );
    }

    return null;
  }, [query, usersState.search.isLoading, usersState.search.users.length]);

  if (usersState.search.isLoading && usersState.search.users.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={handleSearch}
          placeholder="Search users..."
          placeholderTextColor="#657786"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => handleSearch('')}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={usersState.search.users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={usersState.search.users.length === 0 ? styles.emptyContainer : null}
        ListFooterComponent={
          usersState.search.isLoading ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#1DA1F2" />
            </View>
          ) : null
        }
      />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F7F9FA',
    borderRadius: 20,
    marginRight: 8,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#657786',
  },
  emptyContainer: {
    flexGrow: 1,
  },
  userItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1DA1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14171A',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: '#657786',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: '#14171A',
    lineHeight: 20,
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
  },
  statText: {
    fontSize: 12,
    color: '#657786',
    marginRight: 16,
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#14171A',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default SearchScreen;

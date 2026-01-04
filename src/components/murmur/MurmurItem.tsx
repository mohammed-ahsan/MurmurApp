import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../../store/hooks';
import { Murmur } from '../../types';

interface MurmurItemProps {
  murmur: Murmur;
  onLike: (murmurId: string) => void;
  onDelete: (murmurId: string) => void;
  onMurmurPress: (murmur: Murmur) => void;
  onUserPress: (userId: string) => void;
}

const MurmurItem: React.FC<MurmurItemProps> = ({
  murmur,
  onLike,
  onDelete,
  onMurmurPress,
  onUserPress,
}) => {
  const { user } = useAuth();
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    
    return new Date(date).toLocaleDateString();
  };

  const handleLike = () => {
    onLike(murmur.id);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Murmur',
      'Are you sure you want to delete this murmur?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(murmur.id) },
      ]
    );
  };

  const handleMurmurPress = () => {
    onMurmurPress(murmur);
  };

  const handleUserPress = () => {
    onUserPress(murmur.userId);
  };

  const isOwnMurmur = user?.id === murmur.userId;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleUserPress}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {murmur.user.displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleUserPress} style={styles.userInfo}>
            <Text style={styles.displayName}>{murmur.user.displayName}</Text>
            <Text style={styles.username}>@{murmur.user.username}</Text>
          </TouchableOpacity>
          <Text style={styles.timestamp}>{formatDate(murmur.createdAt)}</Text>
        </View>

        {isOwnMurmur && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity onPress={handleMurmurPress} style={styles.contentContainer}>
        <Text style={styles.content}>{murmur.content}</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
          <Text style={[styles.actionText, murmur.isLikedByUser && styles.liked]}>
            {murmur.isLikedByUser ? '❤️' : '🤍'}
          </Text>
          <Text style={[styles.actionCount, murmur.isLikedByUser && styles.liked]}>
            {murmur.likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleMurmurPress} style={styles.actionButton}>
          <Text style={styles.actionText}>💬</Text>
          <Text style={styles.actionCount}>{murmur.repliesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleMurmurPress} style={styles.actionButton}>
          <Text style={styles.actionText}>🔄</Text>
          <Text style={styles.actionCount}>{murmur.retweetsCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 8,
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
  headerContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  displayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14171A',
    marginRight: 8,
  },
  username: {
    fontSize: 14,
    color: '#657786',
  },
  timestamp: {
    fontSize: 12,
    color: '#657786',
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  contentContainer: {
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#14171A',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  actionText: {
    fontSize: 16,
    marginRight: 4,
  },
  actionCount: {
    fontSize: 14,
    color: '#657786',
  },
  liked: {
    color: '#E0245E',
  },
});

export default MurmurItem;

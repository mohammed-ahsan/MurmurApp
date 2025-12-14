import React from 'react';
import { Modal, Pressable, StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import CreateMurmurScreen from '../src/screens/murmur/CreateMurmurScreen';

export default function ModalScreen() {
  const router = useRouter();

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={true}
      onRequestClose={() => router.back()}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Create Murmur</Text>
          <View style={styles.placeholder} />
        </View>
        <CreateMurmurScreen />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1DA1F2',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14171A',
  },
  placeholder: {
    width: 34,
  },
});

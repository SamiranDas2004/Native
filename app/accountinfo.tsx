import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import React, { useState } from 'react';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3 - 12;

type TabType = 'uploads' | 'downloads' | 'liked';

const AccountInfo = () => {
  const [activeTab, setActiveTab] = useState<TabType>('uploads');

  // Sample data - Replace with your actual data
  const sampleData = {
    uploads: [
      { id: '1', imageUrl: 'https://picsum.photos/200/303', likes: 245 },
      { id: '2', imageUrl: '/api/placeholder/400/800', likes: 189 },
      { id: '3', imageUrl: '/api/placeholder/400/800', likes: 321 },
      { id: '4', imageUrl: '/api/placeholder/400/800', likes: 178 },
      { id: '5', imageUrl: '/api/placeholder/400/800', likes: 432 },
      { id: '6', imageUrl: '/api/placeholder/400/800', likes: 156 },
    ],
    downloads: [
      { id: '7', imageUrl: '/api/placeholder/400/800', date: '2024-03-28' },
      { id: '8', imageUrl: '/api/placeholder/400/800', date: '2024-03-27' },
      { id: '9', imageUrl: '/api/placeholder/400/800', date: '2024-03-26' },
      { id: '10', imageUrl: '/api/placeholder/400/800', date: '2024-03-25' },
    ],
    liked: [
      { id: '11', imageUrl: '/api/placeholder/400/800', author: 'John Doe' },
      { id: '12', imageUrl: '/api/placeholder/400/800', author: 'Jane Smith' },
      { id: '13', imageUrl: '/api/placeholder/400/800', author: 'Mike Johnson' },
      { id: '14', imageUrl: '/api/placeholder/400/800', author: 'Sarah Williams' },
    ],
  };

  const renderWallpaperItem = ({ item }: any) => (
    <TouchableOpacity style={styles.wallpaperItem}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.wallpaperImage}
        resizeMode="cover"
      />
      <View style={styles.wallpaperOverlay}>
        {activeTab === 'uploads' && (
          <Text style={styles.overlayText}>❤️ {item.likes}</Text>
        )}
        {activeTab === 'downloads' && (
          <Text style={styles.overlayText}>📅 {item.date}</Text>
        )}
        {activeTab === 'liked' && (
          <Text style={styles.overlayText}>👤 {item.author}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const TabButton = ({ title, isActive, onPress }: any) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={onPress}
    >
      <Text style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>J</Text>
          </View>
          <Text style={styles.username}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{sampleData.uploads.length}</Text>
            <Text style={styles.statLabel}>Uploads</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{sampleData.downloads.length}</Text>
            <Text style={styles.statLabel}>Downloads</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{sampleData.liked.length}</Text>
            <Text style={styles.statLabel}>Liked</Text>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TabButton
          title="Uploads"
          isActive={activeTab === 'uploads'}
          onPress={() => setActiveTab('uploads')}
        />
        <TabButton
          title="Downloads"
          isActive={activeTab === 'downloads'}
          onPress={() => setActiveTab('downloads')}
        />
        <TabButton
          title="Liked"
          isActive={activeTab === 'liked'}
          onPress={() => setActiveTab('liked')}
        />
      </View>

      {/* Wallpaper Grid */}
      <FlatList
        data={sampleData[activeTab]}
        renderItem={renderWallpaperItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.wallpaperGrid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Light background color
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f9f9f9', // Light header background
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dcdcdc', // Lighter background for profile image
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileInitial: {
    fontSize: 32,
    color: '#333', // Dark text color for contrast
    fontWeight: 'bold',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#555', // Lighter color for email
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333', // Dark text for numbers
  },
  statLabel: {
    fontSize: 12,
    color: '#555', // Lighter text for labels
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#333', // Dark underline for active tab
  },
  tabButtonText: {
    fontSize: 16,
    color: '#333', // Dark text for tab buttons
  },
  activeTabButtonText: {
    color: '#333', // Keep active tab text dark
  },
  wallpaperGrid: {
    padding: 4,
  },
  wallpaperItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.5,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  wallpaperImage: {
    width: '100%',
    height: '100%',
  },
  wallpaperOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Lighter overlay background
  },
  overlayText: {
    color: '#333', 
    fontSize: 12,
  },
});

export default AccountInfo;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3 - 12;

type TabType = 'uploads' | 'downloads' | 'liked';

const AccountInfo = () => {
  const [activeTab, setActiveTab] = useState<TabType>('uploads');
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (activeTab === 'uploads') {
      fetchUploads();
    } else {
      setImages([]); // Clear images when switching tabs (optional)
    }
  }, [activeTab]);

  const fetchUploads = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "User is not authenticated.");
        return;
      }
  
      const response = await axios.post(
        "http://192.168.29.108:8000/post/getPost",
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
  
      if (response.data.posts) {
        setImages(response.data.posts.map((img: { imageUrl: string }) => img.imageUrl));
      
      } else {
        Alert.alert("Error", "Unexpected response format.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert("Error", error.response?.data?.message || "Something went wrong while fetching uploads.");
      } else {
        console.error("Unexpected error:", error);
        Alert.alert("Error", "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  const renderWallpaperItem = ({ item }: { item: string }) => {

    return (
      <TouchableOpacity style={styles.wallpaperItem}>
        <Image
          source={{ uri: item }}
          style={styles.wallpaperImage}
          resizeMode="cover"
        />
        {/* <View style={styles.wallpaperOverlay}>
          {activeTab === 'uploads' && (
            <Text style={styles.overlayText}>❤️ {item.likes}</Text>
          )}
        </View> */}
      </TouchableOpacity>
    );
  };
  
  

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
      {activeTab==="uploads" ? (
        
        <FlatList
        data={images}
        renderItem={renderWallpaperItem}
        keyExtractor={(item, index) => item.toString()} 
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.wallpaperGrid}
      />
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f9f9f9',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dcdcdc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileInitial: {
    fontSize: 32,
    color: '#333',
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
    color: '#555',
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
    borderBottomColor: '#333',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#333',
  },
  activeTabButtonText: {
    color: '#333',
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  overlayText: {
    color: '#333',
    fontSize: 12,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#555',
  },
});

export default AccountInfo;

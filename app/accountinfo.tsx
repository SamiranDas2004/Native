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
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from '@expo/vector-icons';
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3 - 12;

type TabType = 'uploads' | 'downloads' | 'liked';

const AccountInfo = () => {
  const [activeTab, setActiveTab] = useState<TabType>('uploads');
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      if (!storedToken) {
        Alert.alert('Error', 'User is not authenticated.');
        return;
      }
      setToken(storedToken);
    };
    getToken();
  }, []);
  
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!token) return;
  
      try {
        const response = await axios.post(
          'http://192.168.0.108:8000/post/getProfilePicture',
          {},
          { headers: { Authorization: `${token}` } }
        );
        setProfileImage(response.data.imageUrl);
        console.log(response.data.imageUrl);
      } catch (error) {
        console.error('Failed to fetch profile image:', error);
      }
    };
    fetchProfileImage();
  }, [token]);
  
  useEffect(() => {
    if (!token) return;

    if (activeTab === 'uploads') {
      fetchUploads();
    } else if (activeTab === 'downloads') {
      fetchDownloads();
    }
    else if (activeTab === 'liked') {
      fetchLikedByMe();
    } else {
      setImages([]); // Clear images when switching tabs
    }
  }, [activeTab, token]);

  const fetchUploads = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://192.168.0.108:8000/post/getPost',
        {},
        { headers: { Authorization: `${token}` } }
      );
      

      if (response.data.posts) {
        setImages(response.data.posts.map((img: { imageUrl: string }) => img.imageUrl));
      } else {
        Alert.alert('Error', 'Unexpected response format.');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to fetch uploads.'
          : 'An unexpected error occurred.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDownloads = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://192.168.0.108:8000/post/getdownload',
        {},
        { headers: { Authorization: `${token}` } }
      );
console.log(response.data);

      if (response.data.posts) {
        setImages(response.data.posts.map((img: { imageUrl: string }) => img.imageUrl));
      } else {
        Alert.alert('Error', 'Unexpected response format.');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to fetch downloads.'
          : 'An unexpected error occurred.'
      );
    } finally {
      setLoading(false);
    }
  };


  const fetchLikedByMe=async()=>{
    setLoading(true)
    try {
      const response = await axios.post(
        'http://192.168.0.108:8000/post/getLikedByYou',
        {},
        { headers: { Authorization: `${token}` } }
      );
console.log(response.data);

      if (response.data.posts) {
        setImages(response.data.posts.map((img: { imageUrl: string }) => img.imageUrl));
      } else {
        Alert.alert('Error', 'Unexpected response format.');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to fetch downloads.'
          : 'An unexpected error occurred.'
      );
    } finally {
      setLoading(false);
    }
  }

  const renderWallpaperItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.wallpaperItem}>
      <Image
        source={{ uri: item }}
        style={styles.wallpaperImage}
        resizeMode="cover"
      />
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


  const handleProfileImageUpload = async () => {
    try {
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'You need to grant gallery permissions to upload a profile picture.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        // Create form data for upload
        const formData = new FormData();
        formData.append('imageUrl', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'profile-image.jpg',
        }as any);

        // Upload to server
        const response = await axios.post(
          'http://192.168.0.108:8000/users/updatePhhoto',
          formData,
          {
            headers: {
              Authorization: `${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response.data.success) {
          setProfileImage(result.assets[0].uri);
          Alert.alert('Success', 'Profile image updated successfully');
        }
      }
    } catch (error) {
      Alert.alert(
        'Error',
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to upload profile image.'
          : 'An unexpected error occurred.'
      );
    }
  };

  return (
   <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={handleProfileImageUpload}
          >
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.profileImage}>
                <Text style={styles.profileInitial}>J</Text>
              </View>
            )}
            <View style={styles.cameraIconContainer}>
            <FontAwesome name="camera" size={20} color="#fff" />

            </View>
          </TouchableOpacity>
          <Text style={styles.username}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
        </View>
      </View>

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

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={images}
          renderItem={renderWallpaperItem}
          keyExtractor={(item, index) => `${item}-${index}`}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.wallpaperGrid}
        />
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
  profileImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dcdcdc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#333',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
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

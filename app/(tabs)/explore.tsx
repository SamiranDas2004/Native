import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import React, { useState, useMemo, useEffect } from 'react';
import DownloadPage from '@/components/DownloadPage';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';
import MasonryList from '@react-native-seoul/masonry-list';

const { width } = Dimensions.get('window');
const numColumns = 2;
const gap = 12;
const cardWidth = (width - gap * (numColumns + 1)) / numColumns;

interface Post {
  likedBy: any;
  _id: string;
  title: string;
  imageUrl: string;
  createdBy: string;
  createdAt: string;
  likes: number;
  height?: number;
}

interface ImageCardProps {
  title: string;
  imageUrl: string;
  onPress: () => void;
  likes: number;
  height: number;
}

const ImageCard: React.FC<ImageCardProps> = ({ title, imageUrl, onPress, likes, height }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: cardWidth,
        marginBottom: gap,
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
      }}
    >
      <Image
        source={{ uri: imageUrl }}
        style={{
          width: '100%',
          height: height,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
        resizeMode="cover"
      />
      <View 
        style={{ 
          // padding: 12,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopWidth: 1,
          borderColor: 'rgba(0,0,0,0.05)',
        }}
      >
        {/* <Text 
          numberOfLines={1} 
          style={{ 
            fontSize: 14, 
            fontWeight: '600',
            flex: 1,
            marginRight: 8,
          }}
        >
          {title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome name="heart" size={14} color="#FF4444" />
          <Text style={{ marginLeft: 4, color: '#666', fontSize: 12 }}>{likes}</Text>
        </View> */}
      </View>
    </TouchableOpacity>
  );
};

const Explore: React.FC = () => {
  const [openPage, setOpenPage] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [createdBy, setCreatedBy] = useState<string | null>(null);
  const [postedDate, setPostedDate] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [images, setImages] = useState<Post[]>([]);

  const handleToggle = () => setOpenPage(!openPage);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ posts: Post[] }>("http://192.168.29.108:8000/post/getall");
        if (response.data?.posts) {
          const postsWithDimensions = response.data.posts.map(post => ({
            ...post,
            height: Math.floor(Math.random() * (320 - 200 + 1) + 200),
          }));
          // Shuffle the array before setting it to state
          const randomizedPosts = shuffleArray(postsWithDimensions);
          setImages(randomizedPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, []);

  const handleCardPress = (imageUrl: string, title: string, createdBy: string, postedDate: string, id: string) => {
    setSelectedImage(imageUrl);
    setTitle(title);
    setCreatedBy(createdBy);
    setPostedDate(postedDate);
    setOpenPage(true);
    setId(id);
  };

  const filteredImages = useMemo(() => {
    return images.filter(card =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [images, searchQuery]);

  const renderItem = ({ item, i }: { item: Post; i: number }) => (
    <ImageCard
      key={item._id}
      title={item.title}
      imageUrl={item.imageUrl}
      likes={item.likes}
      height={item.height || 250}
      onPress={() => handleCardPress(item.imageUrl, item.title, item.createdBy, item.createdAt, item._id)}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ flex: 1 }}>
        {/* Search Bar */}
        <View style={{
          padding: 12,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: 12,
            paddingHorizontal: 12,
          }}>
            <FontAwesome name="search" size={20} color="#666" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Search Wallpapers..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                flex: 1,
                paddingVertical: 12,
                fontSize: 16,
              }}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <FontAwesome name="times-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Close Button */}
        {openPage && (
          <TouchableOpacity 
            onPress={handleToggle}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              zIndex: 1,
              backgroundColor: 'white',
              padding: 12,
              borderRadius: 24,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <FontAwesome name="close" size={24} color="black" />
          </TouchableOpacity>
        )}
        
        {/* Masonry Grid */}
        <MasonryList
          data={filteredImages}
          keyExtractor={(item: Post) => item._id}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: gap,
            paddingTop: gap,
          }}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
        
        {/* Download Page */}
        {openPage && selectedImage && title && createdBy && postedDate && (
          <DownloadPage
            title={title}
            createdBy={createdBy}
            postedDate={postedDate}
            imageUrl={selectedImage}
            id={id}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Explore;
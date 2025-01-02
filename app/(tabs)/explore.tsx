import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import React, { useState, useMemo, useEffect } from 'react';
import DownloadPage from '@/components/DownloadPage';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';

interface Post {
  likedBy: any;
  _id: string;
  title: string;
  imageUrl: string;
  createdBy: string;
  createdAt: string;
  likes: number;
}

interface ImageCardProps {
  title: string;
  imageUrl: string;
  onPress: () => void;
  likes: number;
  // onLike: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ title, imageUrl, onPress, likes }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: '45%',
        marginHorizontal: '2.5%',
        marginVertical: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Image
        source={{ uri: imageUrl }}
        style={{
          width: '100%',
          height: 150,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
        resizeMode="cover"
      />
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '500' }}>{title}</Text>
        <TouchableOpacity 
         
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}
        >
          <FontAwesome name="heart" size={16} color="#FF4444" />
          <Text style={{ marginLeft: 5, color: '#666' }}>{likes}</Text>
        </TouchableOpacity>
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

  // const handleLike = async (postId: string) => {
  //   try {
  //     await axios.post(`http://192.168.29.108:8000/post/like/${postId}`);
  //     setImages(prevImages =>
  //       prevImages.map(image =>
  //         image._id === postId
  //           ? { ...image, likes: (image.likes || 0) + 1 }
  //           : image
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error liking post:", error);
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ posts: Post[] }>("http://192.168.29.108:8000/post/getall");
        if (response.data?.posts) {
          const postsWithLikes = response.data.posts.map(post => ({
            ...post,
            likes: post.likedBy.length || 0
          }));
          setImages(postsWithLikes);
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={{
          padding: 10,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: 10,
            paddingHorizontal: 10,
          }}>
            <FontAwesome name="search" size={20} color="#666" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Search Wallpapers..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                flex: 1,
                paddingVertical: 10,
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

        {openPage && (
          <TouchableOpacity 
            onPress={handleToggle}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              zIndex: 1,
              backgroundColor: 'white',
              padding: 8,
              borderRadius: 20,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <FontAwesome name="close" size={24} color="black" />
          </TouchableOpacity>
        )}
        
        <ScrollView 
          contentContainerStyle={{ padding: 10 }}
          showsVerticalScrollIndicator={false} 
        >
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
            }}
          >
            {filteredImages.map((card) => (
              <ImageCard
                key={card._id}
                title={card.title}
                imageUrl={card.imageUrl}
                likes={card.likes}
                onPress={() => handleCardPress(card.imageUrl, card.title, card.createdBy, card.createdAt, card._id)}
                
              />
            ))}
          </View>
        </ScrollView>
        
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
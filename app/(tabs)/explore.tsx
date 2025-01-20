import { View, Text, Image, TouchableOpacity, TextInput, Dimensions, FlatList } from 'react-native';
import React, { useState, useMemo, useEffect } from 'react';
import DownloadPage from '@/components/DownloadPage';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';

const { width } = Dimensions.get('window');
const numColumns = 2;
const gap = 12;
const cardWidth = (width - gap * (numColumns + 1)) / numColumns;

interface Post {
  isPaid: boolean;  // Make sure it's a boolean
  likedBy: any;
  _id: string;
  title: string;
  imageUrl: string;
  createdBy: string;
  createdAt: string;
  likes: number;
  amount:string;
  height?: number;
}


interface ImageCardProps {
  title: string;
  imageUrl: string;
  onPress: () => void;
  likes: number;
  height: number;
}

const ImageCard: React.FC<ImageCardProps & { isPaid?: boolean }> = ({ 
  title, 
  imageUrl, 
  onPress, 
  likes, 
  height, 
  isPaid = false 
}) => {
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
     
      {isPaid && (
        <View
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            padding: 4,
            borderRadius: 12,
          }}
        >
            <FontAwesome name="star" size={18} color="#FFD700" />
        </View>
      )}
    </TouchableOpacity>
  );
};


// Custom hook to organize data into columns
const useOrganizedData = (data: Post[]) => {
  return useMemo(() => {
    const columns: Post[][] = [[], []];
    let leftHeight = 0;
    let rightHeight = 0;

    data.forEach((item) => {
      if (leftHeight <= rightHeight) {
        columns[0].push(item);
        leftHeight += (item.height || 250) + gap;
      } else {
        columns[1].push(item);
        rightHeight += (item.height || 250) + gap;
      }
    });

    return columns;
  }, [data]);
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
const [isPaid,setIsPaid]=useState(Boolean)
const [amount,setAmount]=useState(String)

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
        const response = await axios.get<{ posts: Post[] }>("http://192.168.0.108:8000/post/getall");
        if (response.data?.posts) {
          const postsWithDimensions = response.data.posts.map(post => ({
            ...post,
            height: Math.floor(Math.random() * (320 - 200 + 1) + 200),
          }));
          const randomizedPosts = shuffleArray(postsWithDimensions);
          setImages(randomizedPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, []);

  const handleCardPress = (
    imageUrl: string,
    title: string,
    createdBy: string,
    isPaid: boolean,  // Ensure this is a boolean
    postedDate: string,
    id: string,
    amount:string,
  ) => {
    setSelectedImage(imageUrl);
    setTitle(title);
    setCreatedBy(createdBy);
    setPostedDate(postedDate);
    setOpenPage(true);
    setId(id);
    setIsPaid(isPaid); 
    setAmount(amount) // Use the `isPaid` boolean value
  };
  

  const filteredImages = useMemo(() => {
    return images.filter(card =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [images, searchQuery]);

  // Use the custom hook to organize data into columns
  const columns = useOrganizedData(filteredImages);

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
        
        {/* Custom Masonry Layout */}
        <View 
          style={{ 
            flex: 1, 
            paddingHorizontal: gap,
            paddingTop: gap,
            flexDirection: 'row',
          }}
        >
          {columns.map((column, columnIndex) => (
            <View 
              key={columnIndex} 
              style={{ 
                flex: 1,
                marginLeft: columnIndex > 0 ? gap : 0,
              }}
            >
<FlatList
  data={column}
  keyExtractor={(item) => item._id}
  renderItem={({ item }) => (
    <ImageCard
      title={item.title}
      imageUrl={item.imageUrl}
      likes={item.likes}
      height={item.height || 250}
      isPaid={item.isPaid}  // Ensure this is passed as a boolean
      onPress={() => handleCardPress(
        item.imageUrl,
        item.title,
        item.createdBy,
        item.isPaid,  // Pass isPaid here
        item.createdAt,
        item._id,
        item.amount
      )}
    />
  )}
  showsVerticalScrollIndicator={false}
/>


            </View>
          ))}
        </View>
        
        {/* Download Page */}
        {openPage && selectedImage && title && createdBy && postedDate && (
          <DownloadPage
            title={title}
            createdBy={createdBy}
            postedDate={postedDate}
            imageUrl={selectedImage}
            isPaid={isPaid}

            amount={amount}
            id={id!}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Explore;
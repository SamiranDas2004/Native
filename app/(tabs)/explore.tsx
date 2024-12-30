import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import React, { useState, useMemo } from 'react';
import DownloadPage from '@/components/DownloadPage';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface ImageCardProps {
  title: string;
  imageUrl: string;
  onPress: () => void;
}

interface ImageCardData {
  id: number;
  title: string;
  imageUrl: string;
  createdBy: string;
  postedDate: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ title, imageUrl, onPress }) => {
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
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleToggle = () => {
    setOpenPage(!openPage);
  };

  const handleCardPress = (imageUrl: string, title: string, createdBy: string, postedDate: string) => {
    setSelectedImage(imageUrl);
    setTitle(title);
    setCreatedBy(createdBy);
    setPostedDate(postedDate);
    setOpenPage(true);
  };

  const imageCards: ImageCardData[] = [
    {
      id: 1,
      title: 'Nature View',
      imageUrl: 'https://res.cloudinary.com/dfjfjovut/image/upload/v1733767260/iaxgwdk2nprvc6qh6hiz.png',
      createdBy: "Samiran",
      postedDate: "20-12-2024",
    },
    {
      id: 2,
      title: 'City Landscape',
      imageUrl: 'https://picsum.photos/200/301',
      createdBy: "John Doe",
      postedDate: "15-11-2024",
    },
    {
      id: 3,
      title: 'Mountain Peak',
      imageUrl: 'https://picsum.photos/200/302',
      createdBy: "Alice Smith",
      postedDate: "10-10-2024",
    },
    {
      id: 4,
      title: 'Ocean Waves',
      imageUrl: 'https://picsum.photos/200/303',
      createdBy: "Bob Brown",
      postedDate: "05-09-2024",
    },
    {
      id: 5,
      title: 'Forest Path',
      imageUrl: 'https://picsum.photos/200/304',
      createdBy: "Charlie Johnson",
      postedDate: "01-08-2024",
    },
    {
      id: 6,
      title: 'Desert Sunset',
      imageUrl: 'https://picsum.photos/200/305',
      createdBy: "Diana Lee",
      postedDate: "25-07-2024",
    },
    {
      id: 7,
      title: 'Lakeside',
      imageUrl: 'https://picsum.photos/200/306',
      createdBy: "Evan Taylor",
      postedDate: "20-06-2024",
    },
    {
      id: 8,
      title: 'Snowy Mountains',
      imageUrl: 'https://picsum.photos/200/307',
      createdBy: "Fiona Martinez",
      postedDate: "15-05-2024",
    },
    {
      id: 9,
      title: 'Urban Nightlife',
      imageUrl: 'https://picsum.photos/200/308',
      createdBy: "George Wilson",
      postedDate: "10-04-2024",
    },
    {
      id: 10,
      title: 'Golden Beach',
      imageUrl: 'https://picsum.photos/200/309',
      createdBy: "Hannah Clark",
      postedDate: "05-03-2024",
    },
    {
      id: 11,
      title: 'Wildlife Safari',
      imageUrl: 'https://picsum.photos/200/310',
      createdBy: "Ian Moore",
      postedDate: "01-02-2024",
    },
    {
      id: 12,
      title: 'Autumn Forest',
      imageUrl: 'https://picsum.photos/200/311',
      createdBy: "Jane Davis",
      postedDate: "25-01-2024",
    },
  ];

  // Filter images based on search query
  const filteredImageCards = useMemo(() => {
    return imageCards.filter((card) =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Search Bar */}
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
            {filteredImageCards.map((card) => (
              <ImageCard
                key={card.id}
                title={card.title}
                imageUrl={card.imageUrl}
                onPress={() => handleCardPress(card.imageUrl, card.title, card.createdBy, card.postedDate)}
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
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Explore;
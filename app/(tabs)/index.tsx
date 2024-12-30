import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 2 - 24;

// Define types
type Wallpaper = {
  id: string;
  url: string;
  title: string;
};

type WallpaperCategories = {
  [key: string]: Wallpaper[]; 
};

const WallpaperApp = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Popular');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const categories = [
    'Popular',
    'Nature',
    'Abstract',
    'Dark',
    'Minimal',
    "Food",
    "Travel",
    'Animals',
    'Space',
    'Cars'
  ];

  // Define wallpapers with proper typing
  const wallpapers: WallpaperCategories = {
    Popular: [
      { id: '1', url: 'https://picsum.photos/400/600?random=1', title: 'Mountain Lake' },
      { id: '2', url: 'https://picsum.photos/400/600?random=2', title: 'Abstract Art' },
      { id: '3', url: 'https://picsum.photos/400/600?random=3', title: 'Night Sky' },
      { id: '4', url: 'https://picsum.photos/400/600?random=4', title: 'Ocean Waves' },
      { id: '5', url: 'https://picsum.photos/400/600?random=5', title: 'Golden Field' },
      { id: '6', url: 'https://picsum.photos/400/600?random=6', title: 'Sunset Horizon' },
      { id: '7', url: 'https://picsum.photos/400/600?random=7', title: 'Urban Cityscape' },
      { id: '8', url: 'https://picsum.photos/400/600?random=8', title: 'Blooming Flowers' },
      { id: '9', url: 'https://picsum.photos/400/600?random=9', title: 'Snowy Mountain' },
      { id: '10', url: 'https://picsum.photos/400/600?random=10', title: 'Forest River' },
      { id: '11', url: 'https://picsum.photos/400/600?random=11', title: 'Blue Lagoon' },
      { id: '12', url: 'https://picsum.photos/400/600?random=12', title: 'Rolling Hills' },
    ],
    Nature: [
      { id: '13', url: 'https://picsum.photos/400/600?random=13', title: 'Forest Path' },
      { id: '14', url: 'https://picsum.photos/400/600?random=14', title: 'Waterfall' },
      { id: '15', url: 'https://picsum.photos/400/600?random=15', title: 'Desert Sunset' },
      { id: '16', url: 'https://picsum.photos/400/600?random=16', title: 'Mountain Peak' },
      { id: '17', url: 'https://picsum.photos/400/600?random=17', title: 'Lush Meadow' },
      { id: '18', url: 'https://picsum.photos/400/600?random=18', title: 'Autumn Forest' },
      { id: '19', url: 'https://picsum.photos/400/600?random=19', title: 'Rocky Shore' },
      { id: '20', url: 'https://picsum.photos/400/600?random=20', title: 'Glacial Lake' },
      { id: '21', url: 'https://picsum.photos/400/600?random=21', title: 'Rainy Forest' },
      { id: '22', url: 'https://picsum.photos/400/600?random=22', title: 'Sunny Valley' },
      { id: '23', url: 'https://picsum.photos/400/600?random=23', title: 'Snow-Covered Trees' },
      { id: '24', url: 'https://picsum.photos/400/600?random=24', title: 'Calm Lake' },
    ],
    Abstract: [
      { id: '25', url: 'https://picsum.photos/400/600?random=25', title: 'Colorful Swirls' },
      { id: '26', url: 'https://picsum.photos/400/600?random=26', title: 'Geometric Shapes' },
      { id: '27', url: 'https://picsum.photos/400/600?random=27', title: 'Vibrant Lines' },
      { id: '28', url: 'https://picsum.photos/400/600?random=28', title: 'Pastel Blends' },
      { id: '29', url: 'https://picsum.photos/400/600?random=29', title: 'Pixel Art' },
      { id: '30', url: 'https://picsum.photos/400/600?random=30', title: 'Bright Doodles' },
      { id: '31', url: 'https://picsum.photos/400/600?random=31', title: 'Neon Patterns' },
      { id: '32', url: 'https://picsum.photos/400/600?random=32', title: 'Gradient Overlays' },
      { id: '33', url: 'https://picsum.photos/400/600?random=33', title: 'Liquid Gold' },
      { id: '34', url: 'https://picsum.photos/400/600?random=34', title: 'Abstract Mountains' },
      { id: '35', url: 'https://picsum.photos/400/600?random=35', title: 'Digital Circles' },
      { id: '36', url: 'https://picsum.photos/400/600?random=36', title: 'Ethereal Glow' },
    ],
    Dark: [
      { id: '37', url: 'https://picsum.photos/400/600?random=37', title: 'Starry Night' },
      { id: '38', url: 'https://picsum.photos/400/600?random=38', title: 'City at Night' },
      { id: '39', url: 'https://picsum.photos/400/600?random=39', title: 'Dark Ocean' },
      { id: '40', url: 'https://picsum.photos/400/600?random=40', title: 'Cosmic Sky' },
      { id: '41', url: 'https://picsum.photos/400/600?random=41', title: 'Midnight Forest' },
      { id: '42', url: 'https://picsum.photos/400/600?random=42', title: 'Stormy Clouds' },
      { id: '43', url: 'https://picsum.photos/400/600?random=43', title: 'Moonlit Desert' },
      { id: '44', url: 'https://picsum.photos/400/600?random=44', title: 'Dark Cityscape' },
      { id: '45', url: 'https://picsum.photos/400/600?random=45', title: 'Shadows & Lights' },
      { id: '46', url: 'https://picsum.photos/400/600?random=46', title: 'Urban Shadows' },
      { id: '47', url: 'https://picsum.photos/400/600?random=47', title: 'Night Reflections' },
      { id: '48', url: 'https://picsum.photos/400/600?random=48', title: 'Dark Fantasy' },
    ],
    Minimal: [
      { id: '49', url: 'https://picsum.photos/400/600?random=49', title: 'Simple Lines' },
      { id: '50', url: 'https://picsum.photos/400/600?random=50', title: 'Neutral Tones' },
      { id: '51', url: 'https://picsum.photos/400/600?random=51', title: 'Clean Shapes' },
      { id: '52', url: 'https://picsum.photos/400/600?random=52', title: 'Minimalist Patterns' },
      { id: '53', url: 'https://picsum.photos/400/600?random=53', title: 'White Space' },
      { id: '54', url: 'https://picsum.photos/400/600?random=54', title: 'Black & White' },
      { id: '55', url: 'https://picsum.photos/400/600?random=55', title: 'Elegant Simplicity' },
      { id: '56', url: 'https://picsum.photos/400/600?random=56', title: 'Muted Colors' },
      { id: '57', url: 'https://picsum.photos/400/600?random=57', title: 'Simple Gradient' },
      { id: '58', url: 'https://picsum.photos/400/600?random=58', title: 'Bare Lines' },
      { id: '59', url: 'https://picsum.photos/400/600?random=59', title: 'Neutral Gradient' },
      { id: '60', url: 'https://picsum.photos/400/600?random=60', title: 'Artistic Simplicity' },
    ],
    Animals: [
      { id: '15', url: 'https://picsum.photos/400/600?random=15', title: 'Lion in the Wild' },
      { id: '16', url: 'https://picsum.photos/400/600?random=16', title: 'Eagle in Flight' },
    ],
    Space: [
      { id: '17', url: 'https://picsum.photos/400/600?random=17', title: 'Galaxy View' },
      { id: '18', url: 'https://picsum.photos/400/600?random=18', title: 'Astronaut in Space' },
    ],
    Cars: [
      { id: '19', url: 'https://picsum.photos/400/600?random=19', title: 'Vintage Car' },
      { id: '20', url: 'https://picsum.photos/400/600?random=20', title: 'Modern Supercar' },
    ],
  };
  

  const handleWallpaperPress = (wallpaper: Wallpaper) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // console.log('Selected wallpaper:', wallpaper.title);
    }, 1000);
  };

  const getFilteredWallpapers = (): Wallpaper[] => {
    // console.log(wallpapers[selectedCategory]);
    
    return wallpapers[selectedCategory] || wallpapers.Popular;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.header}>Wallpapers</Text> */}
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
          >
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.wallpaperContainer}>
        <View style={styles.wallpaperGrid}>
          {getFilteredWallpapers().map((wallpaper) => (
            <TouchableOpacity
              key={wallpaper.id}
              style={styles.wallpaperCard}
              onPress={() => handleWallpaperPress(wallpaper)}
            >
              <Image
                source={{ uri: wallpaper.url }}
                style={styles.wallpaperImage}
                resizeMode="cover"
              />
              <View style={styles.wallpaperTitleContainer}>
                <Text style={styles.wallpaperTitle}>{wallpaper.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    marginTop: 44,
    color: '#000',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop:10,
    height: 40,  
    width: '100%',  
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 16,
    color: '#fff',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  wallpaperContainer: {
    paddingHorizontal: 16,
  },
  wallpaperGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  wallpaperCard: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH * 1.8,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  wallpaperImage: {
    width: '100%',
    height: '100%',
  },
  wallpaperTitleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  wallpaperTitle: {
    color: '#fff',
    fontSize: 14,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WallpaperApp;
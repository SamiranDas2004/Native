import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 2 - 24;

type Wallpaper = {
  id: string;
  backgroundUrl: string;
  artistPhotoUrl: string;
  title: string;
  artist: string;
};

const WallpaperApp = () => {
  const [selectedWallpapers, setSelectedWallpapers] = useState<Set<string>>(new Set());

  const wallpapers: Wallpaper[] = [
    {
      id: '1',
      backgroundUrl: 'https://picsum.photos/400/600?random=1',
      artistPhotoUrl: 'https://picsum.photos/200/200?random=101',
      title: 'Mountain Lake',
      artist: 'Alex Rivers'
    },
    {
      id: '2',
      backgroundUrl: 'https://picsum.photos/400/600?random=2',
      artistPhotoUrl: 'https://picsum.photos/200/200?random=102',
      title: 'Abstract Art',
      artist: 'Sarah Chen'
    },
    {
      id: '3',
      backgroundUrl: 'https://picsum.photos/400/600?random=3',
      artistPhotoUrl: 'https://picsum.photos/200/200?random=103',
      title: 'Night Sky',
      artist: 'Mike James'
    },
    {
      id: '4',
      backgroundUrl: 'https://picsum.photos/400/600?random=4',
      artistPhotoUrl: 'https://picsum.photos/200/200?random=104',
      title: 'Ocean Waves',
      artist: 'Lisa Park'
    },
    {
      id: '5',
      backgroundUrl: 'https://picsum.photos/400/600?random=5',
      artistPhotoUrl: 'https://picsum.photos/200/200?random=105',
      title: 'Golden Field',
      artist: 'Tom Wilson'
    },
    {
      id: '6',
      backgroundUrl: 'https://picsum.photos/400/600?random=6',
      artistPhotoUrl: 'https://picsum.photos/200/200?random=106',
      title: 'Sunset Horizon',
      artist: 'Emma Davis'
    },
  ];

  const handleWallpaperSelect = (id: string) => {
    const newSelected = new Set(selectedWallpapers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else if (newSelected.size < 5) {
      newSelected.add(id);
    }
    setSelectedWallpapers(newSelected);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Let's get started</Text>
        <Text style={styles.headerSubtitle}>Select 5 artists for your Home feed</Text>
      </View>
      
      <ScrollView style={styles.wallpaperContainer}>
        <View style={styles.wallpaperGrid}>
          {wallpapers.map((wallpaper) => (
            <TouchableOpacity
              key={wallpaper.id}
              style={styles.wallpaperCard}
              onPress={() => handleWallpaperSelect(wallpaper.id)}
            >
              {/* Background Image */}
              <Image
                source={{ uri: wallpaper.backgroundUrl }}
                style={styles.backgroundImage}
                resizeMode="cover"
              />
              
              {/* Gradient Overlay */}
              <View style={styles.gradientOverlay} />
              
              {/* Artist Photo Circle */}
              <View style={styles.artistPhotoContainer}>
                <View style={styles.artistPhotoOuterCircle}>
                  <Image
                    source={{ uri: wallpaper.artistPhotoUrl }}
                    style={styles.artistPhoto}
                  />
                </View>
              </View>

            
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* <TouchableOpacity 
        style={[
          styles.continueButton,
          selectedWallpapers.size === 5 && styles.continueButtonActive
        ]}
        disabled={selectedWallpapers.size !== 5}
      >
        <Text style={styles.continueButtonText}>
          Continue ({selectedWallpapers.size}/5)
        </Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
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
    height: COLUMN_WIDTH * 1.3,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(249, 248, 248, 0)',
  },
  artistPhotoContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -32 },
      { translateY: -32 }
    ],
    alignItems: 'center',
    justifyContent: 'center',
  },
  artistPhotoOuterCircle: {
    width: 74,
    height: 74,
    borderRadius: 100,
    backgroundColor: '#fff',
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  artistPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  selectionCircle: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  artistInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  artistName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  wallpaperTitle: {
    color: '#888',
    fontSize: 14,
  },
  continueButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#007AFF',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WallpaperApp;
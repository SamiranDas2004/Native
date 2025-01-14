import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  Alert,
  Animated,
  Easing,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const COLUMN_WIDTH = width / 2 - 24;

type Wallpaper = {
  id: string;
  backgroundUrl: string;
  artistPhotoUrl: string;
  title: string;
  artist: string;
};

interface Post {
  profileImage: any;
  coverImage: any;
  id: any;
  images: any;   
}

const WallpaperApp = () => {
  const [selectedWallpapers, setSelectedWallpapers] = useState<Post[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionComplete, setIsSelectionComplete] = useState(false);
  const [isAlredySelected, setIsAlredySelected] = useState(false);
  const [selectedArtistImages, setselectedArtistImages] = useState<any[]>([]);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  const wallpapers: Wallpaper[] = [
    {
      id: "1",
      backgroundUrl: "https://picsum.photos/400/600?random=1",
      artistPhotoUrl: "https://picsum.photos/200/200?random=101",
      title: "Mountain Lake",
      artist: "Alex Rivers",
    },
  ];

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Check if already selected useEffect
  useEffect(() => {
    const checkIfAlreadySelected = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          const response = await axios.get("http://192.168.0.108:8000/users/checkArtistSelection", {
            headers: {
              Authorization: `${token}`,
            },
          });

          // console.log(response.data);
          
          if (response.data) {
            setIsAlredySelected(true);
            setselectedArtistImages(response.data.length ? response.data : []);
          } else {
            setIsAlredySelected(false);
            setselectedArtistImages([]);
          }
        }
      } catch (error) {
        console.error("Error checking artist selection:", error);
        setselectedArtistImages([]);
      }
    };

    checkIfAlreadySelected();
  }, []);

  // Fetch artists data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          console.log("No token found, skipping data fetch");
          return;
        }

        const response = await axios.get<{ data: Post[] }>(
          "http://192.168.0.108:8000/users/getArtist",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (response.data?.data) {
          const randomizedPosts = shuffleArray(response.data.data);
          setSelectedWallpapers(randomizedPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, []);

  // Handle completion animation
  const runCompletionAnimation = () => {
    fadeAnim.setValue(1);
    scaleAnim.setValue(1);
    spinAnim.setValue(0);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsSelectionComplete(true);
    });
  };

  useEffect(() => {
    if (selectedIds.length === 5) {
      runCompletionAnimation();
    }
  }, [selectedIds]);

  useEffect(() => {
    if (selectedIds.length === 5) {
      const addFavArtist = async () => {
        try {
          const token = await AsyncStorage.getItem("userToken");
          if (!token) {
            Alert.alert("Error", "User is not authenticated.");
            return;
          }
// console.log(selectedIds);

          const response = await axios.post(
            "http://192.168.0.108:8000/users/addArtist",
            { idsOfArtist: selectedIds },
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );

          if (response.status === 200) {
            Alert.alert("Success", "Your favorite artists have been saved!");
          } else {
            Alert.alert("Error", "Failed to save your favorite artists.");
          }


          const response2 = await axios.get("http://192.168.0.108:8000/users/checkArtistSelection", {
            headers: {
              Authorization: `${token}`,
            },
          });

        
         
          
          if (response2.data) {
            setIsAlredySelected(true);
            setselectedArtistImages(response2.data.length ? response2.data : []);
          } else {
            setIsAlredySelected(false);
            setselectedArtistImages([]);
          }



        } catch (error) {
          console.error("Error adding favorite artists:", error);
          Alert.alert("Error", "An error occurred while saving your favorite artists.");
        }
      };
      addFavArtist();
    }
  }, [selectedIds, isAlredySelected]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 5) {
        Alert.alert(
          "Maximum Selection Reached",
          "You can only select 5 artists. Please remove one to add another.",
          [{ text: "OK" }]
        );
        return prev;
      }
      return [...prev, id];
    });
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (isAlredySelected) {
    if (selectedArtistImages.length === 0) {
      return (
        <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.mainContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { rotate: spin }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Let's get started</Text>
            <Text style={styles.headerSubtitle}>
              Select 5 artists for your Home feed ({selectedIds.length}/5)
            </Text>
          </View>
  
          <ScrollView style={styles.wallpaperContainer}>
            <View style={styles.wallpaperGrid}>
              {selectedWallpapers.map((wallpaper) => (
                <TouchableOpacity
                  key={wallpaper.profileImage}
                  style={[
                    styles.wallpaperCard,
                    selectedIds.includes(wallpaper.profileImage) &&
                      styles.selectedCard,
                  ]}
                  onPress={() => toggleSelection(wallpaper.id)}
                >
                  <Image
                    source={{ uri: wallpaper.coverImage }}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                  />
                  <View style={styles.gradientOverlay} />
                  <View style={styles.artistPhotoContainer}>
                    <View style={styles.artistPhotoOuterCircle}>
                      <Image
                        source={{ uri: wallpaper.profileImage }}
                        style={styles.artistPhoto}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
      );
    }

    return (
      <ScrollView style={styles.wallpaperContainer}>
        <View style={styles.wallpaperGrid}>
          {selectedArtistImages.map((wallpaper) => (
            <TouchableOpacity
              key={wallpaper}
              style={[
                styles.wallpaperCard,
                selectedIds.includes(wallpaper) && styles.selectedCard,
              ]}
              onPress={() => toggleSelection(wallpaper)}
            >
              <Image
                source={{ uri: wallpaper }}
                style={styles.backgroundImage}
                resizeMode="cover"
              />
              <View style={styles.gradientOverlay} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }

  // if (isSelectionComplete) {
  //   return (
  //     <SafeAreaView style={[styles.container, styles.successContainer]}>
  //       <View style={styles.successContent}>
  //         <Text style={styles.successTitle}>Amazing! 🎉</Text>
  //         <Text style={styles.successSubtitle}>
  //           Your personalized feed is ready
  //         </Text>
  //         <View style={styles.checkmarkContainer}>
  //           <Text style={styles.checkmark}>✓</Text>
  //         </View>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.mainContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { rotate: spin }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Let's get started</Text>
          <Text style={styles.headerSubtitle}>
            Select 5 artists for your Home feed ({selectedIds.length}/5)
          </Text>
        </View>

        <ScrollView style={styles.wallpaperContainer}>
          <View style={styles.wallpaperGrid}>
            {selectedWallpapers.map((wallpaper) => (
              <TouchableOpacity
                key={wallpaper.profileImage}
                style={[
                  styles.wallpaperCard,
                  selectedIds.includes(wallpaper.profileImage) &&
                    styles.selectedCard,
                ]}
                onPress={() => toggleSelection(wallpaper.id)}
              >
                <Image
                  source={{ uri: wallpaper.coverImage }}
                  style={styles.backgroundImage}
                  resizeMode="cover"
                />
                <View style={styles.gradientOverlay} />
                <View style={styles.artistPhotoContainer}>
                  <View style={styles.artistPhotoOuterCircle}>
                    <Image
                      source={{ uri: wallpaper.profileImage }}
                      style={styles.artistPhoto}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainContent: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#888",
  },
  wallpaperContainer: {
    paddingHorizontal: 16,
  },
  wallpaperGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  wallpaperCard: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH * 1.3,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  selectedCard: {
    borderColor: "#FFA500",
    borderWidth: 5,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(249, 248, 248, 0)",
  },
  artistPhotoContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -32 }, { translateY: -32 }],
    alignItems: "center",
    justifyContent: "center",
  },
  artistPhotoOuterCircle: {
    width: 74,
    height: 74,
    borderRadius: 100,
    backgroundColor: "#fff",
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  artistPhoto: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  successContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  successContent: {
    alignItems: "center",
  },
  successTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },
  successSubtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 32,
  },
  checkmarkContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  checkmark: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default WallpaperApp;
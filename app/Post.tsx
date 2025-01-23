import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const genres = [
  { id: "nature", icon: "🌿", name: "Nature" },
  { id: "motivation", icon: "💪", name: "Motivation" },
  { id: "dark", icon: "🌑", name: "Dark" },
  { id: "mountains", icon: "⛰️", name: "Mountains" },
  { id: "cityscape", icon: "🌆", name: "Cityscape" },
  { id: "minimal", icon: "◽", name: "Minimal" },
];

export default function Post() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera permission is required to take photos.");
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await checkCameraPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [2, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
      console.error(error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission needed", "Gallery permission is required to select photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!selectedImage || !selectedGenre) return;
    
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "User is not authenticated.");
        return;
      }
  
      setLoading(true);
      const formData = new FormData();
  
      const filename = selectedImage.split("/").pop() || "image.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";
  
      formData.append("imageUrl", {
        uri: selectedImage,
        name: filename,
        type,
      } as any);
  
      formData.append("title", caption);
      formData.append("genre", selectedGenre);
  
      const response = await axios.post(
        "http://192.168.0.108:8000/post/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`,
          },
        }
      );
  
      Alert.alert("Success", "Post created successfully!");
      setSelectedImage(null);
      setCaption("");
      setSelectedGenre(null);
    } catch (error) {
      console.error("Error uploading the post:", error);
  
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert("Error", `Failed to create post: ${error.response.data.message || "Unknown error"}`);
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Create Post</Text>
      </View>

      <View style={styles.genreContainer}>
        <Text style={styles.genreTitle}>Select Genre</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.genreList}>
            {genres.map((genre) => (
              <TouchableOpacity
                key={genre.id}
                style={[
                  styles.genreItem,
                  selectedGenre === genre.id && styles.selectedGenre,
                ]}
                onPress={() => setSelectedGenre(genre.id)}
              >
                <Text style={styles.genreIcon}>{genre.icon}</Text>
                <Text style={styles.genreName}>{genre.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <TextInput
        style={styles.captionInput}
        placeholder="Write a caption..."
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.imageSelector} onPress={pickImage}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="image-outline" size={40} color="#666" />
              <Text style={styles.placeholderText}>Select from Gallery</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.imageActions}>
          <TouchableOpacity 
            style={styles.cameraButton} 
            onPress={takePhoto}
          >
            <Ionicons name="camera" size={24} color="#fff" />
            <Text style={styles.cameraButtonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.postButton,
          (!selectedImage || !selectedGenre || loading) && styles.postButtonDisabled,
        ]}
        onPress={handlePost}
        disabled={!selectedImage || !selectedGenre || loading}
      >
        <Text style={styles.postButtonText}>
          {loading ? "Posting..." : "Post"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  genreContainer: {
    padding: 16,
  },
  genreTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  genreList: {
    flexDirection: "row",
    gap: 12,
  },
  genreItem: {
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    width: 80,
  },
  selectedGenre: {
    backgroundColor: "#007AFF20",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  genreIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  genreName: {
    fontSize: 12,
  },
  captionInput: {
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  imageContainer: {
    margin: 16,
  },
  imageSelector: {
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    marginBottom: 12,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
  },
  imageActions: {
    flexDirection: "row",
    justifyContent: "center",
  },
  cameraButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  cameraButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  postButton: {
    backgroundColor: "#007AFF",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  postButtonDisabled: {
    backgroundColor: "#ccc",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
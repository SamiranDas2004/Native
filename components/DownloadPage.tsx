import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text, Alert } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DownloadPageProps {
  title: string;
  imageUrl: string;
  createdBy: string;
  postedDate: string;
  id: any;
}

const DownloadPage: React.FC<DownloadPageProps> = ({ imageUrl, title, createdBy, postedDate, id }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const [downloading, setDownloading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Fetch initial like status
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          console.error("User is not authenticated.");
          return;
        }

        const response = await axios.post(
          "http://192.168.29.108:8000/post/likeStatus",
          { postId: id },
          { headers: { Authorization: `${token}` } }
        );

        setIsLiked(response.data); 
      } catch (error: any) {
        console.error("Error fetching like status:", error.message || error);
      }
    };

    fetchLikeStatus();
  }, [id]);

  const handleLike = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "User is not authenticated.");
        return;
      }

      const response = await axios.post(
        "http://192.168.29.108:8000/post/toggleLike",
        { postId: id },
        { headers: { Authorization: `${token}` } }
      );

      setIsLiked(response.data.isLiked); // Backend responds with updated `isLiked` status
      Alert.alert("Success", response.data.isLiked ? "Post liked!" : "Post unliked!");
    } catch (error) {
      Alert.alert("Error", "Failed to like/unlike the post.");
      console.error(error);
    }
  };

  const downloadImage = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "User is not authenticated.");
        return;
      }

      setDownloading(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Needed", "Please allow access to save images.");
        setDownloading(false);
        return;
      }

      const filename = imageUrl.split("/").pop() || `image-${Date.now()}.jpg`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;
      const result = await FileSystem.downloadAsync(imageUrl, fileUri);
      const asset = await MediaLibrary.createAssetAsync(result.uri);
      await MediaLibrary.createAlbumAsync("Downloads", asset, false);

      Alert.alert("Success", "Image saved to your gallery!");
      await axios.post(
        "http://192.168.29.108:8000/post/download",
        { postId: id },
        { headers: { Authorization: `${token}` } }
      );
    } catch (error) {
      Alert.alert("Error", "Failed to download the image.");
      console.error(error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
      <BottomSheetView style={styles.container}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.metadata}>Created by: {createdBy}</Text>
          <Text style={styles.metadata}>Posted on: {postedDate}</Text>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, downloading && styles.disabledButton]}
            onPress={downloadImage}
            disabled={downloading}
          >
            <FontAwesome name={downloading ? "spinner" : "download"} size={20} color="white" />
            <Text style={styles.buttonText}>{downloading ? "Downloading..." : "Download"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, isLiked && styles.likedButton]}
            onPress={handleLike}
          >
            <Text style={styles.emojiText}>❤️</Text>
            <Text style={styles.buttonText}>{isLiked ? "Unlike" : "Like"}</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  image: { width: "100%", height: 300, marginBottom: 20 },
  textContainer: { marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  metadata: { fontSize: 14, color: "gray", marginBottom: 2 },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  likedButton: { backgroundColor: "#ff4466" },
  buttonText: { color: "white", marginLeft: 10 },
  emojiText: { fontSize: 16 },
  disabledButton: { opacity: 0.5 },
});

export default DownloadPage;

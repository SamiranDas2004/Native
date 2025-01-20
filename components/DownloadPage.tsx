import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text, Alert } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RazorpayScreen from "@/app/pay";

interface DownloadPageProps {
  title: string;
  imageUrl: string;
  createdBy: string;
  postedDate: string;
  id: any;
  isPaid: boolean;
  amount: any;
}


const DownloadPage: React.FC<DownloadPageProps> = ({ 
  imageUrl, 
  title, 
  amount, 
  createdBy, 
  isPaid, 
  postedDate, 
  id 
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const [downloading, setDownloading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  // Fetch initial like status and purchase status
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          console.error("User is not authenticated.");
          return;
        }

        // Fetch like status
        const likeResponse = await axios.post(
          "http://192.168.0.108:8000/post/likeStatus",
          { postId: id },
          { headers: { Authorization: `${token}` } }
        );
        setIsLiked(likeResponse.data);

        // If it's a paid image, check if user has already purchased
        if (isPaid) {
          const purchaseResponse = await axios.post(
            "http://192.168.0.108:8000/post/isPaid",
            { postId: id },
            { headers: { Authorization: `${token}` } }
          );
          setHasPurchased(purchaseResponse.data);
          console.log(purchaseResponse.data);
          
        }
      } catch (error: any) {
        console.error("Error fetching initial data:", error.message || error);
      }
    };

    fetchInitialData();
  }, [id, isPaid]);

  const handleLike = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "User is not authenticated.");
        return;
      }

      const response = await axios.post(
        "http://192.168.0.108:8000/post/toggleLike",
        { postId: id },
        { headers: { Authorization: `${token}` } }
      );

      setIsLiked(response.data.isLiked);
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

      // Check if image is paid and user hasn't purchased
      if (isPaid && !hasPurchased) {
        setShowPayment(true);
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
        "http://192.168.0.108:8000/post/download",
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

  if (showPayment) {
    return (
      <View style={styles.payment}>
        <RazorpayScreen amounts={amount} postId={id} />
      </View>
    );
  }

  return (
    <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
      <BottomSheetView style={styles.container}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.metadata}>Created by: {createdBy}</Text>
          <Text style={styles.metadata}>Posted on: {postedDate}</Text>
          {isPaid && (
            <Text style={styles.priceText}>
              Price: ${amount} {hasPurchased && '(Purchased)'}
            </Text>
          )}
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, downloading && styles.disabledButton]}
            onPress={downloadImage}
            disabled={downloading}
          >
            <FontAwesome name={downloading ? "spinner" : "download"} size={20} color="white" />
            <Text style={styles.buttonText}>
              {downloading ? "Downloading..." : isPaid && !hasPurchased ? `Buy ($${amount})` : "Download"}
            </Text>
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
  priceText: { fontSize: 16, fontWeight: "bold", color: "#2196F3", marginTop: 5 },
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
  payment: {
    flex: 1, // Take up the full screen height // Optional: Add some padding
  },
});

export default DownloadPage;
import React, { useMemo, useRef, useState, useCallback } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text, Alert, Platform } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

interface DownloadPageProps {
  title: string;
  imageUrl: string;
  createdBy:string;
  postedDate:string
  
}

const DownloadPage: React.FC<DownloadPageProps> = ({ imageUrl,title,createdBy,postedDate }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const [downloading, setDownloading] = useState(false);
console.log(title);

  const downloadImage = async () => {
    try {
      setDownloading(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      console.log(status);
      
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
    } catch (error) {
      Alert.alert("Error", "Failed to download the image.");
      console.log(error);
      
    } finally {
      setDownloading(false);
    }
  };

  return (
    <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
    <BottomSheetView style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
      
      {/* Display the metadata */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.metadata}>Created by: {createdBy}</Text>
        <Text style={styles.metadata}>Posted on: {postedDate}</Text>
      </View>
      
      {/* Download button */}
      <TouchableOpacity
        style={[styles.downloadButton, downloading && styles.disabledButton]}
        onPress={downloadImage}
        disabled={downloading}
      >
        <FontAwesome name={downloading ? "spinner" : "download"} size={20} color="white" />
        <Text style={styles.downloadText}>{downloading ? "Downloading..." : "Download"}</Text>
      </TouchableOpacity>
    </BottomSheetView>
  </BottomSheet>
  
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  image: { width: "100%", height: 300, marginBottom: 20 },
  textContainer: { marginBottom: 20 }, // Add spacing below the metadata
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  metadata: { fontSize: 14, color: "gray", marginBottom: 2 },
  downloadButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  downloadText: { color: "white", marginLeft: 10 },
  disabledButton: { opacity: 0.5 },
});


export default DownloadPage;

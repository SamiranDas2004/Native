import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';

type PaidImage = {
  id: string;
  imageUrl: string;
  title: string;
  amount: number;
  count:string
};

type Header = {
  header: true;
};

type ListItem = PaidImage | Header;

const ArtistDashboard = () => {
  const [totalEarnings, setTotalEarnings] = useState<number | null>(null);
  const [paidImages, setPaidImages] = useState<PaidImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Error', 'User is not authenticated.');
          setLoading(false);
          return;
        }
  
        const response = await axios.post(
          'http://192.168.0.108:8000/users/dashboardData',
          {},
          { headers: { Authorization: `${token}` } }
        );
  
        console.log(response.data);
  
        const { totalEarnings, paidWallpapers } = response.data;
        setTotalEarnings(totalEarnings);
  
        // Set paidImages with the count for each wallpaper
        setPaidImages(
          paidWallpapers.map((item: any) => ({
            id: item._id,
            imageUrl: item.imageUrl,
            title: item.title,
            amount: item.amount,
            count: item.count, // Add the count value here
          }))
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch dashboard data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const renderPaidImage = ({ item }: { item: PaidImage }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
        <Text style={styles.amount}>Count: {item.count}</Text> {/* Wrap the count in a Text component */}
      </View>
    </View>
  );
  
  
  

  const renderItem = ({ item }: { item: ListItem }) => {
    if ('header' in item) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Artist Dashboard</Text>
          </View>
          <View style={styles.earnings}>
            <Text style={styles.earningsTitle}>Total Earnings</Text>
            <Text style={styles.earningsValue}>${totalEarnings?.toFixed(2) || 0}</Text>
          </View>
        </View>
      );
    }

    return renderPaidImage({ item });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <FlatList
    data={[{ header: true }, ...paidImages]}
    renderItem={renderItem}
    keyExtractor={(item, index) =>
      'header' in item ? `header-${index}` : `item-${item.id}`
    }
    contentContainerStyle={styles.listContent}
  />
  
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  earnings: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  earningsTitle: {
    fontSize: 16,
    color: '#fff',
  },
  earningsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#000',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ArtistDashboard;

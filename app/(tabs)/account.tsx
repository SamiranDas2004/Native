import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const { width, height } = Dimensions.get('window');

interface DecodedToken {
  exp: number;
}

const AccountInfo = () => {
  const [loginStatus, setLoginStatus] = useState('Sign In');
  const [isValidToken, setIsValidToken] = useState(false);

  const checkTokenExpiration = (token: string): boolean => {
    try {
      const decodedToken = jwtDecode(token) as DecodedToken;
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setLoginStatus('Sign In');
      setIsValidToken(false);
      router.replace('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token && checkTokenExpiration(token)) {
          setLoginStatus('Sign Out');
          setIsValidToken(true);
        } else {
          await AsyncStorage.removeItem('userToken');
          setLoginStatus('Sign In');
          setIsValidToken(false);
        }
      } catch (error) {
        console.error('Error checking token:', error);
        setLoginStatus('Sign In');
        setIsValidToken(false);
      }
    };

    checkToken();
  }, []);

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['#000000', '#000000']}
            style={styles.gradient}
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {isValidToken ? 'Welcome Back' : 'Hello, Guest'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {isValidToken
                  ? 'Continue your journey to a better tomorrow'
                  : 'Start your journey to a better tomorrow'}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              {isValidToken ? (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleSignOut}
                >
                  <Text style={styles.buttonText}>Sign Out</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <Link href="../signin" asChild>
                    <TouchableOpacity style={styles.primaryButton}>
                      <Text style={styles.buttonText}>{loginStatus}</Text>
                    </TouchableOpacity>
                  </Link>

                  <Link href="../signup" asChild>
                    <TouchableOpacity style={styles.secondaryButton}>
                      <Text style={styles.secondaryButtonText}>Create Account</Text>
                    </TouchableOpacity>
                  </Link>
                </>
              )}
            </View>

            <View style={styles.aboutContainer}>
              <View style={styles.aboutBlurContainer}>
                <Text style={styles.aboutTitle}>Quick Links</Text>
                <View style={styles.linkContainer}>
                  <Link href="../accountinfo" asChild>
                    <TouchableOpacity style={styles.linkButton}>
                      <Ionicons name="information-circle-outline" size={20} color="#fff" />
                      <Text style={styles.link}>Account Info</Text>
                    </TouchableOpacity>
                  </Link>

                  <View style={styles.divider} />

                  <Link href="../pay" asChild>
                    <TouchableOpacity style={styles.linkButton}>
                      <Ionicons name="shield-checkmark-outline" size={20} color="#fff" />
                      <Text style={styles.link}>Pay</Text>
                    </TouchableOpacity>
                  </Link>

                  <View style={styles.divider} />

                  {isValidToken && (
                    <Link href="../Post" asChild>
                      <TouchableOpacity style={styles.linkButton}>
                        <Ionicons name="add-circle-outline" size={20} color="#fff" />
                        <Text style={styles.link}>Post</Text>
                      </TouchableOpacity>
                    </Link>
                  )}
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    padding: 24,
    backgroundColor: '#000',
  },
  header: {
    marginTop: height * 0.08,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginTop: height * 0.08,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  aboutContainer: {
    marginTop: height * 0.1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  aboutBlurContainer: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  link: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});

export default AccountInfo;

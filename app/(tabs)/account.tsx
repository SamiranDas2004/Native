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
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const { width, height } = Dimensions.get('window');

interface DecodedToken {
  exp: number;
  type:string
}

const AccountInfo = () => {
  const [loginStatus, setLoginStatus] = useState('Sign In');
  const [isValidToken, setIsValidToken] = useState(false);
const [type,setType]=useState(String)
  const checkTokenExpiration = (token: string): boolean => {
    try {
      const decodedToken = jwtDecode(token) as DecodedToken;
setType(decodedToken.type)
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
        <ImageBackground style={styles.backgroundImage} resizeMode="cover">
          <LinearGradient colors={['#000000', '#000000']} style={styles.gradient}>
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
  <>
    <TouchableOpacity style={styles.primaryButton} onPress={handleSignOut}>
      <Text style={styles.buttonText}>Sign Out</Text>
    </TouchableOpacity>
    {type === 'Artist' && (
      <Link href="../artistDashboard" asChild>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Dashboard</Text>
        </TouchableOpacity>
      </Link>
    )}
  </>
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
    <Link href="../becomeartist" asChild>
      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Become an Artist</Text>
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
                      <Text style={styles.link}>Account Info</Text>
                    </TouchableOpacity>
                  </Link>
                  <View style={styles.divider} />
                  {/* <Link href="../pay" asChild>
                    <TouchableOpacity style={styles.linkButton}>
                      <Text style={styles.link}>Pay</Text>
                    </TouchableOpacity>
                  </Link> */}
                  {/* <View style={styles.divider} /> */}
                  {isValidToken && (
                    <Link href="../Post" asChild>
                      <TouchableOpacity style={styles.linkButton}>
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
    backgroundColor: '#000', // Fallback background
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'space-between',
    backgroundColor: 'linear-gradient(45deg, #1F1F1F, #3A3A3A)',
  },
  header: {
    marginTop: height * 0.08,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff', // Golden color for premium feel
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#EEE',
    textAlign: 'center',
    opacity: 0.8,
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
    marginTop: height * 0.1,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  secondaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700',
  },
  aboutContainer: {
    marginTop: height * 0.1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  aboutBlurContainer: {
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 16,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#333',
    width: '45%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  link: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '500',
    marginLeft: 8,
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginVertical: 16,
  },
});


export default AccountInfo;

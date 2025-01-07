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
import React from 'react';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const AccountInfo = () => {
  return (
    <ScrollView>
    <SafeAreaView style={styles.container}>
      <ImageBackground
        // source={{ uri: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
          style={styles.gradient}
        >
        

          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Welcome Back</Text>
            <Text style={styles.headerSubtitle}>
              Start your journey to a better tomorrow
            </Text>
          </View>

          {/* Buttons Container */}
          <View style={styles.buttonContainer}>
            <Link href="../signin" asChild>
              <TouchableOpacity style={styles.primaryButton}>
                <LinearGradient
                  colors={['#4CAF50', '#2E7D32']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>Sign In</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>

            <Link href="../signup" asChild>
              <TouchableOpacity style={styles.secondaryButton}>
                <BlurView intensity={80} style={styles.blurButton}>
                  <Text style={styles.secondaryButtonText}>Create Account</Text>
                </BlurView>
              </TouchableOpacity>
            </Link>
          </View>

          {/* About Section */}
          <View style={styles.aboutContainer}>
            <BlurView intensity={30} style={styles.aboutBlurContainer}>
              <Text style={styles.aboutTitle}>Quick Links</Text>
              <View style={styles.linkContainer}>
                <Link href="../accountinfo" asChild>
                  <TouchableOpacity style={styles.linkButton}>
                    <Ionicons name="information-circle-outline" size={20} color="#fff" />
                    <Text style={styles.link}>Account Info</Text>
                  </TouchableOpacity>
                </Link>
                
                <View style={styles.divider} />
                
                <Link href="../privacyPolicy" asChild>
                  <TouchableOpacity style={styles.linkButton}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#fff" />
                    <Text style={styles.link}>Privacy Policy</Text>
                  </TouchableOpacity>
                </Link>
                
                <View style={styles.divider} />
                
                <Link href="../Post" asChild>
                  <TouchableOpacity style={styles.linkButton}>
                    <Ionicons name="add-circle-outline" size={20} color="#fff" />
                    <Text style={styles.link}>Post</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </BlurView>
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
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
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
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  blurButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  aboutContainer: {
    marginTop: height * 0.1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  aboutBlurContainer: {
    padding: 20,
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
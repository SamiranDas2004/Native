import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';

const privacyPolicy = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.paragraph}>
          This is where your privacy policy content will go. Add your text here.
        </Text>
        <Text style={styles.subheading}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Your introduction text goes here. Explain the purpose of your privacy policy and how the user's data will be handled.
        </Text>
        <Text style={styles.subheading}>2. Data Collection</Text>
        <Text style={styles.paragraph}>
          Provide details about the type of data you collect from users and how you use it.
        </Text>
        <Text style={styles.subheading}>3. Data Usage</Text>
        <Text style={styles.paragraph}>
          Describe how the collected data is used to enhance the user's experience.
        </Text>
        {/* Add more sections as needed */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 20,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'justify',
  },
});

export default privacyPolicy;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

const BecomeArtist = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
    bankAccount: '',
    ifscCode: '',
    bankName: '',
  });

  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://192.168.0.108:8000/users/createArtist', {
        ...formData,
      });

      Alert.alert("Success", "Artist account created successfully!", [
        {
          text: "OK",
          onPress: () => {
            setTimeout(() => router.push("/"));
          },
        },
      ]);
    } catch (error:any) {
      console.error("Sign Up Error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Become an Artist</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
          />

          <Text style={styles.sectionTitle}>Address</Text>

          <TextInput
            style={styles.input}
            placeholder="Street"
            value={formData.address.street}
            onChangeText={(text) =>
              setFormData({ ...formData, address: { ...formData.address, street: text } })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="City"
            value={formData.address.city}
            onChangeText={(text) =>
              setFormData({ ...formData, address: { ...formData.address, city: text } })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="State"
            value={formData.address.state}
            onChangeText={(text) =>
              setFormData({ ...formData, address: { ...formData.address, state: text } })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Country"
            value={formData.address.country}
            onChangeText={(text) =>
              setFormData({ ...formData, address: { ...formData.address, country: text } })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Postal Code"
            keyboardType="numeric"
            value={formData.address.postalCode}
            onChangeText={(text) =>
              setFormData({ ...formData, address: { ...formData.address, postalCode: text } })
            }
          />

          <Text style={styles.sectionTitle}>Bank Details</Text>

          <TextInput
            style={styles.input}
            placeholder="Bank Account Number"
            keyboardType="numeric"
            value={formData.bankAccount}
            onChangeText={(text) =>
              setFormData({ ...formData, bankAccount: text })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="IFSC Code"
            value={formData.ifscCode}
            onChangeText={(text) =>
              setFormData({ ...formData, ifscCode: text })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Bank Name"
            value={formData.bankName}
            onChangeText={(text) =>
              setFormData({ ...formData, bankName: text })
            }
          />

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BecomeArtist;

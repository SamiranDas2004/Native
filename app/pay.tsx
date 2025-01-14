import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';

const Pay = () => {
  const [showWebView, setShowWebView] = useState(false);

  const handlePayment = async () => {
    try {
      // Fetch the order ID from your backend using Axios
      const response = await axios.post('http://192.168.0.108:8000/create-order', {
        amount: 5000, // Amount in INR, e.g., ₹50.00 (5000 paise)
      });

      console.log('Backend Response:', response.data);

      // Ensure order_id is present
      if (!response.data || !response.data.order_id) {
        throw new Error('Order ID not received from the backend');
      }

      const { order_id } = response.data;

      // Check if RazorpayCheckout is available
      if (!RazorpayCheckout) {
        throw new Error('RazorpayCheckout is not available');
      }

      // Proceed with Razorpay checkout
      const options = {
        description: 'Credits towards consultation',
        image: 'https://i.imgur.com/3g7nmJC.jpg',
        currency: 'INR',
        key: 'rzp_test_t19IWWdmftaUKb', // Razorpay key ID
        amount: 5000, // 5000 paise = ₹50
        name: 'Acme Corp',
        order_id, // Use the order ID received from the backend
        prefill: {
          email: 'gaurav.kumar@example.com',
          contact: '9191919191',
          name: 'Gaurav Kumar',
        },
        theme: { color: '#53a20e' },
      };

      // Check if the open method is available
      if (RazorpayCheckout.open) {
        RazorpayCheckout.open(options)
          .then((data) => {
            // Handle success
            alert(`Payment Success: ${data.razorpay_payment_id}`);
          })
          .catch((error) => {
            // Handle failure
            console.error('Payment Failed:', error);
            alert(`Payment Failed: ${error.code} | ${error.description}`);
          });
      } else {
        throw new Error('RazorpayCheckout.open method is not available');
      }
    } catch (error) {
      console.error('Payment process failed', error);
      alert('An error occurred while processing the payment. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePayment} style={styles.button}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#F37254',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Pay;

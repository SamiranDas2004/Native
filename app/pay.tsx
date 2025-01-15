import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";
import { useRouter } from "expo-router";

interface Money {
  amounts: any;
}

const RazorpayScreen: React.FC<Money> = ({ amounts }) => {
  const [amount, setAmount] = useState("2000");
  const [orderID, setOrderID] = useState<string | null>(null);
  const navigation = useRouter(); // React Navigation hook for navigation

  useEffect(() => {
    const createOrder = async () => {
      try {
        const response = await axios.post("http://192.168.0.108:8000/create-order", { amount });
        console.log(response.data);
        setOrderID(response.data.order_id);
      } catch (error) {
        console.error("Error creating order:", error);
        Alert.alert("Error", "Failed to create order. Please try again.");
      }
    };

    createOrder();
  }, [amount]);

  const handleWebViewMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);

      if (message.event === "payment.success") {
        // Send payment success details to the backend
        axios.post("http://192.168.0.108:8000/users/make-transfer", {
          razorpay_order_id: message.data.razorpay_order_id,
          razorpay_payment_id: message.data.razorpay_payment_id,
          razorpay_signature: message.data.razorpay_signature,
          artistId: "artist-id-here", // Replace with dynamic artistId
          amount: amount, // Payment amount
        })
        .then((response) => {
          Alert.alert("Success", "Payment successful and transferred to artist!");
          navigation.navigate("/"); // Navigate to home after success
        })
        .catch((error) => {
          console.error("Error processing payment transfer:", error);
          Alert.alert("Error", "Failed to process payment. Please try again.");
        });
      } else if (message.event === "payment.cancelled") {
        Alert.alert("Payment Cancelled", "You have cancelled the payment.", [
          { text: "OK", onPress: () => navigation.navigate("/") },
        ]);
      }
    } catch (error) {
      console.error("Error handling WebView message:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const razorpayHTML = `
    <html>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body>
        <script>
          var options = {
            key: "rzp_test_t19IWWdmftaUKb",  // Your Razorpay key
            amount: "${amount}", // Amount in smallest currency unit (paise)
            currency: "INR",
            name: "ACorp",
            description: "Credits towards consultation",
            order_id: "${orderID}",
            prefill: {
              name: "Yousuf",
              email: "yousu@gmail.com",
              contact: "3243242322"
            },
            theme: {
              color: "#53a20e"
            },
            handler: function (response) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                event: "payment.success",
                data: response
              }));
            },
            modal: {
              ondismiss: function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  event: "payment.cancelled"
                }));
              }
            }
          };
          var rzp = new Razorpay(options);
          rzp.open();
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {orderID ? (
        <WebView
          source={{ html: razorpayHTML }}
          javaScriptEnabled
          onMessage={handleWebViewMessage}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RazorpayScreen;

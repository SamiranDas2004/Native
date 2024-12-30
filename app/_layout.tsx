import { View, Text } from "react-native";
import React from "react";
import { Slot, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const _layout = () => {
  return (
    <GestureHandlerRootView>

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="accountinfo" options={{ headerShown: true }} />
        <Stack.Screen name="privacyPolicy" options={{ headerShown: true }} />
      </Stack>
    </GestureHandlerRootView>
  );
};

export default _layout;

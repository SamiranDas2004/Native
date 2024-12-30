import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
export default function TabLayout() {
    const theme = useColorScheme() ?? "light";
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: Colors[theme].tint, headerShown: false, tabBarStyle: {
        backgroundColor: Colors[theme].background
      }}}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'For You',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="feed" color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}



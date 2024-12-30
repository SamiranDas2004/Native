import { View, Button } from 'react-native';
import React from 'react';

const CustomButton = ({ text }: { text: string }) => {
  return (
    <View>
      <Button 
        title={text} 
        onPress={() => console.log(`${text} button pressed!`)} 
      />
    </View>
  );
};

export default CustomButton;

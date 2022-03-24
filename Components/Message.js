import React from "react";
import { Text, View } from "react-native";

export default function Message({ message }) {
  return (
    <View>
      <Text>{message.message}</Text>
      <Text>{`${message.firstName} ${message.lastName} ${message.timestamp}`}</Text>
    </View>
  );
}
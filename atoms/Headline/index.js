import React from "react";
import { StyleSheet, Text } from "react-native";

const Headline = ({ children }) => (
  <Text style={styles.headline}>{children}</Text>
);

const styles = StyleSheet.create({
  headline: {
    fontSize: 24,
    fontWeight: "bold"
  }
});

export default Headline;

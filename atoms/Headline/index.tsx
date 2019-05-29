import React, { FunctionComponent } from "react";
import { StyleSheet, Text } from "react-native";
import theme from "theme";

const Headline: FunctionComponent = ({ children }) => (
  <Text style={styles.headline}>{children}</Text>
);

const styles = StyleSheet.create({
  headline: {
    color: theme.neutrals.text,
    fontSize: 24,
    fontWeight: "bold"
  }
});

export default Headline;

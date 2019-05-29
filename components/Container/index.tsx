import React, { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";

// Colors:
import theme from "theme";

const Container: FunctionComponent = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: theme.neutrals.tenth,
    flex: 1,
    justifyContent: "center"
  }
});

export default Container;

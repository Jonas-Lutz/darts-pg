import React from "react";
import { SafeAreaView } from "react-navigation";
import { StyleSheet, View, StatusBar } from "react-native";

// Colors:
import theme from "theme";

const Container: React.FC = ({ children }) => (
  <SafeAreaView style={styles.safeArea}>
    <StatusBar barStyle="light-content" />
    <View style={styles.container}>{children}</View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.neutrals.first
  },
  container: {
    alignItems: "center",
    backgroundColor: theme.neutrals.tenth,
    marginTop: StatusBar.currentHeight,
    flex: 1,
    justifyContent: "center"
  }
});

export default Container;

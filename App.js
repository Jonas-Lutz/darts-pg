import React from "react";
import { StyleSheet, View } from "react-native";
import AppNavigator from "./navigation/AppNavigator";

// Colors:
import theme from "./theme";

// Components:

export default class App extends React.Component {
  state = {};

  render() {
    return (
      <View style={styles.container}>
        <AppNavigator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

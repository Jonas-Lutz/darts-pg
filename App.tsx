import React from "react";
import { StyleSheet, View } from "react-native";
// @ts-ignore
import AppNavigator from "./navigation/AppNavigator";

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

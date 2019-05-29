import React from "react";
import { StyleSheet, Image, View } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import { Asset, AppLoading } from "expo";

// Components:

export default class App extends React.Component {
  state = {
    isReady: false
  };

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          //@ts-ignore
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={() => console.log("kaput")}
        />
      );
    }
    return (
      <View style={styles.container}>
        <AppNavigator />
      </View>
    );
  }

  async _cacheResourcesAsync() {
    const images = [require("./assets/drkdrtsicn.png")];

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

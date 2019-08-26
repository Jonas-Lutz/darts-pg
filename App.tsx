import React, { useState, FC } from "react";
import { StyleSheet, View } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import Sentry from "sentry-expo";

Sentry.enableInExpoDevelopment = true;
Sentry.config(
  "https://6de6c97b826d4927bd01398de3e5c373@sentry.io/1538502"
).install();

const _cacheResourcesAsync = async () => {
  const images = [
    require("./assets/drkdrtsicn.png"),
    require("./assets/drkdrtsicn-sm.png")
  ];

  const cacheImages = images.map(image => {
    return Asset.fromModule(image).downloadAsync();
  });
  return Promise.all(cacheImages);
};

const App: FC = () => {
  const [isReady, setIsReady] = useState(false);

  if (!isReady) {
    return (
      <AppLoading
        //@ts-ignore
        startAsync={_cacheResourcesAsync}
        onFinish={() => setIsReady(true)}
        onError={() => console.log("kaput")}
      />
    );
  }
  return (
    <View style={styles.container}>
      <AppNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;

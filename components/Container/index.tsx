import React from "react";
import { SafeAreaView } from "react-navigation";
import { StyleSheet, View, StatusBar } from "react-native";

// Colors:
import theme from "theme";

interface Props {
  noStatusbar?: boolean;
}

const Container: React.FC<Props> = ({ children, noStatusbar = false }) => {
  if (noStatusbar) {
    return (
      <View>
        <StatusBar hidden />
        {children}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" hidden={noStatusbar} />
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
};

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
  },
  containerNoStatus: {
    alignItems: "center",
    backgroundColor: "red",
    flex: 1,
    justifyContent: "center"
  }
});

export default Container;

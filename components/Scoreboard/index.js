import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo";

// Colors:
import theme from "mydarts/theme";

const Scoreboard = ({ bust, children, flexVal }) => {
  return (
    <View style={{ flex: flexVal, width: "100%" }}>
      <View style={!bust ? styles.scoreboard : styles.scoreboardBust}>
        <LinearGradient
          colors={[
            theme.primaries.yellows.fifth,
            theme.primaries.yellows.sixth,
            theme.primaries.yellows.seventh
          ]}
        >
          {children}
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scoreboard: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginBottom: 1,
    width: "100%"
  },
  scoreboardBust: {
    alignItems: "center",
    backgroundColor: theme.supporting.red.fifth,
    flex: 1,
    justifyContent: "center",
    marginBottom: 1,
    width: "100%"
  }
});

export default Scoreboard;

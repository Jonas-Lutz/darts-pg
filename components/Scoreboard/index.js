import React from "react";
import { StyleSheet, View } from "react-native";

// Colors:
import theme from "../../theme";

const Scoreboard = ({ bust, children, flexVal }) => {
  return (
    <View style={{ flex: flexVal, width: "100%" }}>
      <View style={!bust ? styles.scoreboard : styles.scoreboardBust}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scoreboard: {
    alignItems: "center",
    backgroundColor: theme.primaries.fourth,
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

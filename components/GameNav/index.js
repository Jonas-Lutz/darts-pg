import React from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";

// Colors:
import theme from "../../theme";

const GameNav = ({
  backDisabled,
  moveOn,
  moveOnText,
  removeScore,
  underlayBack,
  underlayMove
}) => {
  return (
    <View style={styles.navContainer}>
      <View style={{ flex: 0.5 }}>
        <TouchableHighlight
          disabled={backDisabled}
          onPress={removeScore}
          style={styles.backButton}
          underlayColor={underlayBack}
        >
          <Text
            style={{
              color: backDisabled ? theme.neutrals.sixth : "black",
              fontSize: 20
            }}
          >
            Remove
          </Text>
        </TouchableHighlight>
      </View>
      <View style={{ flex: 0.5 }}>
        <TouchableHighlight
          onPress={moveOn}
          style={styles.forwardButton}
          underlayColor={underlayMove}
        >
          <Text style={{ fontSize: 20 }}>{moveOnText}</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: theme.neutrals.tenth,
    justifyContent: "space-evenly",
    flexDirection: "row",
    flex: 0.1,
    margin: 1,
    width: "100%"
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.neutrals.ninth,
    flex: 1
  },
  backButtonDisalbed: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.neutrals.tenth,
    flex: 1
  },
  forwardButton: {
    backgroundColor: theme.primaries.sixth,
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  }
});

export default GameNav;

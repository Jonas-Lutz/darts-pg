import React from "react";
import {
  StyleSheet,
  TouchableHighlight,
  Text,
  Modal,
  View
} from "react-native";

// Atoms:
import Headline from "mydarts/atoms/Headline";

// Colors:
import theme from "mydarts/theme";

const FinishedModal = ({ children, goHome, restart, undo, finished }) => {
  return (
    <Modal
      visible={finished}
      onRequestClose={() => {
        alert("closed");
      }}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View>
            <Headline>Finished</Headline>
          </View>

          <View style={{ flexDirection: "row" }}>{children}</View>
          <View style={styles.buttonWrapper}>
            <TouchableHighlight onPress={undo}>
              <View style={styles.undoBtn}>
                <Text style={styles.buttonText}>Undo</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableHighlight onPress={restart}>
              <View style={styles.newGameBtn}>
                <Text style={styles.buttonText}>New Game</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableHighlight onPress={goHome}>
              <View style={styles.homeBtn}>
                <Text style={styles.buttonText}>Home</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: theme.neutrals.ninth,
    justifyContent: "center",
    flex: 1
  },
  contentContainer: {
    alignItems: "center",
    backgroundColor: theme.neutrals.tenth,
    justifyContent: "center",
    flex: 0.9,
    width: "90%"
  },
  buttonWrapper: {
    margin: 20
  },
  buttonText: {
    fontSize: 20
  },
  homeBtn: {
    backgroundColor: theme.primaries.lightBlues.seventh,
    alignItems: "center",
    height: 65,
    justifyContent: "center",
    width: 150
  },
  newGameBtn: {
    backgroundColor: theme.primaries.lightBlues.third,
    alignItems: "center",
    height: 65,
    justifyContent: "center",
    width: 150
  },
  undoBtn: {
    backgroundColor: theme.neutrals.eighth,
    alignItems: "center",
    height: 65,
    justifyContent: "center",
    width: 150
  }
});

export default FinishedModal;

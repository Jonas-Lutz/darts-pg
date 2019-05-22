import React from "react";
import {
  StyleSheet,
  TouchableHighlight,
  Text,
  Modal,
  View
} from "react-native";

// Atoms:
import Headline from "../../atoms/Headline";

// Colors:
import theme from "../../theme";

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
              <View
                style={{
                  backgroundColor: theme.neutrals.eighth,
                  alignItems: "center",
                  height: 65,
                  justifyContent: "center",
                  width: 150
                }}
              >
                <Text style={styles.buttonText}>Undo</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableHighlight onPress={restart}>
              <View
                style={{
                  backgroundColor: theme.primaries.fifth,
                  alignItems: "center",
                  height: 65,
                  justifyContent: "center",
                  width: 150
                }}
              >
                <Text style={styles.buttonText}>New Game</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableHighlight onPress={goHome}>
              <View
                style={{
                  backgroundColor: theme.primaries.seventh,
                  alignItems: "center",
                  height: 65,
                  justifyContent: "center",
                  width: 150
                }}
              >
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
    backgroundColor: theme.primaries.eighth,
    justifyContent: "center",
    flex: 1
  },
  contentContainer: {
    alignItems: "center",
    backgroundColor: theme.neutrals.ninth,
    justifyContent: "center",
    flex: 0.9,
    width: "90%"
  },
  buttonWrapper: {
    margin: 20
  },
  buttonText: {
    fontSize: 20
  }
});

export default FinishedModal;

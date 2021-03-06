import React, { FunctionComponent } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";

// Colors:
import theme from "theme";

// Components
import PulsatingText from "components/PulsatingText";

// ==================================================================================================

type Props = {
  backDisabled?: boolean;
  headline?: string;
  moveOn: () => void;
  moveOnText: string;
  removeScore: () => void;
  runAnimation?: boolean;
  underlayBack?: string;
  underlayMove?: string;
};

// ==================================================================================================

const GameNav: FunctionComponent<Props> = ({
  backDisabled = false,
  moveOn,
  moveOnText,
  removeScore,
  runAnimation = false,
  underlayBack = theme.neutrals.eighth,
  underlayMove = theme.primaries.lightBlues.eighth
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
          <PulsatingText
            runAnimation={runAnimation}
            styles={{
              color: theme.neutrals.tenth,
              fontSize: 22
            }}
            text={moveOnText}
          />
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
    flexShrink: 0,
    flex: 1,
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
    backgroundColor: theme.primaries.lightBlues.third,
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  }
});

export default GameNav;

import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  TouchableHighlight,
  Text,
  Modal,
  View
} from "react-native";

// Atoms:
import Headline from "atoms/Headline";

// Components:
import Container from "components/Container";
import GameNav from "components/GameNav";
import Scoreboard from "components/Scoreboard";

// Colors:
import theme from "theme";

// ==================================================================================================

type Props = {
  headline?: string;
  goHome: () => void;
  restart: () => void;
  undo: () => void;
  finished: boolean;
};

// ==================================================================================================

const FinishedModal: FunctionComponent<Props> = ({
  children,
  headline = "Finished",
  goHome,
  restart,
  undo,
  finished
}) => {
  return (
    <Modal
      visible={finished}
      onRequestClose={() => {
        console.log("closed");
      }}
    >
      <Container>
        <Scoreboard flexVal={0.2}>
          <View>
            <Headline>{headline}</Headline>
          </View>
        </Scoreboard>
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 0.5 }}
        >
          {children}
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableHighlight onPress={restart}>
            <View style={styles.newGameBtn}>
              <Text style={styles.buttonText}>New Game</Text>
            </View>
          </TouchableHighlight>
        </View>
        <GameNav moveOn={goHome} moveOnText="Home" removeScore={undo} />
      </Container>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    flex: 0.2,
    margin: 20
  },
  buttonText: {
    fontSize: 20
  },
  homeButtonText: {
    color: theme.primaries.tenth,
    fontSize: 20
  },
  homeBtn: {
    backgroundColor: theme.primaries.lightBlues.third,
    alignItems: "center",
    height: 65,
    justifyContent: "center",
    width: 150
  },
  newGameBtn: {
    backgroundColor: theme.primaries.lightBlues.seventh,
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
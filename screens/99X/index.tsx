import React, { useState } from "react";
import {
  StyleSheet,
  StatusBar,
  Image,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import {
  NavigationScreenComponent,
  NavigationScreenProps
} from "react-navigation";

// Colors:
import theme from "theme";

// Components:
import Container from "components/Container";
import GameNav from "components/GameNav";
import Scoreboard from "components/Scoreboard";

// Utils
import { getLabel } from "utils/getLabel";
import goHome from "utils/goHome";

// ================================================================================================

// Props:
export interface Props extends NavigationScreenProps {
  goal: number;
  round: number;
  score: number;
}

export interface ThrownDart {
  goal: number;
  multiplier: number;
}

// ================================================================================================

const NineNineX: NavigationScreenComponent<Props> = ({ navigation }) => {
  // State
  const [round, setRound] = useState(navigation.getParam("round", 1));
  const [score, setScore] = useState(navigation.getParam("score", 0));
  const [gameHistory, setGameHistory] = useState<Array<Array<ThrownDart>>>([]);
  const [roundHistory, setRoundHistory] = useState<Array<ThrownDart>>([]);

  const goal = navigation.getParam("goal", 20);

  // ==============================================================================================

  const addScore = (multiplier: number) => {
    if (round <= 20) {
      if (roundHistory.length < 3) {
        const copyGameHistory = [...gameHistory];

        // Update new Round-History with current throw
        const newRoundHistory = [
          ...roundHistory,
          {
            goal: goal,
            multiplier: multiplier
          }
        ];

        copyGameHistory.splice(round - 1, 1, newRoundHistory);

        // Update State
        setScore(score + goal * multiplier);
        setGameHistory(copyGameHistory);
        setRoundHistory(newRoundHistory);
      }
    }
  };

  const advanceRound = () => {
    if (round <= 20) {
      let copyGameHistory = [...gameHistory];
      let filledUpRoundHistory = [...roundHistory];

      // Add Misses, if less than 3 Darts were entered
      if (filledUpRoundHistory.length < 3) {
        for (let i = filledUpRoundHistory.length; i < 3; i++) {
          filledUpRoundHistory.push({
            goal: goal,
            multiplier: 0
          });
        }
      }

      copyGameHistory.splice(round - 1, 1, filledUpRoundHistory);

      setRound(round + 1);
      setRoundHistory([]);
      setGameHistory(copyGameHistory);
    }
  };

  const removeScore = () => {
    // At least 1 dart thrown
    if (gameHistory.length > 0) {
      if (
        // Dart thrown previous or this round
        gameHistory[gameHistory.length - 1].length > 0 ||
        gameHistory.length > 1
      ) {
        let newRoundHistory = [...roundHistory];
        let updatedGameHistory = [...gameHistory];
        let subtractValue = 0;

        // IF: darts thrown this round -> rh: [{}]
        if (roundHistory.length > 0) {
          subtractValue =
            roundHistory[roundHistory.length - 1].multiplier * goal;
          newRoundHistory.pop();
          if (newRoundHistory.length > 0) {
            updatedGameHistory.splice(
              updatedGameHistory.length - 1,
              1,
              newRoundHistory
            );
          } else {
            updatedGameHistory.splice(updatedGameHistory.length - 1, 1);

            if (updatedGameHistory.length > 1) {
              updatedGameHistory[updatedGameHistory.length - 2].splice(2, 1);
            }
            if (updatedGameHistory.length > 0) {
              newRoundHistory =
                updatedGameHistory[updatedGameHistory.length - 1];
            }
          }
        }
        // ELSE: No darts thrown this round
        else {
          subtractValue =
            gameHistory[
              gameHistory.length - 2 >= 0 ? gameHistory.length - 2 : 0
            ][2].multiplier * goal;

          const prevRound = gameHistory.length < 2 ? 0 : gameHistory.length - 2;
          newRoundHistory = [...gameHistory[prevRound]];
          newRoundHistory.pop();

          if (newRoundHistory.length > 0) {
            updatedGameHistory.splice(
              updatedGameHistory.length - 1,
              1,
              newRoundHistory
            );
          } else {
            updatedGameHistory.splice(updatedGameHistory.length - 2, 2);
          }
        }

        // Update State
        setRound(updatedGameHistory.length > 0 ? updatedGameHistory.length : 1);
        setScore(score - subtractValue);
        setRoundHistory(newRoundHistory);
        setGameHistory(updatedGameHistory);
      } else {
        setRound(1);
        setGameHistory([]);
        setRoundHistory([]);
      }
    } else {
      setRound(1);
      setGameHistory([]);
      setRoundHistory([]);
    }
  };

  // ==============================================================================================

  return (
    <Container>
      <StatusBar hidden />
      <Scoreboard flexVal={0.3} goHome={() => goHome(navigation)}>
        <View style={styles.gamestats}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              width: "100%"
            }}
          >
            <Text style={{ color: theme.neutrals.text }}>
              {round < 21 ? `Round ${round}` : "Finished"}
            </Text>
            <Text style={{ color: theme.neutrals.text }}>
              {`PPR: ${(
                score / Math.max(1, round - 1 + roundHistory.length / 3)
              ).toFixed(2)}`}
            </Text>
            <Text style={{ color: theme.neutrals.text }}>
              {`MPR: ${(
                score /
                goal /
                Math.max(1, round - 1 + roundHistory.length / 3)
              ).toFixed(2)}`}
            </Text>
          </View>

          <Text style={styles.scoreLabelText}>{`${score}`}</Text>
        </View>
        <View style={styles.thrownDarts}>
          <View style={styles.dartScore}>
            {roundHistory.length > 0 ? (
              <Text style={{ color: theme.neutrals.text, fontSize: 20 }}>{`${
                roundHistory[0].multiplier < 1
                  ? "Miss"
                  : `${getLabel(roundHistory[0].multiplier)}${goal}`
              }`}</Text>
            ) : (
              <Image
                source={require("../../assets/arrow.png")}
                style={{ width: 20, height: 20 }}
              />
            )}
          </View>
          <View style={styles.dartScore}>
            {roundHistory.length > 1 ? (
              <Text style={{ color: theme.neutrals.text, fontSize: 20 }}>{`${
                roundHistory[1].multiplier < 1
                  ? "Miss"
                  : `${getLabel(roundHistory[1].multiplier)}${goal}`
              }`}</Text>
            ) : (
              <Image
                source={require("../../assets/arrow.png")}
                style={{ width: 20, height: 20 }}
              />
            )}
          </View>
          <View style={styles.dartScore}>
            {roundHistory.length > 2 ? (
              <Text style={{ color: theme.neutrals.text, fontSize: 20 }}>{`${
                roundHistory[2].multiplier < 1
                  ? "Miss"
                  : `${getLabel(roundHistory[2].multiplier)}${goal}`
              }`}</Text>
            ) : (
              <Image
                source={require("../../assets/arrow.png")}
                style={{ width: 20, height: 20 }}
              />
            )}
          </View>
        </View>
      </Scoreboard>
      <View style={styles.inputContainer}>
        {goal !== 25 && (
          <View style={{ flex: 0.25 }}>
            <TouchableHighlight
              onPress={() => addScore(3)}
              style={styles.scoreButtonTriple}
              underlayColor={theme.primaries.lightBlues.tenth}
            >
              <Text
                style={
                  !((round === 20 && roundHistory.length === 3) || round > 20)
                    ? styles.scoreButtonText
                    : styles.scoreButtonDisabledText
                }
              >{`T ${goal}`}</Text>
            </TouchableHighlight>
          </View>
        )}

        <View style={{ flex: goal === 25 ? 0.33 : 0.25 }}>
          <TouchableHighlight
            onPress={() => addScore(2)}
            style={styles.scoreButtonDouble}
            underlayColor={theme.primaries.lightBlues.tenth}
          >
            <Text
              style={
                !((round === 20 && roundHistory.length === 3) || round > 20)
                  ? styles.scoreButtonText
                  : styles.scoreButtonDisabledText
              }
            >{`D ${goal}`}</Text>
          </TouchableHighlight>
        </View>
        <View style={{ flex: goal === 25 ? 0.33 : 0.25 }}>
          <TouchableHighlight
            onPress={() => addScore(1)}
            style={styles.scoreButtonSingle}
            underlayColor={theme.primaries.lightBlues.tenth}
          >
            <Text
              style={
                !((round === 20 && roundHistory.length === 3) || round > 20)
                  ? styles.scoreButtonText
                  : styles.scoreButtonDisabledText
              }
            >{`S ${goal}`}</Text>
          </TouchableHighlight>
        </View>
        <View style={{ flex: goal === 25 ? 0.33 : 0.25 }}>
          <TouchableHighlight
            onPress={() => addScore(0)}
            style={styles.scoreButtonMiss}
            underlayColor={theme.primaries.lightBlues.tenth}
          >
            <Text
              style={
                !((round === 20 && roundHistory.length === 3) || round > 20)
                  ? styles.scoreButtonText
                  : styles.scoreButtonDisabledText
              }
            >{`Miss`}</Text>
          </TouchableHighlight>
        </View>
      </View>

      <GameNav
        backDisabled={gameHistory.length < 1}
        moveOn={() => {
          if ((round === 20 && roundHistory.length === 3) || round > 20) {
            navigation.navigate("NineNineXStats", {
              gameHistory: gameHistory,
              goal: goal,
              score: score
            });
          } else {
            advanceRound();
          }
        }}
        moveOnText={
          (round === 20 && roundHistory.length === 3) || round > 20
            ? "Finish"
            : "Next"
        }
        removeScore={removeScore}
        underlayBack={
          gameHistory.length < 1
            ? theme.neutrals.eighth
            : theme.neutrals.seventh
        }
        underlayMove={theme.primaries.lightBlues.tenth}
      />
    </Container>
  );
};

// ==============================================================================================

NineNineX.navigationOptions = {
  header: null
};

// ==============================================================================================

const styles = StyleSheet.create({
  gamestats: {
    alignItems: "center",
    flex: 0.7,
    flexDirection: "column",
    justifyContent: "space-around",
    width: "100%"
  },
  thrownDarts: {
    flex: 0.3,
    flexDirection: "row",
    width: "100%"
  },
  dartScore: {
    flex: 0.33,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10
  },
  inputContainer: {
    flex: 0.6,
    width: "100%"
  },
  scoreButtonDisabledText: {
    color: theme.neutrals.ninth,
    fontSize: 24
  },
  scoreButtonTriple: {
    backgroundColor: theme.neutrals.tenth,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
    marginTop: 1,
    height: "100%",
    width: "100%"
  },
  scoreButtonDouble: {
    backgroundColor: theme.neutrals.tenth,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
    height: "100%",
    width: "100%"
  },
  scoreButtonSingle: {
    backgroundColor: theme.neutrals.tenth,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
    height: "100%",
    width: "100%"
  },
  scoreButtonMiss: {
    backgroundColor: theme.neutrals.tenth,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%"
  },
  scoreButtonText: {
    color: theme.primaries.lightBlues.first,
    fontSize: 24
  },
  scoreLabelText: {
    color: theme.neutrals.text,
    fontSize: 26,
    fontWeight: "bold"
  }
});

export default NineNineX;

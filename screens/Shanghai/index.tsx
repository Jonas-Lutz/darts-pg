import React, { FC, useState } from "react";
import {
  AsyncStorage,
  StyleSheet,
  StatusBar,
  Text,
  TouchableHighlight,
  Image,
  View
} from "react-native";
import {
  NavigationScreenComponent,
  NavigationScreenProps,
  StackActions,
  NavigationActions
} from "react-navigation";

// Colors:
import theme from "theme";

// Components:
import Container from "components/Container";
import GameNav from "components/GameNav";
import FinishedModal from "components/FinishedModal";
import Scoreboard from "components/Scoreboard";

// Utils:
import { smallScreen } from "utils/deviceRatio";
import { getLabel } from "utils/getLabel";
import calcMPR from "utils/calcMPR";
import goHome from "utils/goHome";

// ================================================================================================
// Types:
export interface ShanghaiStats {
  highscore: number;
}

// Props:
export interface Props extends NavigationScreenProps {}

export interface ThrownDart {
  points: number;
  multiplier: number;
}

// ================================================================================================

const isSmall = smallScreen();

const Shanghai: NavigationScreenComponent<Props> = ({ navigation }) => {
  /* static navigationOptions = {
    header: null
  }; */

  const goals = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20
  ];

  const [score, setScore] = useState(0);
  const [gameHistory, setGameHistory] = useState<Array<Array<ThrownDart>>>([]);
  const [roundHistory, setRoundHistory] = useState<Array<ThrownDart>>([]);
  const [round, setRound] = useState(1);
  const [finished, setFinished] = useState(false);
  const [highscore, setHighscore] = useState(0);
  const [shanghai, setShanghai] = useState(false);
  const [multiplier, setMultiplier] = useState(1);

  const advanceRound = () => {
    if (round === 20) {
      setFinished(true);
      updateStats();
    } else {
      let filledUpRoundHistory = [...roundHistory];
      const copyGameHistory = [...gameHistory];

      // Add Misses, if less than 3 Darts were entered
      if (filledUpRoundHistory.length < 3) {
        for (let i = filledUpRoundHistory.length; i < 3; i++) {
          filledUpRoundHistory.push({
            points: 0,
            multiplier: 0
          });
        }
      }

      copyGameHistory.splice(round - 1, 1, filledUpRoundHistory);

      // Update State
      setRound(round + 1);
      setRoundHistory([]);
      setGameHistory(copyGameHistory);
      setMultiplier(1);
      setShanghai(false);
    }
  };

  const countThrow = (points: number) => {
    if (roundHistory.length < 3) {
      // Removes the current Round from Game-History
      const copyGameHistory = [...gameHistory];
      if (roundHistory.length > 0) {
        copyGameHistory.pop();
      }

      // Update new Round-History with current throw
      const newRoundHistory = [
        ...roundHistory,
        {
          points: points,
          multiplier: points === 0 ? 0 : 1
        }
      ];

      // Add Updated Round-History to Game-History
      copyGameHistory.push(newRoundHistory);

      // Shanghai ?
      const isShanghai = newRoundHistory.map(dart => dart.points);

      setGameHistory(copyGameHistory);
      setRoundHistory(newRoundHistory);
      setMultiplier(1);
      setScore(score - points * goals[round - 1]);

      if (
        isShanghai.includes(-1) &&
        isShanghai.includes(-2) &&
        isShanghai.includes(-3)
      ) {
        // Update State
        setFinished(true);
        setShanghai(true);
      } else {
        // Update State
        setFinished(false);
      }
    }
  };

  const removeScore = () => {
    // At least 1 dart thrown
    if (gameHistory.length > 0) {
      if (
        // Dart thrown previous round
        gameHistory[gameHistory.length - 1].length > 0 ||
        // or this round
        gameHistory.length > 1
      ) {
        let newRound = round;
        let newRoundHistory = [...roundHistory];
        let updatedGameHistory = [...gameHistory];
        let addValue = 0;

        // IF: darts thrown this round
        if (roundHistory.length > 0) {
          // Value to add to game score
          addValue =
            roundHistory[roundHistory.length - 1].points * goals[round - 1];

          newRoundHistory.pop();

          if (newRoundHistory.length > 0) {
            updatedGameHistory.splice(
              updatedGameHistory.length - 1,
              1,
              newRoundHistory
            );
          } else {
            updatedGameHistory.splice(updatedGameHistory.length - 1, 1);
          }
        }
        // ELSE: No darts thrown this round
        else {
          newRound = newRound - 1 >= 1 ? newRound - 1 : 1;
          addValue = gameHistory[newRound - 1][2].points * goals[newRound - 1];
          newRoundHistory = [...gameHistory[newRound - 1]];

          newRoundHistory.pop();

          if (newRoundHistory.length > 0) {
            updatedGameHistory.splice(
              updatedGameHistory.length - 1,
              1,
              newRoundHistory
            );
          } else {
            updatedGameHistory.splice(updatedGameHistory.length - 2, 1);
          }
        }

        // Update State
        setRound(newRound <= 1 ? 1 : newRound);
        setScore(score + addValue);
        setRoundHistory(newRoundHistory);
        setGameHistory(updatedGameHistory);
        setMultiplier(1);
        setFinished(false);
        setShanghai(false);
      }
    } else {
      setRound(1);
    }
  };

  // Fetch existing stats from storage
  const fetchStats = async () => {
    try {
      const value = await AsyncStorage.getItem("shanghai");
      if (value) {
        return JSON.parse(value);
      } else {
        return { highscore: 0 };
      }
    } catch {
      return { highscore: 0 };
    }
  };

  // Append new stats to old existing
  const mergeStats = (oldStats: ShanghaiStats) => {
    const highscore = Math.max(oldStats.highscore, score);
    return {
      highscore: highscore
    };
  };

  // Update stats in storage
  const saveStats = async (highscore: ShanghaiStats) => {
    try {
      const res = await AsyncStorage.setItem(
        "shanghai",
        JSON.stringify(highscore)
      );
      //@ts-ignore
      if (res) console.log("saved: ", res);
    } catch {
      console.log("error saving stats");
    }
  };

  // Calls the methods
  const updateStats = async () => {
    try {
      let currHigh = await fetchStats();
      setHighscore(currHigh.highscore);
      const mergedStats = mergeStats(currHigh);
      saveStats(mergedStats);
    } catch {
      console.log("error updating stats");
    }
  };

  return (
    <Container>
      <StatusBar hidden />
      <Scoreboard flexVal={0.3} goHome={() => goHome(navigation)}>
        <View style={styles.mprWrapper}>
          <Text style={styles.mprText}>{`MPR: ${calcMPR(
            score,
            Math.max(1, round - 1 + roundHistory.length / 3)
          )}`}</Text>
        </View>
        <View style={styles.scoreWrapper}>
          <Text style={styles.scoreText}>{`${score}`}</Text>
        </View>
        <View style={styles.dartsDisplay}>
          <View style={styles.dartsDisplayDart}>
            <Text style={styles.dartText}>
              {roundHistory.length > 0 ? (
                roundHistory[0].points === 0 ? (
                  "Miss"
                ) : (
                  `${getLabel(roundHistory[0].points * -1)}${goals[round - 1]}`
                )
              ) : (
                <Image
                  source={require("../../assets/arrow.png")}
                  style={{ width: 20, height: 20 }}
                />
              )}
            </Text>
          </View>
          <View style={styles.dartsDisplayDart}>
            <Text style={styles.dartText}>
              {roundHistory.length > 1 ? (
                roundHistory[1].points === 0 ? (
                  "Miss"
                ) : (
                  `${getLabel(roundHistory[1].points * -1)}${goals[round - 1]}`
                )
              ) : (
                <Image
                  source={require("../../assets/arrow.png")}
                  style={{ width: 20, height: 20 }}
                />
              )}
            </Text>
          </View>
          <View style={styles.dartsDisplayDart}>
            <Text style={styles.dartText}>
              {roundHistory.length > 2 ? (
                roundHistory[2].points === 0 ? (
                  "Miss"
                ) : (
                  `${getLabel(roundHistory[2].points * -1)}${goals[round - 1]}`
                )
              ) : (
                <Image
                  source={require("../../assets/arrow.png")}
                  style={{ width: 20, height: 20 }}
                />
              )}
            </Text>
          </View>
        </View>
      </Scoreboard>
      <View style={styles.buttonsWrapper}>
        {goals[round - 1] !== 25 && (
          <View style={{ flex: 0.25 }}>
            <TouchableHighlight
              onPress={() => countThrow(-3)}
              style={styles.scoreButton}
              underlayColor={theme.primaries.lightBlues.tenth}
            >
              <Text style={styles.buttonText}>{`T ${goals[round - 1]}`}</Text>
            </TouchableHighlight>
          </View>
        )}

        <View
          style={{
            flex: goals[round - 1] === 25 ? 1 / 3 : 0.25
          }}
        >
          <TouchableHighlight
            onPress={() => countThrow(-2)}
            style={styles.scoreButton}
            underlayColor={theme.primaries.lightBlues.tenth}
          >
            <Text style={styles.buttonText}>{`D ${goals[round - 1]}`}</Text>
          </TouchableHighlight>
        </View>
        <View
          style={{
            flex: goals[round - 1] === 25 ? 1 / 3 : 0.25
          }}
        >
          <TouchableHighlight
            onPress={() => countThrow(-1)}
            style={styles.scoreButton}
            underlayColor={theme.primaries.lightBlues.tenth}
          >
            <Text style={styles.buttonText}>{`S ${goals[round - 1]}`}</Text>
          </TouchableHighlight>
        </View>
        <View
          style={{
            flex: goals[round - 1] === 25 ? 1 / 3 : 0.25
          }}
        >
          <TouchableHighlight
            onPress={() => countThrow(0)}
            style={styles.scoreButton}
            underlayColor={theme.primaries.lightBlues.tenth}
          >
            <Text style={styles.buttonText}>{`Miss`}</Text>
          </TouchableHighlight>
        </View>
      </View>
      <GameNav
        backDisabled={gameHistory.length < 1}
        moveOn={advanceRound}
        moveOnText="Next"
        removeScore={removeScore}
        underlayBack={
          gameHistory.length < 1
            ? theme.neutrals.seventh
            : theme.neutrals.eighth
        }
        underlayMove={theme.primaries.lightBlues.eighth}
      />
      <FinishedModal
        goHome={() => goHome(navigation)}
        headline={shanghai ? "Shanghai!" : "Stats"}
        restart={() => {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "Shanghai"
              })
            ]
          });

          navigation.dispatch(resetAction);
        }}
        undo={removeScore}
        finished={finished}
      >
        <View style={{ flexDirection: "column" }}>
          {shanghai && <Text>Finished by Shanghai</Text>}
          <Text>{`You reached a total score of ${score} (MPR: ${(
            score / gameHistory.length
          ).toFixed(1)}).`}</Text>

          {finished && highscore < score ? (
            <Text>{`That's a new Carreer High - Gratz!`}</Text>
          ) : (
            <Text>{`Carreer High: ${highscore}`}</Text>
          )}
        </View>
      </FinishedModal>
    </Container>
  );
};

Shanghai.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  buttonsWrapper: {
    flex: 0.6,
    width: "100%",
    backgroundColor: theme.neutrals.ninth
  },
  scoreButton: {
    backgroundColor: theme.neutrals.tenth,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
    height: "100%",
    width: "100%"
  },
  mprText: {
    color: theme.neutrals.text,
    fontSize: 14
  },
  dartsDisplay: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  dartsDisplayDart: {
    alignItems: "center",
    justifyContent: "center",
    flex: 0.33
  },
  dartText: {
    color: theme.neutrals.text,
    fontSize: 20
  },
  mprWrapper: {
    flex: 0.2,
    justifyContent: "center"
  },
  scoreWrapper: {
    justifyContent: "center",
    flex: 0.7
  },
  scoreText: {
    color: theme.neutrals.text,
    fontSize: 28,
    fontWeight: "bold"
  },
  buttonText: {
    color: theme.primaries.lightBlues.first,
    fontSize: 24
  }
});

export default Shanghai;

import React, { FC, useEffect, useState } from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import {
  StackActions,
  NavigationActions,
  NavigationScreenComponent,
  NavigationScreenProps
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
import { calculateFinish } from "utils/calculateFinish";
import { getLabel } from "utils/getLabel";
import getThrownDarts from "utils/getThrownDarts";
import goHome from "utils/goHome";

const isSmall = smallScreen();

// ================================================================================================

// Types:
export interface Dart {
  points: number;
  multiplier: number;
}

// Props:
export interface Props extends NavigationScreenProps {
  gameHistory: Dart[][];
  multiplier: number;
  round: number;
  roundHistory: Dart[];
  finished: boolean;
  bust: boolean;
  score: number;
}

// ================================================================================================

const OneOOne: NavigationScreenComponent<Props> = ({ navigation }) => {
  // State:
  const [gameHistory, setGameHistory] = useState<Array<Array<Dart>>>(
    navigation.getParam("gameHistory", [])
  );
  const [multiplier, setMultiplier] = useState(
    navigation.getParam("multiplier", 1)
  );
  const [round, setRound] = useState(navigation.getParam("round", 1));
  const [roundHistory, setRoundHistory] = useState<Array<Dart>>(
    navigation.getParam("roundHistory", [])
  );
  const [finished, setFinished] = useState(
    navigation.getParam("finished", false)
  );
  const [bust, setBust] = useState(navigation.getParam("bust", false));
  const [score, setScore] = useState(navigation.getParam("score", 101));
  const [wayOut, setWayOut] = useState(calculateFinish(score));

  // Effects:
  useEffect(() => {
    setWayOut(calculateFinish(score, 3 - roundHistory.length));
  }, [score, roundHistory.length]);

  // Consts:
  const buttons = [];
  for (let i = 1; i < 21; i++) {
    buttons.push({ value: i, type: "scoreBtn" });
  }

  const initialScore = navigation.getParam("score", 101);

  const specials = [
    { label: "Bull", value: 25, type: "scoreBtn" },
    { label: "Miss", value: 0, type: "scoreBtn" },
    { label: "Double", value: "Double", type: "trigger" },
    { label: "Triple", value: "Triple", type: "trigger" }
  ];

  // ================================================================================================

  const advanceRound = () => {
    if (!bust) {
      let filledUpRoundHistory = [...roundHistory];
      const copyGameHistory = [...gameHistory];

      // Delete last element, if darts thrown this round
      if (filledUpRoundHistory.length > 0) {
        copyGameHistory.pop();
      }

      // Add Misses, if less than 3 Darts were entered
      if (filledUpRoundHistory.length < 3) {
        for (let i = filledUpRoundHistory.length; i < 3; i++) {
          filledUpRoundHistory.push({
            points: 0,
            multiplier: 0
          });
        }
      }

      // Push updated round
      copyGameHistory.push(filledUpRoundHistory);

      // Update State:
      setRound(round + 1);
      setRoundHistory([]);
      setGameHistory(copyGameHistory);
      setMultiplier(1);
    } else {
      const newGameHistory = [...gameHistory];
      const addedScore = newGameHistory[newGameHistory.length - 1]
        .map((el: Dart) => el.points * el.multiplier)
        .reduce((total: number, curr: number) => {
          return total + curr;
        });

      newGameHistory.pop();

      // Update State:
      setScore(score + addedScore);
      setRound(round + 1);
      setRoundHistory([]);
      setGameHistory(newGameHistory);
      setMultiplier(1);
      setBust(false);
    }
  };

  const countThrow = (points: number) => {
    if (roundHistory.length < 3 && !bust) {
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
          multiplier: multiplier
        }
      ];

      // Add Updated Round-History to Game-History
      copyGameHistory.push(newRoundHistory);

      // Update State
      setScore(score - points * multiplier);
      setGameHistory(copyGameHistory);
      setRoundHistory(newRoundHistory);
      setFinished(score - points * multiplier === 0 && multiplier === 2);
      setBust(
        score - points * multiplier < 0 ||
          (score - points * multiplier === 0 && multiplier !== 2) ||
          score - points * multiplier === 1
      );
      setMultiplier(1);
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
            roundHistory[roundHistory.length - 1].multiplier *
            roundHistory[roundHistory.length - 1].points;

          newRoundHistory.pop();

          if (newRoundHistory.length > 0) {
            updatedGameHistory.splice(
              updatedGameHistory.length - 1,
              1,
              newRoundHistory
            );
          } else {
            updatedGameHistory.splice(updatedGameHistory.length - 1, 1);
            newRound = newRound - 1;
          }
        }
        // ELSE: No darts thrown this round
        else {
          newRound = newRound - 1;
          addValue =
            gameHistory[
              gameHistory.length - 2 >= 0 ? gameHistory.length - 2 : 0
            ][2].multiplier *
            gameHistory[
              gameHistory.length - 2 >= 0 ? gameHistory.length - 2 : 0
            ][2].points;

          const prevRound =
            gameHistory.length < 2
              ? 0
              : gameHistory.length === 2
              ? 1
              : gameHistory.length - 2;

          newRoundHistory = [...gameHistory[prevRound]];
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
        setBust(false);
      }
    } else {
      setRound(1);
    }
  };

  // ================================================================================================

  return (
    <Container>
      <StatusBar hidden />
      <Scoreboard flexVal={0.33} bust={bust} goHome={() => goHome(navigation)}>
        {/* Headline */}
        <View style={bust ? styles.headlineBust : styles.headline}>
          <Text style={{ color: theme.neutrals.text }}>{`Round ${round}`}</Text>
        </View>
        {/* Score - Label */}
        <View style={styles.scoreWrapper}>
          <Text style={styles.scoreLabel}>{score}</Text>
        </View>

        {/* Round - History / Checkout */}
        <View style={styles.roundHistoryRow}>
          {/* First */}
          <View style={styles.roundHistoryItemWrapper}>
            {roundHistory.length > 0 ? (
              <Text style={styles.roundHistoryItemText}>
                {`${getLabel(roundHistory[0].multiplier)}${
                  roundHistory[0].points
                }`}
              </Text>
            ) : (
              <Text style={styles.wayOutItem}>
                {wayOut.length > 0 && wayOut[0]}
              </Text>
            )}
          </View>
          {/* Second */}
          <View style={styles.roundHistoryItemWrapper}>
            {/* 2 Darts geworfen */}
            {roundHistory.length > 1 ? (
              <Text style={styles.roundHistoryItemText}>
                {`${getLabel(roundHistory[1].multiplier)}${
                  roundHistory[1].points
                }`}
              </Text>
            ) : /* Einer geworfen, 2 Dart Checkout */
            roundHistory.length === 1 && wayOut.length === 2 ? (
              <Text style={styles.wayOutItem}>{wayOut[0]}</Text>
            ) : /* Einer geworfen, 1 Dart Checkout */
            roundHistory.length === 1 && wayOut.length === 1 ? (
              <Text style={styles.wayOutItem}>{wayOut[0]}</Text>
            ) : roundHistory.length === 1 &&
              wayOut.length === 3 &&
              score === 101 ? (
              <Text style={styles.wayOutItem}>T17</Text>
            ) : /* Checkout 2 oder 3 */
            roundHistory.length === 0 && wayOut.length > 1 ? (
              <Text style={styles.wayOutItem}>{wayOut[1]}</Text>
            ) : (
              <Text />
            )}
          </View>
          {/* Third */}
          <View style={styles.roundHistoryItemWrapper}>
            {/* 3 Darts geworfen */}
            {roundHistory.length > 2 ? (
              <Text style={styles.roundHistoryItemText}>
                {`${getLabel(roundHistory[2].multiplier)}${
                  roundHistory[2].points
                }`}
              </Text>
            ) : /* 2 Darts geworfen + 1 Dart Out */
            roundHistory.length === 2 && wayOut.length === 1 ? (
              <Text style={styles.wayOutItem}>{wayOut[0]}</Text>
            ) : /* 2 Darts geworfen, WayOut: 2 Darts, Score: gerade und kleiner 41 oder 50 */
            roundHistory.length === 2 &&
              wayOut.length !== 1 &&
              score % 2 === 0 &&
              (score < 41 || score === 50) ? (
              <Text style={styles.wayOutItem}>{`D${score / 2}`}</Text>
            ) : roundHistory.length === 1 && wayOut.length === 2 ? (
              <Text style={styles.wayOutItem}>{wayOut[1]}</Text>
            ) : roundHistory.length === 1 && score === 101 ? (
              <Text style={styles.wayOutItem}>D25</Text>
            ) : roundHistory.length === 0 && wayOut.length === 3 ? (
              <Text style={styles.wayOutItem}>{wayOut[2]}</Text>
            ) : (
              <Text />
            )}
          </View>
        </View>
      </Scoreboard>
      {/* Buttons */}
      <View style={styles.buttonsWrapper}>
        <View style={{ flex: 1, flexDirection: "row", height: "100%" }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              flexWrap: "wrap",
              flex: 0.75
            }}
          >
            {buttons.map(b => {
              return (
                <TouchableHighlight
                  key={`key-${b.value}`}
                  onPress={() => {
                    countThrow(b.value);
                  }}
                  style={styles.goalButton}
                  underlayColor={theme.primaries.lightBlues.tenth}
                >
                  <Text style={styles.goalButtonText}>{b.value}</Text>
                </TouchableHighlight>
              );
            })}
          </View>
          <View
            style={{
              flexDirection: "column",
              flex: 0.25
            }}
          >
            {specials.map(b => {
              return (
                <TouchableHighlight
                  key={`key-${b.value}`}
                  onPress={() => {
                    if (b.value === 25 || b.value === 0) {
                      if (b.value === 25 && multiplier === 3) {
                      } else {
                        countThrow(b.value);
                      }
                    } else {
                      if (multiplier === 1) {
                        setMultiplier(b.value === "Double" ? 2 : 3);
                      } else if (multiplier === 2) {
                        setMultiplier(b.value === "Double" ? 1 : 3);
                      } else if (multiplier === 3) {
                        setMultiplier(b.value === "Double" ? 2 : 1);
                      }
                    }
                  }}
                  style={
                    b.value === 0 || b.value === 25
                      ? styles.triggerButtonSmall
                      : bust
                      ? styles.triggerButton
                      : multiplier === 1
                      ? styles.triggerButton
                      : multiplier === 2 && b.value === "Double"
                      ? styles.triggerButtonActive
                      : multiplier === 3 && b.value == "Triple"
                      ? styles.triggerButtonActive
                      : styles.triggerButton
                  }
                >
                  <Text style={styles.goalButtonText}>{b.label}</Text>
                </TouchableHighlight>
              );
            })}
          </View>
        </View>
      </View>

      {/* Navigation */}
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
        restart={() => {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "OneOOne",
                params: {
                  doubleIn: true,
                  gameHistory: [],
                  multiplier: 1,
                  round: 1,
                  roundHistory: [],
                  finished: false,
                  bust: false,
                  score: 101
                }
              })
            ]
          });

          navigation.dispatch(resetAction);
        }}
        undo={removeScore}
        finished={finished}
      >
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>GG Bruh, nice finish!</Text>
          <Text
            style={styles.resultText}
          >{`Checked out ${initialScore} in ${round} Round${
            round > 1 ? "s" : ""
          } (${getThrownDarts(gameHistory)} Darts)`}</Text>
        </View>
      </FinishedModal>
    </Container>
  );
};

// ================================================================================================

OneOOne.navigationOptions = {
  header: null
};

// ================================================================================================

const styles = StyleSheet.create({
  headline: {
    flex: 0.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: isSmall ? 15 : 25,
    width: "100%"
  },
  headlineBust: {
    flex: 0.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: isSmall ? 15 : 25,
    width: "100%"
  },
  // Score
  scoreWrapper: {
    flex: 0.5,
    justifyContent: "center"
  },
  scoreLabel: {
    color: theme.neutrals.text,
    fontSize: 28,
    fontWeight: "bold"
  },
  // Checkout
  wayOutItem: {
    fontStyle: "italic",
    fontSize: 18,
    color: theme.primaries.lightBlues.fourth
  },
  // Thrown Darts
  roundHistoryRow: {
    flex: 0.2,
    flexDirection: "row",
    width: "100%"
  },
  roundHistoryItemWrapper: {
    alignItems: "center",
    width: "33.3%"
  },
  roundHistoryItemText: {
    color: theme.neutrals.text,
    fontSize: 18
  },
  // Buttons
  buttonsWrapper: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 0.62,
    justifyContent: "center",
    marginTop: 1,
    marginBottom: 1
  },
  goalButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "24%",
    height: "19.5%",
    margin: 1
  },
  goalButtonText: {
    fontSize: 20,
    color: theme.primaries.lightBlues.first
  },
  triggerButtonSmall: {
    alignItems: "center",
    justifyContent: "center",
    height: "19.5%",
    margin: 1
  },
  triggerButton: {
    alignItems: "center",
    justifyContent: "center",
    height: "29.5%",
    margin: 1
  },
  triggerButtonActive: {
    alignItems: "center",
    backgroundColor: theme.neutrals.eighth,
    justifyContent: "center",
    height: "29.5%",
    margin: 1
  },
  // Finished Content
  resultContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  resultText: { fontSize: 20 }
});

export default OneOOne;

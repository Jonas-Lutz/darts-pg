import React, { Component } from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import { StackActions, NavigationActions } from "react-navigation";

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

const isSmall = smallScreen();

// ================================================================================================

// Props:
export interface Props {
  navigation: any;
}

// State:
type State = {
  doubleIn?: boolean;
  gameHistory: any[];
  input?: string;
  multiplier: number;
  round: number;
  roundHistory: any[];
  finished: boolean;
  bust: boolean;
  score: number;
  initialScore: number;
};

// ================================================================================================

class OneOOne extends Component<Props, State> {
  static navigationOptions = {
    header: null
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      doubleIn: this.props.navigation.getParam("doubleIn", true),
      gameHistory: this.props.navigation.getParam("gameHistory", []),
      multiplier: this.props.navigation.getParam("multiplier", 1),
      round: this.props.navigation.getParam("round", 1),
      roundHistory: this.props.navigation.getParam("roundHistory", []),
      finished: this.props.navigation.getParam("finished", false),
      bust: this.props.navigation.getParam("bust", false),
      score: this.props.navigation.getParam("score", 101),
      initialScore: this.props.navigation.getParam("score", 101)
    };
  }

  advanceRound = () => {
    if (!this.state.bust) {
      let filledUpRoundHistory = [...this.state.roundHistory];
      const copyGameHistory = [...this.state.gameHistory];

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

      this.setState({
        ...this.state,
        round: this.state.round + 1,
        roundHistory: [],
        gameHistory: copyGameHistory,
        multiplier: 1
      });
    } else {
      const newGameHistory = [...this.state.gameHistory];
      const addedScore = newGameHistory[newGameHistory.length - 1]
        .map((el: any) => el.points * el.multiplier)
        .reduce((total: number, curr: number) => {
          return total + curr;
        });

      newGameHistory.pop();

      this.setState({
        score: this.state.score + addedScore,
        round: this.state.round + 1,
        roundHistory: [],
        gameHistory: newGameHistory,
        multiplier: 1,
        bust: false
      });
    }
  };

  countThrow = (points: number) => {
    if (this.state.roundHistory.length < 3 && !this.state.bust) {
      // Removes the current Round from Game-History
      const copyGameHistory = [...this.state.gameHistory];
      if (this.state.roundHistory.length > 0) {
        copyGameHistory.pop();
      }

      // Update new Round-History with current throw
      const newRoundHistory = [
        ...this.state.roundHistory,
        {
          points: points,
          multiplier: this.state.multiplier
        }
      ];

      // Add Updated Round-History to Game-History
      copyGameHistory.push(newRoundHistory);

      // Update State
      this.setState({
        ...this.state,
        score: this.state.score - points * this.state.multiplier,
        gameHistory: copyGameHistory,
        roundHistory: newRoundHistory,
        multiplier: 1,
        finished:
          this.state.score - points * this.state.multiplier === 0 &&
          this.state.multiplier === 2,
        bust:
          this.state.score - points * this.state.multiplier < 0 ||
          (this.state.score - points * this.state.multiplier === 0 &&
            this.state.multiplier !== 2) ||
          this.state.score - points * this.state.multiplier === 1
      });
    }
  };

  removeScore = () => {
    // At least 1 dart thrown
    if (this.state.gameHistory.length > 0) {
      if (
        // Dart thrown previous round
        this.state.gameHistory[this.state.gameHistory.length - 1].length > 0 ||
        // or this round
        this.state.gameHistory.length > 1
      ) {
        let newRound = this.state.round;
        let newRoundHistory = [...this.state.roundHistory];
        let updatedGameHistory = [...this.state.gameHistory];
        let addValue = 0;

        // IF: darts thrown this round
        if (this.state.roundHistory.length > 0) {
          // Value to add to game score
          addValue =
            this.state.roundHistory[this.state.roundHistory.length - 1]
              .multiplier *
            this.state.roundHistory[this.state.roundHistory.length - 1].points;

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
            this.state.gameHistory[
              this.state.gameHistory.length - 2 >= 0
                ? this.state.gameHistory.length - 2
                : 0
            ][2].multiplier *
            this.state.gameHistory[
              this.state.gameHistory.length - 2 >= 0
                ? this.state.gameHistory.length - 2
                : 0
            ][2].points;

          const prevRound =
            this.state.gameHistory.length < 2
              ? 0
              : this.state.gameHistory.length === 2
              ? 1
              : this.state.gameHistory.length - 2;

          newRoundHistory = [...this.state.gameHistory[prevRound]];
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
        this.setState({
          ...this.state,
          round: newRound <= 1 ? 1 : newRound,
          score: this.state.score + addValue,
          roundHistory: newRoundHistory,
          gameHistory: updatedGameHistory,
          multiplier: 1,
          finished: false,
          bust: false
        });
      }
    } else {
      this.setState({
        ...this.state,
        round: 1
      });
    }
  };

  render() {
    const { navigation } = this.props;
    const wayOut = calculateFinish(this.state.score);

    const buttons = [];
    for (let i = 1; i < 21; i++) {
      buttons.push({ value: i, type: "scoreBtn" });
    }

    const specials = [
      { label: "Bull", value: 25, type: "scoreBtn" },
      { label: "Miss", value: 0, type: "scoreBtn" },
      { label: "Double", value: "Double", type: "trigger" },
      { label: "Triple", value: "Triple", type: "trigger" }
    ];
    /*     specials.map(s => buttons.push(s));
     */
    return (
      <Container>
        <StatusBar hidden />
        <Scoreboard
          flexVal={0.33}
          bust={this.state.bust}
          goHome={() => {
            navigation.navigate("Home");
          }}
        >
          {/* Headline */}
          <View style={this.state.bust ? styles.headlineBust : styles.headline}>
            <Text style={{ color: theme.neutrals.text }}>{`Round ${
              this.state.round
            }`}</Text>
          </View>
          {/* Score - Label */}
          <View style={styles.scoreWrapper}>
            <Text style={styles.scoreLabel}>{this.state.score}</Text>
          </View>

          {/* Round - History / Checkout */}
          <View style={styles.roundHistoryRow}>
            {/* First */}
            <View style={styles.roundHistoryItemWrapper}>
              {this.state.roundHistory.length > 0 ? (
                <Text style={styles.roundHistoryItemText}>
                  {`${getLabel(this.state.roundHistory[0].multiplier)}${
                    this.state.roundHistory[0].points
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
              {this.state.roundHistory.length > 1 ? (
                <Text style={styles.roundHistoryItemText}>
                  {`${getLabel(this.state.roundHistory[1].multiplier)}${
                    this.state.roundHistory[1].points
                  }`}
                </Text>
              ) : /* Einer geworfen, 2 Dart Checkout */
              this.state.roundHistory.length === 1 && wayOut.length === 2 ? (
                <Text style={styles.wayOutItem}>{wayOut[0]}</Text>
              ) : /* Einer geworfen, 1 Dart Checkout */
              this.state.roundHistory.length === 1 && wayOut.length === 1 ? (
                <Text style={styles.wayOutItem}>{wayOut[0]}</Text>
              ) : this.state.roundHistory.length === 1 &&
                wayOut.length === 3 &&
                this.state.score === 101 ? (
                <Text style={styles.wayOutItem}>T17</Text>
              ) : /* Checkout 2 oder 3 */
              this.state.roundHistory.length === 0 && wayOut.length > 1 ? (
                <Text style={styles.wayOutItem}>{wayOut[1]}</Text>
              ) : (
                <Text />
              )}
            </View>
            {/* Third */}
            <View style={styles.roundHistoryItemWrapper}>
              {/* 3 Darts geworfen */}
              {this.state.roundHistory.length > 2 ? (
                <Text style={styles.roundHistoryItemText}>
                  {`${getLabel(this.state.roundHistory[2].multiplier)}${
                    this.state.roundHistory[2].points
                  }`}
                </Text>
              ) : /* 2 Darts geworfen + 1 Dart Out */
              this.state.roundHistory.length === 2 && wayOut.length === 1 ? (
                <Text style={styles.wayOutItem}>{wayOut[0]}</Text>
              ) : /* 2 Darts geworfen, WayOut: 2 Darts, Score: gerade und kleiner 41 oder 50 */
              this.state.roundHistory.length === 2 &&
                wayOut.length !== 1 &&
                this.state.score % 2 === 0 &&
                (this.state.score < 41 || this.state.score === 50) ? (
                <Text style={styles.wayOutItem}>{`D${this.state.score /
                  2}`}</Text>
              ) : this.state.roundHistory.length === 1 &&
                wayOut.length === 2 ? (
                <Text style={styles.wayOutItem}>{wayOut[1]}</Text>
              ) : this.state.roundHistory.length === 1 &&
                this.state.score === 101 ? (
                <Text style={styles.wayOutItem}>D25</Text>
              ) : this.state.roundHistory.length === 0 &&
                wayOut.length === 3 ? (
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
                      this.countThrow(b.value);
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
                        if (b.value === 25 && this.state.multiplier === 3) {
                        } else {
                          this.countThrow(b.value);
                        }
                      } else {
                        if (this.state.multiplier === 1) {
                          this.setState({
                            ...this.state,
                            multiplier: b.value === "Double" ? 2 : 3
                          });
                        } else if (this.state.multiplier === 2) {
                          this.setState({
                            ...this.state,
                            multiplier: b.value === "Double" ? 1 : 3
                          });
                        } else if (this.state.multiplier === 3) {
                          this.setState({
                            ...this.state,
                            multiplier: b.value === "Double" ? 2 : 1
                          });
                        }
                      }
                    }}
                    style={
                      b.value === 0 || b.value === 25
                        ? styles.triggerButtonSmall
                        : this.state.bust
                        ? styles.triggerButton
                        : this.state.multiplier === 1
                        ? styles.triggerButton
                        : this.state.multiplier === 2 && b.value === "Double"
                        ? styles.triggerButtonActive
                        : this.state.multiplier === 3 && b.value == "Triple"
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
          backDisabled={this.state.gameHistory.length < 1}
          moveOn={this.advanceRound}
          moveOnText="Next"
          removeScore={this.removeScore}
          underlayBack={
            this.state.gameHistory.length < 1
              ? theme.neutrals.seventh
              : theme.neutrals.eighth
          }
          underlayMove={theme.primaries.lightBlues.eighth}
        />
        <FinishedModal
          goHome={() => {
            navigation.navigate("Home");
          }}
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

            this.props.navigation.dispatch(resetAction);
          }}
          undo={this.removeScore}
          finished={this.state.finished}
        >
          <View>
            <Text>GG Bruh, nice finish!</Text>
            <Text>{`Checked out ${this.state.initialScore} in ${
              this.state.round
            } Round${this.state.round > 1 ? "s" : ""} (${getThrownDarts(
              this.state.gameHistory
            )} Darts)`}</Text>
          </View>
        </FinishedModal>
      </Container>
    );
  }
}

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
  }
});

export default OneOOne;

import React, { Component } from "react";
import {
  AsyncStorage,
  StyleSheet,
  StatusBar,
  Text,
  TouchableHighlight,
  Image,
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
import { getLabel } from "utils/getLabel";
import calcMPR from "utils/calcMPR";
import { throwStatement } from "@babel/types";

// ================================================================================================

// Props:
export interface Props {
  navigation: any;
}

// State:
type State = {
  round: number;
  score: number;
  gameHistory: any[];
  goals: number[];
  roundHistory: any[];
  finished: boolean;
  highscore: number;
  shanghai: boolean;
  multiplier: number;
};

// ================================================================================================

const isSmall = smallScreen();

class Shanghai extends Component<Props, State> {
  static navigationOptions = {
    header: null
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      score: 0,
      gameHistory: [],
      roundHistory: [],
      round: 1,
      goals: [
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
      ],
      finished: false,
      highscore: 0,
      shanghai: false,
      multiplier: 1
    };
  }

  advanceRound = () => {
    if (this.state.round === 20) {
      this.setState({
        ...this.state,
        finished: true
      });
      this.updateStats();
    } else {
      let filledUpRoundHistory = [...this.state.roundHistory];
      const copyGameHistory = [...this.state.gameHistory];

      // Add Misses, if less than 3 Darts were entered
      if (filledUpRoundHistory.length < 3) {
        for (let i = filledUpRoundHistory.length; i < 3; i++) {
          filledUpRoundHistory.push({
            points: 0,
            multiplier: 0
          });
        }
      }

      copyGameHistory.splice(this.state.round - 1, 1, filledUpRoundHistory);

      this.setState({
        ...this.state,
        round: this.state.round + 1,
        roundHistory: [],
        gameHistory: copyGameHistory,
        multiplier: 1,
        shanghai: false
      });
    }
  };

  countThrow = (points: number) => {
    if (this.state.roundHistory.length < 3) {
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
          multiplier: points === 0 ? 0 : 1
        }
      ];

      // Add Updated Round-History to Game-History
      copyGameHistory.push(newRoundHistory);

      // Shanghai ?
      const isShanghai = newRoundHistory.map(dart => dart.points);
      if (
        isShanghai.includes(-1) &&
        isShanghai.includes(-2) &&
        isShanghai.includes(-3)
      ) {
        // Update State
        this.setState({
          ...this.state,
          score: this.state.score - points,
          gameHistory: copyGameHistory,
          roundHistory: newRoundHistory,
          multiplier: 1,
          finished: true,
          shanghai: true
        });
      } else {
        // Update State
        this.setState({
          ...this.state,
          score: this.state.score - points,
          gameHistory: copyGameHistory,
          roundHistory: newRoundHistory,
          multiplier: 1,
          finished: false
        });
      }
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
          addValue = this.state.roundHistory[this.state.roundHistory.length - 1]
            .points;

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
          addValue = this.state.gameHistory[newRound - 1][2].points;
          newRoundHistory = [...this.state.gameHistory[newRound - 1]];

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
          shanghai: false
        });
      }
    } else {
      this.setState({
        ...this.state,
        round: 1
      });
    }
  };

  // Fetch existing stats from storage
  fetchStats = async () => {
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
  mergeStats = (oldStats: any) => {
    const highscore = Math.max(oldStats.highscore, this.state.score);
    return {
      highscore: highscore
    };
  };

  // Update stats in storage
  saveStats = async (highscore: any) => {
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
  updateStats = async () => {
    try {
      let currHigh = await this.fetchStats();
      this.setState({
        ...this.state,
        highscore: currHigh.highscore
      });
      const mergedStats = this.mergeStats(currHigh);
      this.saveStats(mergedStats);
    } catch {
      console.log("error updating stats");
    }
  };

  render() {
    const { navigation } = this.props;

    return (
      <Container>
        <StatusBar hidden />
        <Scoreboard
          flexVal={0.3}
          goHome={() => {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: "Home"
                })
              ]
            });

            navigation.dispatch(resetAction);
          }}
        >
          <View style={styles.mprWrapper}>
            <Text style={styles.mprText}>{`MPR: ${calcMPR(
              this.state.score,
              Math.max(
                1,
                this.state.round - 1 + this.state.roundHistory.length / 3
              )
            )}`}</Text>
          </View>
          <View style={styles.scoreWrapper}>
            <Text style={styles.scoreText}>{`${this.state.score}`}</Text>
          </View>
          <View style={styles.dartsDisplay}>
            <View style={styles.dartsDisplayDart}>
              <Text style={styles.dartText}>
                {this.state.roundHistory.length > 0 ? (
                  this.state.roundHistory[0].points === 0 ? (
                    "Miss"
                  ) : (
                    `${getLabel(this.state.roundHistory[0].points * -1)}${
                      this.state.goals[this.state.round - 1]
                    }`
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
                {this.state.roundHistory.length > 1 ? (
                  this.state.roundHistory[1].points === 0 ? (
                    "Miss"
                  ) : (
                    `${getLabel(this.state.roundHistory[1].points * -1)}${
                      this.state.goals[this.state.round - 1]
                    }`
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
                {this.state.roundHistory.length > 2 ? (
                  this.state.roundHistory[2].points === 0 ? (
                    "Miss"
                  ) : (
                    `${getLabel(this.state.roundHistory[2].points * -1)}${
                      this.state.goals[this.state.round - 1]
                    }`
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
          {this.state.goals[this.state.round - 1] !== 25 && (
            <View style={{ flex: 0.25 }}>
              <TouchableHighlight
                onPress={() => this.countThrow(-3)}
                style={styles.scoreButton}
                underlayColor={theme.primaries.lightBlues.tenth}
              >
                <Text style={styles.buttonText}>{`T ${
                  this.state.goals[this.state.round - 1]
                }`}</Text>
              </TouchableHighlight>
            </View>
          )}

          <View
            style={{
              flex: this.state.goals[this.state.round - 1] === 25 ? 1 / 3 : 0.25
            }}
          >
            <TouchableHighlight
              onPress={() => this.countThrow(-2)}
              style={styles.scoreButton}
              underlayColor={theme.primaries.lightBlues.tenth}
            >
              <Text style={styles.buttonText}>{`D ${
                this.state.goals[this.state.round - 1]
              }`}</Text>
            </TouchableHighlight>
          </View>
          <View
            style={{
              flex: this.state.goals[this.state.round - 1] === 25 ? 1 / 3 : 0.25
            }}
          >
            <TouchableHighlight
              onPress={() => this.countThrow(-1)}
              style={styles.scoreButton}
              underlayColor={theme.primaries.lightBlues.tenth}
            >
              <Text style={styles.buttonText}>{`S ${
                this.state.goals[this.state.round - 1]
              }`}</Text>
            </TouchableHighlight>
          </View>
          <View
            style={{
              flex: this.state.goals[this.state.round - 1] === 25 ? 1 / 3 : 0.25
            }}
          >
            <TouchableHighlight
              onPress={() => this.countThrow(0)}
              style={styles.scoreButton}
              underlayColor={theme.primaries.lightBlues.tenth}
            >
              <Text style={styles.buttonText}>{`Miss`}</Text>
            </TouchableHighlight>
          </View>
        </View>
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
            const resetAction = StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: "Home"
                })
              ]
            });

            navigation.dispatch(resetAction);
          }}
          headline={this.state.shanghai ? "Shanghai!" : "Stats"}
          restart={() => {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: "Shanghai"
                })
              ]
            });

            this.props.navigation.dispatch(resetAction);
          }}
          undo={this.removeScore}
          finished={this.state.finished}
        >
          <View style={{ flexDirection: "column" }}>
            {this.state.shanghai && <Text>Finished by Shanghai</Text>}
            <Text>{`You reached a total score of ${this.state.score} (MPR: ${(
              this.state.score / this.state.gameHistory.length
            ).toFixed(1)}).`}</Text>

            {this.state.finished && this.state.highscore < this.state.score ? (
              <Text>{`That's a new Carreer High - Gratz!`}</Text>
            ) : (
              <Text>{`Carreer High: ${this.state.highscore}`}</Text>
            )}
          </View>
        </FinishedModal>
      </Container>
    );
  }
}

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

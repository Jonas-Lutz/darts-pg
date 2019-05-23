import React, { Component } from "react";
import {
  AsyncStorage,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import { StackActions, NavigationActions } from "react-navigation";

// Colors:
import theme from "mydarts/theme";

// Components:
import Container from "mydarts/components/Container";
import GameNav from "mydarts/components/GameNav";
import FinishedModal from "mydarts/components/FinishedModal";
import Scoreboard from "mydarts/components/Scoreboard";

// Utils:
import { smallScreen } from "mydarts/utils/deviceRatio";
import { getLabel } from "mydarts/utils/getLabel";
import calcMPR from "mydarts/utils/calcMPR";

const isSmall = smallScreen();

class CricketCountUp extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      gameHistory: [],
      roundHistory: [],
      round: 1,
      goals: [20, 19, 18, 17, 16, 15, 25],
      finished: false,
      highscore: 0
    };
  }

  advanceRound = () => {
    if (this.state.round === 7) {
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
        multiplier: 1
      });
    }
  };

  countThrow = points => {
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
          multiplier: points === 0 ? 0 : 1
        }
      ];

      // Add Updated Round-History to Game-History
      copyGameHistory.push(newRoundHistory);

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

  // Fetch existing stats from storage
  fetchStats = async () => {
    try {
      const value = await AsyncStorage.getItem("cricketCountUp");
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
  mergeStats = oldStats => {
    const highscore = Math.max(oldStats.highscore, this.state.score);
    return {
      highscore: highscore
    };
  };

  // Update stats in storage
  saveStats = async highscore => {
    try {
      const res = await AsyncStorage.setItem(
        "cricketCountUp",
        JSON.stringify(highscore)
      );
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

    console.log(
      "____________________________LEG_____________________________________"
    );
    console.log(this.state.gameHistory);
    console.log(
      "____________________________FIN_____________________________________"
    );

    return (
      <Container>
        <Scoreboard flexVal={0.3}>
          <View style={styles.mprWrapper}>
            <Text style={styles.mprText}>{`MPR: ${calcMPR(
              this.state.score,
              this.state.roundHistory.length > 0
                ? this.state.round
                : this.state.round - 1
            )}`}</Text>
          </View>
          <View style={styles.scoreWrapper}>
            <Text style={styles.scoreText}>{`${this.state.score}`}</Text>
          </View>
          <View style={styles.dartsDisplay}>
            <View style={styles.dartsDisplayDart}>
              <Text style={styles.dartText}>
                {this.state.roundHistory.length > 0
                  ? this.state.roundHistory[0].points === 0
                    ? "Miss"
                    : `${getLabel(this.state.roundHistory[0].points * -1)}${
                        this.state.goals[this.state.round - 1]
                      }`
                  : "I"}
              </Text>
            </View>
            <View style={styles.dartsDisplayDart}>
              <Text style={styles.dartText}>
                {this.state.roundHistory.length > 1
                  ? this.state.roundHistory[1].points === 0
                    ? "Miss"
                    : `${getLabel(this.state.roundHistory[1].points * -1)}${
                        this.state.goals[this.state.round - 1]
                      }`
                  : "II"}
              </Text>
            </View>
            <View style={styles.dartsDisplayDart}>
              <Text style={styles.dartText}>
                {this.state.roundHistory.length > 2
                  ? this.state.roundHistory[2].points === 0
                    ? "Miss"
                    : `${getLabel(this.state.roundHistory[2].points * -1)}${
                        this.state.goals[this.state.round - 1]
                      }`
                  : "III"}
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
                underlayColor={theme.neutrals.eighth}
              >
                <Text style={{ fontSize: 24 }}>{`T ${
                  this.state.goals[this.state.round - 1]
                }`}</Text>
              </TouchableHighlight>
            </View>
          )}

          <View
            style={{
              flex: this.state.goals[this.state.round - 1] === 25 ? 0.33 : 0.25
            }}
          >
            <TouchableHighlight
              onPress={() => this.countThrow(-2)}
              style={styles.scoreButton}
              underlayColor={theme.neutrals.eighth}
            >
              <Text style={{ fontSize: 24 }}>{`D ${
                this.state.goals[this.state.round - 1]
              }`}</Text>
            </TouchableHighlight>
          </View>
          <View
            style={{
              flex: this.state.goals[this.state.round - 1] === 25 ? 0.33 : 0.25
            }}
          >
            <TouchableHighlight
              onPress={() => this.countThrow(-1)}
              style={styles.scoreButton}
              underlayColor={theme.neutrals.eighth}
            >
              <Text style={{ fontSize: 24 }}>{`S ${
                this.state.goals[this.state.round - 1]
              }`}</Text>
            </TouchableHighlight>
          </View>
          <View
            style={{
              flex: this.state.goals[this.state.round - 1] === 25 ? 0.33 : 0.25
            }}
          >
            <TouchableHighlight
              onPress={() => this.countThrow(0)}
              style={styles.scoreButton}
              underlayColor={theme.neutrals.eighth}
            >
              <Text style={{ fontSize: 24 }}>{`Miss`}</Text>
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
          goHome={() => navigation.navigate("Home")}
          restart={() => {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: "CricketCountUp"
                })
              ]
            });

            this.props.navigation.dispatch(resetAction);
          }}
          undo={this.removeScore}
          finished={this.state.finished}
        >
          <View style={{ flexDirection: "column" }}>
            <Text>{`You reached a total score of ${this.state.score} (MPR: ${(
              this.state.score / 7
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
    flex: 0.33
  },
  dartText: {
    fontSize: 16
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
    fontSize: 24,
    fontWeight: "bold"
  }
});

export default CricketCountUp;

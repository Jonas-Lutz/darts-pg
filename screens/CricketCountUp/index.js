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
import theme from "../../theme";

// Components:
import Container from "../../components/Container";
import GameNav from "../../components/GameNav";
import FinishedModal from "../../components/FinishedModal";
import Scoreboard from "../../components/Scoreboard";

// Utils:
import { smallScreen } from "../../utils/deviceRatio";
import { getLabel } from "../../utils/getLabel";
import calcMPR from "../../utils/calcMPR";

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
          multiplier: 1
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
            newRound = newRound - 1;
          }
        }
        // ELSE: No darts thrown this round
        else {
          newRound = newRound - 1;
          addValue = this.state.gameHistory[
            this.state.gameHistory.length - 2 >= 0
              ? this.state.gameHistory.length - 2
              : 0
          ][2].points;

          const prevRound =
            this.state.gameHistory.length < 2
              ? 0
              : this.state.gameHistory === 2
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
    return (
      <Container>
        <Scoreboard flexVal={0.3}>
          <Text>{`MPR: ${calcMPR(
            this.state.score,
            this.state.roundHistory.length > 0
              ? this.state.round
              : this.state.round - 1
          )}`}</Text>
          <Text>{this.state.score}</Text>
          <Text>
            {this.state.roundHistory.length > 0
              ? `${getLabel(this.state.roundHistory[0].points * -1)}${
                  this.state.goals[this.state.round - 1]
                }`
              : ""}
          </Text>
          <Text>
            {this.state.roundHistory.length > 1
              ? `${getLabel(this.state.roundHistory[1].points * -1)}${
                  this.state.goals[this.state.round - 1]
                }`
              : ""}
          </Text>
          <Text>
            {this.state.roundHistory.length > 2
              ? `${getLabel(this.state.roundHistory[2].points * -1)}${
                  this.state.goals[this.state.round - 1]
                }`
              : ""}
          </Text>
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
          underlayMove={theme.primaries.eighth}
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
            <Text>{`You reached a total score of ${
              this.state.score
            } (MPR: ${this.state.score / 7}).`}</Text>

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
  }
});

export default CricketCountUp;

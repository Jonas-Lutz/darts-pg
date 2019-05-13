import React from "react";
import { StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";

// Components:
import StatModal from "../../components/StatModal";

// Colors:
import theme from "../../theme";

export default class NineNineX extends React.Component {
  state = {
    score: 0,
    round: 1,
    goal: 20,
    gameHistory: [],
    roundHistory: [],
    showStats: false
  };

  addScore = multiplier => {
    if (this.state.roundHistory.length < 3) {
      // Removes the current Round from Game-History
      const copyGameHistory = [...this.state.gameHistory];
      copyGameHistory.pop();

      // Update new Round-History with current throw
      const newRoundHistory = [
        ...this.state.roundHistory,
        {
          goal: this.state.goal,
          multiplier: multiplier,
          score: this.state.goal * multiplier
        }
      ];

      // Add Updated Round-History to Game-History
      copyGameHistory.push(newRoundHistory);

      // Update State
      this.setState({
        ...this.state,
        score: this.state.score + this.state.goal * multiplier,
        gameHistory: copyGameHistory,
        roundHistory: newRoundHistory
      });
    }
  };

  advanceRound = () => {
    if (this.state.round <= 20) {
      let filledUpRoundHistory = [...this.state.roundHistory];

      // Add Misses, if less than 3 Darts were entered
      if (filledUpRoundHistory.length < 3) {
        for (let i = filledUpRoundHistory.length; i < 3; i++) {
          filledUpRoundHistory.push({
            goal: this.state.goal,
            multiplier: 0,
            score: 0
          });
        }
      }

      this.setState({
        ...this.state,
        round: this.state.round + 1,
        roundHistory: [],
        gameHistory: [...this.state.gameHistory, filledUpRoundHistory]
      });
    }
  };

  removeScore = () => {
    if (this.state.gameHistory.length > 0) {
      if (
        this.state.gameHistory[this.state.gameHistory.length - 1].length > 0 ||
        this.state.gameHistory.length > 1
      ) {
        let newRoundHistory = [...this.state.roundHistory];
        let updatedGameHistory = [...this.state.gameHistory];
        let subtractValue = 0;

        if (this.state.roundHistory.length > 0) {
          subtractValue = this.state.roundHistory[
            this.state.roundHistory.length - 1
          ].score;
          // Darts thrown this round:
          newRoundHistory.pop();
          updatedGameHistory.splice(
            updatedGameHistory.length - 1,
            1,
            newRoundHistory
          );
        } else {
          subtractValue = this.state.gameHistory[
            this.state.gameHistory.length - 2
          ][2].score;

          // No Darts thrown this round:
          const prevRound =
            this.state.gameHistory.length < 2
              ? 0
              : this.state.gameHistory.length - 2;
          newRoundHistory = [...this.state.gameHistory[prevRound]];
          newRoundHistory.pop();
          if (newRoundHistory.length > 0) {
            updatedGameHistory.splice(
              updatedGameHistory.length - 2,
              2,
              newRoundHistory
            );
          } else {
            updatedGameHistory.splice(updatedGameHistory.length - 2, 2);
          }
        }

        // Update State
        this.setState({
          ...this.state,
          round: updatedGameHistory.length,
          score: this.state.score - subtractValue,
          roundHistory: newRoundHistory,
          gameHistory: updatedGameHistory
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
    return (
      <View style={styles.container}>
        <View style={styles.scoreBoard}>
          <Text>{`${this.state.round} round`}</Text>
          <Text>{`${this.state.score} points`}</Text>
          <View style={styles.thrownDarts}>
            <Text style={styles.dartScore}>{`I: ${
              this.state.roundHistory.length > 0
                ? this.state.roundHistory[0].score
                : ""
            }`}</Text>
            <Text style={styles.dartScore}>{`II: ${
              this.state.roundHistory.length > 1
                ? this.state.roundHistory[1].score
                : ""
            }`}</Text>
            <Text style={styles.dartScore}>{`III: ${
              this.state.roundHistory.length > 2
                ? this.state.roundHistory[2].score
                : ""
            }`}</Text>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <TouchableNativeFeedback onPress={() => this.addScore(3)}>
            <View style={styles.scoreButtonTriple}>
              <Text>{`T ${this.state.goal}`}</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={() => this.addScore(2)}>
            <View style={styles.scoreButtonDouble}>
              <Text>{`D ${this.state.goal}`}</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={() => this.addScore(1)}>
            <View style={styles.scoreButtonSingle}>
              <Text>{`S ${this.state.goal}`}</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={() => this.addScore(0)}>
            <View style={styles.scoreButtonMiss}>
              <Text>{`Miss`}</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={styles.navContainer}>
          <TouchableNativeFeedback onPress={() => this.removeScore()}>
            <View style={styles.backButton}>
              <Text>Back</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress={() => {
              if (this.state.round < 20) {
                this.advanceRound();
              } else {
                this.setState({
                  ...this.state,
                  showStats: true
                });
              }
            }}
          >
            <View style={styles.forwardButton}>
              <Text>{this.state.round < 20 ? "Next" : "Finish"}</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <StatModal
          visible={this.state.showStats}
          gameHistory={this.state.gameHistory}
          score={this.state.score}
          onClose={() => {
            this.setState({
              ...this.state,
              score: 0,
              round: 1,
              goal: 20,
              gameHistory: [],
              roundHistory: [],
              showStats: false
            });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  thrownDarts: {
    flexDirection: "row",
    width: "100%"
  },
  dartScore: {
    flex: 0.33,
    paddingLeft: 10
  },
  inputContainer: {
    flex: 0.6,
    width: "100%"
  },
  scoreButtonTriple: {
    backgroundColor: theme.neutrals.tenth,
    flex: 0.25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
    marginTop: 1,
    width: "100%"
  },
  scoreButtonDouble: {
    backgroundColor: theme.neutrals.tenth,
    flex: 0.25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
    width: "100%"
  },
  scoreButtonSingle: {
    backgroundColor: theme.neutrals.tenth,
    flex: 0.25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
    width: "100%"
  },
  scoreButtonMiss: {
    backgroundColor: theme.neutrals.tenth,
    flex: 0.25,
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  scoreBoard: {
    backgroundColor: theme.primaries.tenth,
    flex: 0.25,
    alignItems: "center",
    paddingTop: 20
  },
  navContainer: {
    backgroundColor: theme.neutrals.tenth,
    justifyContent: "space-evenly",
    flexDirection: "row",
    flex: 0.1,
    margin: 1,
    width: "100%"
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.neutrals.ninth,
    flex: 0.5
  },
  forwardButton: {
    backgroundColor: theme.primaries.sixth,
    alignItems: "center",
    justifyContent: "center",
    flex: 0.5
  }
});

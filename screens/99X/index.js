import React from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";

// Colors:
import theme from "mydarts/theme";

// Components:
import Container from "mydarts/components/Container";
import GameNav from "mydarts/components/GameNav";
import Scoreboard from "mydarts/components/Scoreboard";

export default class NineNineX extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      goal: this.props.navigation.getParam("goal", 20),
      round: this.props.navigation.getParam("round", 1),
      score: this.props.navigation.getParam("score", 0),
      gameHistory: this.props.navigation.getParam("gameHistory", []),
      roundHistory: this.props.navigation.getParam("roundHistory", []),
      fetchedStats: this.props.navigation.getParam("fetchedStats", [])
    };
  }

  addScore = multiplier => {
    if (this.state.roundHistory.length < 3) {
      const copyGameHistory = [...this.state.gameHistory];

      // Update new Round-History with current throw
      const newRoundHistory = [
        ...this.state.roundHistory,
        {
          goal: this.state.goal,
          multiplier: multiplier
        }
      ];

      copyGameHistory.splice(this.state.round - 1, 1, newRoundHistory);

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
      let copyGameHistory = [...this.state.gameHistory];
      let filledUpRoundHistory = [...this.state.roundHistory];

      // Add Misses, if less than 3 Darts were entered
      if (filledUpRoundHistory.length < 3) {
        for (let i = filledUpRoundHistory.length; i < 3; i++) {
          filledUpRoundHistory.push({
            goal: this.state.goal,
            multiplier: 0
          });
        }
      }

      copyGameHistory.splice(this.state.round - 1, 1, filledUpRoundHistory);

      console.log("===============================================");
      console.log("cGH ", copyGameHistory);
      console.log("===============================================");

      this.setState({
        ...this.state,
        round: this.state.round + 1,
        roundHistory: [],
        gameHistory: copyGameHistory
      });
    }
  };

  removeScore = () => {
    // At least 1 dart thrown
    if (this.state.gameHistory.length > 0) {
      if (
        // Dart thrown previous or this round
        this.state.gameHistory[this.state.gameHistory.length - 1].length > 0 ||
        this.state.gameHistory.length > 1
      ) {
        let newRoundHistory = [...this.state.roundHistory];
        let updatedGameHistory = [...this.state.gameHistory];
        let subtractValue = 0;

        // IF: darts thrown this round
        if (this.state.roundHistory.length > 0) {
          subtractValue =
            this.state.roundHistory[this.state.roundHistory.length - 1]
              .multiplier * this.state.goal;
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
          subtractValue =
            this.state.gameHistory[
              this.state.gameHistory.length - 2 >= 0
                ? this.state.gameHistory.length - 2
                : 0
            ][2].multiplier * this.state.goal;

          const prevRound =
            this.state.gameHistory.length < 2
              ? 0
              : this.state.gameHistory.length - 2;
          newRoundHistory = [...this.state.gameHistory[prevRound]];
          newRoundHistory.pop();

          console.log("===============================================");
          console.log(newRoundHistory);
          console.log("===============================================");

          if (newRoundHistory.length > 0) {
            console.log("Schplize mit");
            updatedGameHistory.splice(
              updatedGameHistory.length - 1,
              1,
              newRoundHistory
            );
          } else {
            console.log("Schplize ohne ersatz");
            updatedGameHistory.splice(updatedGameHistory.length - 2, 2);
          }
        }

        console.log(
          "UPDATEUPDATEUPDATEUPDATEUPDATEUPDATEUPDATEUPDATEUPDATEUPDATEUPDATEUPDATEUPDATE"
        );
        console.log(updatedGameHistory);
        console.log(
          "UPDATEUPDATEUPDATEUPDATEUPDATEUPDATEUPDATEUPDATEUPDATEUPDATEUPDATEUPDATEUPDATE"
        );
        // Update State
        this.setState({
          ...this.state,
          round: updatedGameHistory.length > 0 ? updatedGameHistory.length : 1,
          score: this.state.score - subtractValue,
          roundHistory: newRoundHistory,
          gameHistory: updatedGameHistory
        });
      } else {
        this.setState({
          ...this.state,
          round: 1,
          gameHistory: [],
          roundHistory: []
        });
      }
    } else {
      this.setState({
        ...this.state,
        round: 1,
        gameHistory: [],
        roundHistory: []
      });
    }
  };

  render() {
    const { navigation } = this.props;

    return (
      <Container>
        <Scoreboard flexVal={0.25}>
          <View style={styles.gamestats}>
            <Text>{`${this.state.round} round`}</Text>
            <Text>{`${this.state.score} points`}</Text>
          </View>
          <View style={styles.thrownDarts}>
            <View style={styles.dartScore}>
              <Text style={{ fontSize: 24 }}>{`${
                this.state.roundHistory.length > 0
                  ? this.state.roundHistory[0].multiplier * this.state.goal
                  : "I"
              }`}</Text>
            </View>
            <View style={styles.dartScore}>
              <Text style={{ fontSize: 24 }}>{`${
                this.state.roundHistory.length > 1
                  ? this.state.roundHistory[1].multiplier * this.state.goal
                  : "II"
              }`}</Text>
            </View>
            <View style={styles.dartScore}>
              <Text style={{ fontSize: 24 }}>{`${
                this.state.roundHistory.length > 2
                  ? this.state.roundHistory[2].multiplier * this.state.goal
                  : "III"
              }`}</Text>
            </View>
          </View>
        </Scoreboard>
        <View style={styles.inputContainer}>
          {this.state.goal !== 25 && (
            <View style={{ flex: 0.25 }}>
              <TouchableHighlight
                onPress={() => this.addScore(3)}
                style={styles.scoreButtonTriple}
                underlayColor={theme.neutrals.eighth}
              >
                <Text style={styles.scoreButtonText}>{`T ${
                  this.state.goal
                }`}</Text>
              </TouchableHighlight>
            </View>
          )}

          <View style={{ flex: this.state.goal === 25 ? 0.33 : 0.25 }}>
            <TouchableHighlight
              onPress={() => this.addScore(2)}
              style={styles.scoreButtonDouble}
              underlayColor={theme.neutrals.eighth}
            >
              <Text style={styles.scoreButtonText}>{`D ${
                this.state.goal
              }`}</Text>
            </TouchableHighlight>
          </View>
          <View style={{ flex: this.state.goal === 25 ? 0.33 : 0.25 }}>
            <TouchableHighlight
              onPress={() => this.addScore(1)}
              style={styles.scoreButtonSingle}
              underlayColor={theme.neutrals.eighth}
            >
              <Text style={styles.scoreButtonText}>{`S ${
                this.state.goal
              }`}</Text>
            </TouchableHighlight>
          </View>
          <View style={{ flex: this.state.goal === 25 ? 0.33 : 0.25 }}>
            <TouchableHighlight
              onPress={() => this.addScore(0)}
              style={styles.scoreButtonMiss}
              underlayColor={theme.neutrals.eighth}
            >
              <Text style={styles.scoreButtonText}>{`Miss`}</Text>
            </TouchableHighlight>
          </View>
        </View>

        <GameNav
          backDisabled={this.state.gameHistory.length < 1}
          moveOn={() => {
            if (this.state.round < 20) {
              this.advanceRound();
            } else {
              navigation.navigate("NineNineXStats", {
                gameHistory: this.state.gameHistory,
                goal: this.state.goal,
                score: this.state.score
              });
            }
          }}
          moveOnText={this.state.round < 20 ? "Next" : "Finish"}
          removeScore={this.removeScore}
          underlayBack={
            this.state.gameHistory.length < 1
              ? theme.neutrals.eighth
              : theme.neutrals.seventh
          }
          underlayMove={theme.primaries.lightBlues.eighth}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  gamestats: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  thrownDarts: {
    flex: 0.9,
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
    flex: 0.65,
    width: "100%"
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
  }
});

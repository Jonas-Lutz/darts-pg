import React from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { StackActions, NavigationActions } from "react-navigation";

// Colors:
import theme from "mydarts/theme";

// Components:
import Container from "mydarts/components/Container";
import GameNav from "mydarts/components/GameNav";
import FinishedModal from "mydarts/components/FinishedModal";
import Scoreboard from "mydarts/components/Scoreboard";

export default class NineNineX extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      goal: this.props.navigation.getParam("goal", 1),
      round: this.props.navigation.getParam("round", 1),
      score: this.props.navigation.getParam("score", 27),
      gameHistory: this.props.navigation.getParam("gameHistory", []),
      roundHistory: this.props.navigation.getParam("roundHistory", []),
      fetchedStats: this.props.navigation.getParam("fetchedStats", []),
      finished: false
    };
  }

  addScore = multiplier => {
    if (this.state.score > this.state.goal * 2 - 1) {
      const newGameHistory = [...this.state.gameHistory, { hits: multiplier }];
      if (multiplier > 0) {
        this.setState({
          ...this.state,
          score: this.state.score + multiplier * this.state.goal * 2,
          goal: this.state.round < 20 ? this.state.round + 1 : 25,
          round: this.state.round + 1,
          finished: this.state.goal > 20,
          gameHistory: newGameHistory
        });
      } else {
        this.setState({
          ...this.state,
          score: this.state.score - this.state.goal * 2,
          goal: this.state.round < 20 ? this.state.round + 1 : 25,
          round: this.state.round + 1,
          gameHistory: newGameHistory,
          finished: this.state.goal > 20
        });
      }
    } else {
      this.setState({
        finished: true,
        score: -1
      });
    }
  };

  removeScore = () => {
    if (this.state.gameHistory.length > 0) {
      const newGameHistory = [...this.state.gameHistory];
      const removeVal =
        newGameHistory[newGameHistory.length - 1].hits *
        (this.state.round < 21 ? this.state.round : 25);
      newGameHistory.pop();

      this.setState({
        ...this.state,
        gameHistory: newGameHistory,
        goal: this.state.goal - 1,
        score: this.state.score - removeVal,
        round: this.state.round - 1,
        finished: false
      });
    }
  };

  render() {
    const { navigation } = this.props;
    const hits = [0, 1, 2, 3];

    return (
      <Container>
        <Scoreboard flexVal={0.25}>
          <View style={styles.gamestats}>
            <Text>{`D${this.state.goal}`}</Text>
          </View>
          <View style={styles.pointWrapper}>
            <Text style={styles.pointLabel}>{`${
              this.state.score
            } points`}</Text>
          </View>
        </Scoreboard>
        <View style={styles.inputContainer}>
          {hits.map(h => (
            <View key={`${h}-hitsButton`} style={{ flex: 0.25 }}>
              <TouchableHighlight
                onPress={() => this.addScore(h)}
                style={styles.scoreButton}
                underlayColor={theme.neutrals.eighth}
              >
                <Text style={styles.scoreButtonText}>{`${h} Hits`}</Text>
              </TouchableHighlight>
            </View>
          ))}
        </View>

        <GameNav
          backDisabled={this.state.gameHistory.length < 1}
          moveOn={() => {
            if (this.state.round < 20) {
              this.addScore(0);
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
        <FinishedModal
          goHome={() => {
            navigation.navigate("Home");
          }}
          restart={() => {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: "Bobs"
                })
              ]
            });

            this.props.navigation.dispatch(resetAction);
          }}
          undo={this.removeScore}
          finished={this.state.finished}
        >
          <Text>
            {this.state.score > 0
              ? `Finished the game with ${this.state.score} points!`
              : `Game Over! Failed at D${this.state.goal}`}
            {this.state.score > 1436 && "We both know you cheated"}
          </Text>
        </FinishedModal>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  gamestats: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  pointWrapper: {},
  pointLabel: {
    fontSize: 24
  },
  inputContainer: {
    flex: 0.65,
    width: "100%"
  },
  scoreButton: {
    backgroundColor: theme.neutrals.tenth,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
    marginTop: 1,
    height: "100%",
    width: "100%"
  },
  scoreButtonText: {
    color: theme.primaries.lightBlues.first,
    fontSize: 24
  }
});

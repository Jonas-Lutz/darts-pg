import React, { Component } from "react";
import {
  AsyncStorage,
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

// ================================================================================================

// Props:
export interface Props {
  navigation: any;
}

// State:
type State = {
  goal: number;
  round: number;
  score: number;
  gameHistory: any[];
  roundHistory: any[];
  fetchedStats: any[];
  finished: boolean;
  highscore: number;
};

// ================================================================================================

export default class NineNineX extends Component<Props, State> {
  static navigationOptions = {
    header: null
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      goal: this.props.navigation.getParam("goal", 1),
      round: this.props.navigation.getParam("round", 1),
      score: this.props.navigation.getParam("score", 27),
      gameHistory: this.props.navigation.getParam("gameHistory", []),
      roundHistory: this.props.navigation.getParam("roundHistory", []),
      fetchedStats: this.props.navigation.getParam("fetchedStats", []),
      finished: false,
      highscore: 0
    };
  }

  addScore = (multiplier: number) => {
    if (this.state.score > this.state.goal * 2 - 1 || multiplier > 0) {
      const newGameHistory = [...this.state.gameHistory, { hits: multiplier }];
      if (multiplier > 0) {
        this.setState({
          ...this.state,
          score: this.state.score + multiplier * this.state.goal * 2,
          goal: this.state.round < 20 ? this.state.round + 1 : 25,
          round: this.state.goal > 20 ? this.state.round : this.state.round + 1,
          finished: this.state.goal > 20,
          gameHistory: newGameHistory
        });
      } else {
        this.setState({
          ...this.state,
          score: this.state.score - this.state.goal * 2,
          goal: this.state.round < 20 ? this.state.round + 1 : 25,
          round: this.state.goal > 20 ? this.state.round : this.state.round + 1,
          gameHistory: newGameHistory,
          finished: this.state.goal > 20
        });
      }

      if (this.state.goal > 20) {
        this.updateStats();
      }
    } else {
      if (multiplier < 1) {
        this.setState({
          finished: true,
          score: -1
        });
      }
    }
  };

  removeScore = (ended: boolean) => {
    if (this.state.gameHistory.length > 0) {
      const newGameHistory = [...this.state.gameHistory];
      const multiplier =
        newGameHistory[newGameHistory.length - 1].hits > 0
          ? newGameHistory[newGameHistory.length - 1].hits
          : -1;

      // multiplier -> wie oft geworfen
      //
      const removeVal =
        multiplier *
        (ended
          ? this.state.round > 20
            ? 25
            : this.state.round - 1
          : this.state.round <= 21
          ? this.state.round - 1
          : 25) *
        2;
      newGameHistory.pop();

      this.setState({
        ...this.state,
        gameHistory: newGameHistory,
        goal: ended
          ? this.state.goal
          : this.state.goal < 21
          ? this.state.goal - 1
          : 20,
        score: this.state.score - removeVal,
        round: ended ? this.state.round : this.state.round - 1,
        finished: false
      });
    }
  };

  // Fetch existing stats from storage
  fetchStats = async () => {
    try {
      const value = await AsyncStorage.getItem("Bobs");
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
      const res = await AsyncStorage.setItem("Bobs", JSON.stringify(highscore));
      // @ts-ignore
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
    const hits = [0, 1, 2, 3];

    return (
      <Container>
        <StatusBar hidden />
        <Scoreboard
          flexVal={0.25}
          goHome={() => {
            navigation.navigate("Home");
          }}
        >
          <View style={styles.gamestats}>
            <Text style={{ color: theme.neutrals.text }}>{`D${
              this.state.goal
            }`}</Text>
          </View>
          <View style={styles.pointWrapper}>
            <Text style={styles.pointLabel}>{`${this.state.score}`}</Text>
          </View>
        </Scoreboard>
        <View style={styles.inputContainer}>
          {hits.map(h => (
            <View key={`${h}-hitsButton`} style={{ flex: 0.25 }}>
              <TouchableHighlight
                onPress={() => this.addScore(h)}
                style={styles.scoreButton}
                underlayColor={theme.primaries.lightBlues.tenth}
              >
                <Text style={styles.scoreButtonText}>{`${h} Hit${
                  h !== 1 ? "s" : " "
                }`}</Text>
              </TouchableHighlight>
            </View>
          ))}
        </View>

        <GameNav
          backDisabled={this.state.gameHistory.length < 1}
          moveOn={() => {
            this.addScore(0);
          }}
          moveOnText={this.state.round < 21 ? "Next" : "Finish"}
          removeScore={() => this.removeScore(false)}
          underlayBack={
            this.state.gameHistory.length < 1
              ? theme.neutrals.eighth
              : theme.neutrals.seventh
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
          headline={"Bob's 27 - Statistics"}
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
          undo={() => this.removeScore(true)}
          finished={this.state.finished}
        >
          <View style={{ flexDirection: "column" }}>
            <Text>
              {this.state.score > 0
                ? `You finished with ${this.state.score} points!`
                : `Game ended at D${this.state.goal}`}
            </Text>

            {this.state.score > 1436 && (
              <Text>We both know you cheated tho</Text>
            )}
            {this.state.highscore &&
            this.state.highscore > 0 &&
            this.state.finished &&
            this.state.highscore < this.state.score ? (
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
  gamestats: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  pointWrapper: {},
  pointLabel: {
    color: theme.neutrals.text,
    fontSize: 28
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

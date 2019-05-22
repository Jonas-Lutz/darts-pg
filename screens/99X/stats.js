import React, { Component } from "react";
import {
  AsyncStorage,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import { StackActions, NavigationActions } from "react-navigation";

// Atoms:
import Headline from "../../atoms/Headline";

// Components:
import Container from "../../components/Container";

// Colors:
import theme from "../../theme";

// ================================================================================================

class Settings extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      gameHistory: this.props.navigation.getParam("gameHistory"),
      goal: this.props.navigation.getParam("goal"),
      score: this.props.navigation.getParam("score")
    };
  }

  componentDidMount() {
    this.updateStats();
  }

  // Fetch existing stats from storage
  fetchStats = async () => {
    try {
      const value = await AsyncStorage.getItem(`99-${this.state.goal}`);
      if (value) {
        return JSON.parse(value);
      } else {
        return { highscore: 0, darts: [] };
      }
    } catch {
      return { highscore: 0, darts: [] };
    }
  };

  // Append new stats to old existing
  mergeStats = oldStats => {
    const highscore = Math.max(oldStats.highscore, this.state.score);
    return {
      darts: [...oldStats.darts, ...this.state.gameHistory],
      highscore: highscore
    };
  };

  // Update stats in storage
  saveStats = async (goal, stats) => {
    try {
      const res = await AsyncStorage.setItem(
        `99-${goal}`,
        JSON.stringify(stats)
      );
      if (res) console.log(res);
    } catch {
      console.log("error saving stats");
    }
  };

  // Calls the methods
  updateStats = async () => {
    try {
      let stats = await this.fetchStats();
      const mergedStats = this.mergeStats(stats);
      this.saveStats(this.state.goal, mergedStats);
    } catch {
      console.log("error updating stats");
    }
  };

  render() {
    const { navigation } = this.props;

    let darts = [];
    this.state.gameHistory.map(round => {
      round.map(dart => {
        darts.push(dart);
      });
    });

    const misses = darts.filter(dart => dart.multiplier === 0).length;
    const triples = darts.filter(dart => dart.multiplier === 3).length;
    const doubles = darts.filter(dart => dart.multiplier === 2).length;
    const singles = darts.filter(dart => dart.multiplier === 1).length;
    const hits = darts.length - misses;
    const successRate = (100 * hits) / darts.length;
    const tripleRate = (100 * triples) / darts.length;
    const doubleRate = (100 * doubles) / darts.length;
    const singleRate = (100 * singles) / darts.length;
    const mpr = ((triples * 3 + doubles * 2 + singles) * 3) / darts.length;

    return (
      <Container>
        <View style={styles.statContainer}>
          <View style={{ flex: 0.2 }}>
            <Headline>{`${this.state.goal}-Parade Stats`}</Headline>
          </View>
          <View
            style={{
              flex: 0.7,
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%"
            }}
          >
            <View style={styles.statCol}>
              <View style={styles.category}>
                <Text style={styles.statText}>Score:</Text>
              </View>
              <View style={styles.category}>
                <Text style={styles.statText}>Makes: </Text>
              </View>
              <View style={styles.category}>
                <Text style={styles.statText}>Singles: </Text>
              </View>
              <View style={styles.category}>
                <Text style={styles.statText}>Doubles: </Text>
              </View>
              <View style={styles.category}>
                <Text style={styles.statText}>Triples: </Text>
              </View>
              <View style={styles.category}>
                <Text style={styles.statText}>MPR: </Text>
              </View>
            </View>

            <View style={styles.statCol}>
              <View style={styles.stat}>
                <Text style={styles.statText}>{this.state.score}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statText}>{`${hits} / ${
                  darts.length
                } (${successRate.toFixed(2)} %)`}</Text>
              </View>
              <View style={styles.stat}>
                <Text
                  style={styles.statText}
                >{`${singles}  (${singleRate.toFixed(2)} %)`}</Text>
              </View>
              <View style={styles.stat}>
                <Text
                  style={styles.statText}
                >{`${doubles}  (${doubleRate.toFixed(2)} %)`}</Text>
              </View>
              <View style={styles.stat}>
                <Text
                  style={styles.statText}
                >{`${triples} (${tripleRate.toFixed(2)} %)`}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statText}>{`${mpr.toFixed(2)}`}</Text>
              </View>
            </View>
          </View>

          <View style={{ flex: 0.1, flexDirection: "row" }}>
            <View style={{ flex: 0.5 }}>
              <TouchableHighlight
                onPress={() => {
                  navigation.navigate("Home");
                }}
                style={styles.backButton}
                underlayColor={theme.neutrals.seventh}
              >
                <View>
                  <Text style={{ fontSize: 20 }}>Home</Text>
                </View>
              </TouchableHighlight>
            </View>
            <View style={{ flex: 0.5 }}>
              <TouchableHighlight
                onPress={() => {
                  const resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({
                        routeName: "NineNineX",
                        params: {
                          goal: this.state.goal,
                          round: 1,
                          score: 0,
                          gameHistory: [],
                          roundHistory: [],
                          fetchedStats: []
                        }
                      })
                    ]
                  });

                  this.props.navigation.dispatch(resetAction);
                }}
                style={styles.forwardButton}
                underlayColor={theme.primaries.eighth}
              >
                <View>
                  <Text style={{ fontSize: 20 }}>Restart</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Container>
    );
  }
}

// ================================================================================================

const styles = StyleSheet.create({
  category: {
    justifyContent: "flex-start",
    marginBottom: 15,
    width: "100%"
  },
  statText: {
    fontSize: 18
  },
  stat: {
    justifyContent: "flex-start",
    marginBottom: 15,
    width: "100%"
  },
  statCol: {
    flexDirection: "column"
  },
  statContainer: {
    backgroundColor: theme.primaries.tenth,
    alignItems: "center",
    justifyContent: "space-between",
    flex: 0.9,
    padding: 10,
    width: "90%"
  },
  forwardButton: {
    backgroundColor: theme.primaries.sixth,
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.neutrals.ninth,
    flex: 1
  }
});

// ================================================================================================

export default Settings;

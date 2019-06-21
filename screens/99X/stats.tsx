import React, { useEffect } from "react";
import {
  AsyncStorage,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import {
  NavigationScreenComponent,
  NavigationScreenProps,
  StackActions,
  NavigationActions
} from "react-navigation";

// Atoms:
import Headline from "atoms/Headline";

// Components:
import Container from "components/Container";
import Scoreboard from "components/Scoreboard";

// Colors:
import theme from "theme";

// Utils
import goHome from "utils/goHome";

// ================================================================================================

// Types:
import Dart from "interfaces/dart";

export interface Stats {
  darts: Dart[][];
  highscore: number;
}

import Player from "interfaces/player";

// Props:
export interface Props extends NavigationScreenProps {
  gameHistory: Dart[][];
  goal: number;
  score: number;
  selectedPlayer: Player;
}

// ================================================================================================

const Stats: NavigationScreenComponent<Props> = ({ navigation }) => {
  const gameHistory = navigation.getParam("gameHistory");

  const goal = navigation.getParam("goal");
  const score = navigation.getParam("score");
  const selectedPlayer = navigation.getParam("selectedPlayer");

  let darts: Dart[] = [];
  gameHistory.map((round: Dart[]) => {
    round.map((dart: Dart) => {
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
  const ppr = ((triples * 3 + doubles * 2 + singles) * 3) / darts.length;

  return (
    <Container>
      <Scoreboard flexVal={0.2}>
        <Headline>{`${goal}-Practice Stats`}</Headline>
      </Scoreboard>
      <View
        style={{
          flex: 0.7,
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
          width: "80%"
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
            <Text style={styles.statText}>PPR: </Text>
          </View>
        </View>

        <View style={styles.statCol}>
          <View style={styles.stat}>
            <Text style={styles.statText}>{score}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statText}>{`${hits} / ${
              darts.length
            } (${successRate.toFixed(2)} %)`}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statText}>{`${singles}  (${singleRate.toFixed(
              2
            )} %)`}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statText}>{`${doubles}  (${doubleRate.toFixed(
              2
            )} %)`}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statText}>{`${triples} (${tripleRate.toFixed(
              2
            )} %)`}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statText}>{`${ppr.toFixed(2)}`}</Text>
          </View>
        </View>
      </View>

      <View style={{ flex: 0.1, flexDirection: "row" }}>
        <View style={{ flex: 0.5 }}>
          <TouchableHighlight
            onPress={() => goHome(navigation)}
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
                      goal: goal,
                      round: 1,
                      score: 0,
                      gameHistory: [],
                      roundHistory: [],
                      fetchedStats: [],
                      selectedPlayer: selectedPlayer
                    }
                  })
                ]
              });

              navigation.dispatch(resetAction);
            }}
            style={styles.forwardButton}
            underlayColor={theme.primaries.lightBlues.eighth}
          >
            <View>
              <Text style={{ color: theme.neutrals.tenth, fontSize: 20 }}>
                Restart
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </Container>
  );
};

Stats.navigationOptions = {
  header: null
};

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
  forwardButton: {
    backgroundColor: theme.primaries.lightBlues.third,
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

export default Stats;

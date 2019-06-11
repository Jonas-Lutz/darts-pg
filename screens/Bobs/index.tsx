import React, { FC, useState } from "react";
import {
  AsyncStorage,
  StyleSheet,
  StatusBar,
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

// Colors:
import theme from "theme";

// Components:
import Container from "components/Container";
import GameNav from "components/GameNav";
import FinishedModal from "components/FinishedModal";
import Scoreboard from "components/Scoreboard";

// Utils:
import goHome from "utils/goHome";

// ================================================================================================

// Types:
export interface Round {
  hits: number;
}

export interface BobsStats {
  highscore: number;
}

// Props:
export interface Props extends NavigationScreenProps {
  goal: number;
  round: number;
  score: number;
  gameHistory: Round[];
}

// ================================================================================================

const Bobs27: NavigationScreenComponent<Props> = ({ navigation }) => {
  // State:
  const [goal, setGoal] = useState(navigation.getParam("goal", 1));
  const [round, setRound] = useState(navigation.getParam("round", 1));
  const [score, setScore] = useState(navigation.getParam("score", 27));
  const [gameHistory, setGameHistory] = useState(
    navigation.getParam("gameHistory", [])
  );
  const [finished, setFinished] = useState(false);
  const [highscore, setHighscore] = useState(0);

  // Consts:
  const hits = [0, 1, 2, 3];

  // ================================================================================================

  const addScore = (multiplier: number) => {
    if (score > goal * 2 - 1 || multiplier > 0) {
      const newGameHistory: Round[] = [...gameHistory, { hits: multiplier }];

      // Update State
      if (multiplier > 0) {
        setScore(score + multiplier * goal * 2);
      } else {
        setScore(score - goal * 2);
      }
      setGoal(round < 20 ? round + 1 : 25);
      setRound(goal > 20 ? round : round + 1);
      setGameHistory(newGameHistory);
      setFinished(goal > 20);
      if (goal > 20) {
        updateStats();
      }
    } else {
      if (multiplier < 1) {
        setFinished(true);
        setScore(-1);
      }
    }
  };

  const removeScore = (ended: boolean) => {
    if (gameHistory.length > 0) {
      const newGameHistory = [...gameHistory];
      const multiplier =
        newGameHistory[newGameHistory.length - 1].hits > 0
          ? newGameHistory[newGameHistory.length - 1].hits
          : -1;

      const removeVal =
        multiplier *
        (ended ? (round > 20 ? 25 : round - 1) : round <= 21 ? round - 1 : 25) *
        2;
      newGameHistory.pop();

      // Update State
      setGameHistory(newGameHistory);
      setGoal(ended ? goal : goal < 21 ? goal - 1 : 20);
      setScore(score - removeVal);
      setRound(ended ? round : round - 1);
      setFinished(false);
    }
  };

  // Fetch existing stats from storage
  const fetchStats = async () => {
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
  const mergeStats = (oldStats: BobsStats) => {
    const highscore = Math.max(oldStats.highscore, score);
    return {
      highscore: highscore
    };
  };

  // Update stats in storage
  const saveStats = async (highscore: BobsStats) => {
    try {
      const res = await AsyncStorage.setItem("Bobs", JSON.stringify(highscore));
      // @ts-ignore
      if (res) console.log("saved: ", res);
    } catch {
      console.log("error saving stats");
    }
  };

  // Calls the methods
  const updateStats = async () => {
    try {
      let currHigh = await fetchStats();
      setHighscore(currHigh.highscore);
      const mergedStats = mergeStats(currHigh);
      saveStats(mergedStats);
    } catch {
      console.log("error updating stats");
    }
  };

  // ================================================================================================

  return (
    <Container>
      <StatusBar hidden />
      <Scoreboard flexVal={0.25} goHome={() => goHome(navigation)}>
        <View style={styles.gamestats}>
          <Text>Bob's 27</Text>
          <Text style={{ color: theme.neutrals.text }}>{`D${goal}`}</Text>
        </View>
        <View style={styles.pointWrapper}>
          <Text style={styles.pointLabel}>{`${score}`}</Text>
        </View>
      </Scoreboard>
      <View style={styles.inputContainer}>
        {hits.map(h => (
          <View key={`${h}-hitsButton`} style={{ flex: 0.25 }}>
            <TouchableHighlight
              onPress={() => addScore(h)}
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
        backDisabled={gameHistory.length < 1}
        moveOn={() => {
          addScore(0);
        }}
        moveOnText={round < 21 ? "Next" : "Finish"}
        removeScore={() => removeScore(false)}
        underlayBack={
          gameHistory.length < 1
            ? theme.neutrals.eighth
            : theme.neutrals.seventh
        }
        underlayMove={theme.primaries.lightBlues.eighth}
      />
      <FinishedModal
        goHome={() => goHome(navigation)}
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
          navigation.dispatch(resetAction);
        }}
        undo={() => removeScore(true)}
        finished={finished}
      >
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.resultText}>
            {score > 0
              ? `You finished with ${score} points!`
              : `Game ended at D${goal}`}
          </Text>

          {score > 1436 && <Text>We both know you cheated tho</Text>}
          {highscore && highscore > 0 && finished && highscore < score ? (
            <Text
              style={styles.resultText}
            >{`That's a new Carreer High - Gratz!`}</Text>
          ) : (
            <Text
              style={styles.resultText}
            >{`Carreer High: ${highscore}`}</Text>
          )}
        </View>
      </FinishedModal>
    </Container>
  );
};

// ===============================================================================================

Bobs27.navigationOptions = {
  header: null
};

// ===============================================================================================

const styles = StyleSheet.create({
  gamestats: {
    alignItems: "center",
    flex: 0.5,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: 10,
    width: "100%"
  },
  resultText: {
    fontSize: 20
  },
  pointWrapper: { flex: 0.5 },
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

export default Bobs27;

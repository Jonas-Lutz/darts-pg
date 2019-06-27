import React, { useRef, useEffect, useState } from "react";
import {
  AsyncStorage,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  ScrollView,
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
import updateStats, { GameMode } from "utils/updateStats";

// ================================================================================================

// Types:
import Player from "interfaces/player";

export interface PlayerRound {
  scores: number[];
  playerId: string;
}

export interface BobsStats {
  highscore: number;
}

// Props:
export interface Props extends NavigationScreenProps {
  goal: number;
  round: number;
  gameHistory: PlayerRound[];
  selectedPlayers: Player[];
}

// ================================================================================================

const Bobs27: NavigationScreenComponent<Props> = ({ navigation }) => {
  // State:
  const selectedPlayers = navigation.getParam("selectedPlayers");
  const [goal, setGoal] = useState(navigation.getParam("goal", 1));
  const [round, setRound] = useState(navigation.getParam("round", 1));
  const [scores, setScores] = useState(selectedPlayers.map(sp => 27));
  const [gameHistory, setGameHistory] = useState<PlayerRound[]>(
    selectedPlayers.map(sp => ({ playerId: sp.id, scores: [] }))
  );
  const [finished, setFinished] = useState(false);
  const [activePlayer, setActivePlayer] = useState(0);

  const hits = [0, 1, 2, 3];
  const didMountRef = useRef(false);
  const scoreBoardRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get("screen").width;

  // ================================================================================================

  // Effect - Save Stats
  useEffect(() => {
    if (didMountRef.current) {
      const mode: "bobs" = "bobs";
      const bobsStats = selectedPlayers.map((sp, index) => ({
        gameMode: mode as "bobs",
        stats: {
          total: scores[index]
        },
        playerId: sp.id
      }));
      updateStats(bobsStats);
    } else {
      didMountRef.current = true;
    }
  }, [finished]);

  // Effect - Check, if someone has negative score
  useEffect(() => {
    const scoresBelowZero = scores.filter(s => s < 1);
    if (scoresBelowZero.length) {
      setFinished(true);
    }
  }, [scores]);

  // Effect - Update Displayed Players
  useEffect(() => {
    if (selectedPlayers.length > 3 && scoreBoardRef.current) {
      const offset = (activePlayer * screenWidth) / 3;
      scoreBoardRef.current.scrollTo({
        x: offset,
        animated: true
      });
    }
  }, [activePlayer, scoreBoardRef]);

  // ================================================================================================

  const addScore = (makes: number) => {
    const newGameHistory: PlayerRound[] = [...gameHistory];
    const playerId = newGameHistory[activePlayer].playerId;

    newGameHistory.splice(activePlayer, 1, {
      playerId: playerId,
      scores: [...newGameHistory[activePlayer].scores, makes]
    });

    // Update State
    const newScores = [...scores];
    if (makes > 0) {
      newScores.splice(
        activePlayer,
        1,
        newScores[activePlayer] + makes * goal * 2
      );
    } else {
      newScores.splice(activePlayer, 1, newScores[activePlayer] - goal * 2);
    }
    setScores(newScores);
    // Next Round:
    if (activePlayer === selectedPlayers.length - 1) {
      setGoal(round < 20 ? round + 1 : 25);
      setActivePlayer(0);
      setFinished(goal > 20);
      setRound(goal > 20 ? round : round + 1);
    }
    // Not last player:
    else {
      setActivePlayer(activePlayer + 1);
    }

    setGameHistory(newGameHistory);
    if (goal > 20) {
      /*         updateStats();
       */
    }
  };

  const removeScore = (ended: boolean) => {
    // The Index of the Player
    const removePlayerIndex =
      activePlayer === 0 ? selectedPlayers.length - 1 : activePlayer - 1;
    const roundBack = removePlayerIndex === selectedPlayers.length - 1;

    if (gameHistory[removePlayerIndex].scores.length > 0) {
      const newGameHistory = [...gameHistory];
      const multiplier =
        newGameHistory[removePlayerIndex].scores[
          newGameHistory[removePlayerIndex].scores.length - 1
        ] === 0
          ? -1
          : newGameHistory[removePlayerIndex].scores[
              newGameHistory[removePlayerIndex].scores.length - 1
            ];
      // Removed Value:
      const removeVal = multiplier * (roundBack ? goal - 1 : goal) * 2;

      // Remove the value from Players Makes:
      newGameHistory[removePlayerIndex].scores.pop();

      // Adjust Round, Goal:
      if (activePlayer === 0) {
        setRound(round - 1);
        setGoal(ended ? goal : goal < 21 ? goal - 1 : 20);
      }

      // Scores
      const newScores = [...scores];
      newScores[removePlayerIndex] = newScores[removePlayerIndex] - removeVal;

      // Update State
      setActivePlayer(removePlayerIndex);
      setGameHistory(newGameHistory);
      setScores(newScores);
      setFinished(false);
    }
  };

  // ================================================================================================

  return (
    <Container>
      <Scoreboard
        flexVal={0.25}
        leftHeadline={`D${goal}`}
        headline="Bob's 27"
        goHome={() => {
          goHome(navigation);
        }}
      >
        <ScrollView
          horizontal
          ref={scoreBoardRef}
          style={{ flexDirection: "row" }}
        >
          {selectedPlayers &&
            selectedPlayers.length > 0 &&
            selectedPlayers.map((sp: Player, index) => {
              return (
                <View
                  key={sp.id}
                  style={{
                    backgroundColor:
                      index === activePlayer
                        ? theme.primaries.yellows.ninth
                        : "transparent",
                    width:
                      selectedPlayers.length > 3
                        ? screenWidth / 3
                        : screenWidth / selectedPlayers.length,
                    flexBasis:
                      selectedPlayers.length > 2
                        ? "33.3333%"
                        : selectedPlayers.length === 1
                        ? "100%"
                        : "50%"
                  }}
                >
                  <View style={styles.gamestats}>
                    <Text style={{ color: theme.neutrals.text }}>
                      {sp.name}
                    </Text>
                  </View>
                  <View style={styles.pointWrapper}>
                    <Text style={styles.pointLabel}>{`${scores[index]}`}</Text>
                  </View>
                </View>
              );
            })}
        </ScrollView>
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
        backDisabled={gameHistory[0].scores.length < 1}
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
                routeName: "Bobs",
                params: { selectedPlayers: selectedPlayers }
              })
            ]
          });
          navigation.dispatch(resetAction);
        }}
        undo={() => removeScore(true)}
        finished={finished}
      >
        <View style={{ flexDirection: "column" }}>
          {selectedPlayers.map((sp, index) => {
            return (
              <View key={`Stats-${sp.id}`} style={{ marginBottom: 10 }}>
                <Text style={styles.resultText}>{sp.name}</Text>
                <Text style={styles.resultText}>
                  {scores[index] > 0
                    ? `Finished with ${scores[index]} points!`
                    : `Busted at D${goal}`}
                </Text>

                {scores[index] > 1436 && (
                  <Text>We both know you cheated tho</Text>
                )}
              </View>
            );
          })}
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
  pointWrapper: { alignItems: "center", flex: 0.5 },
  pointLabel: {
    color: theme.neutrals.text,
    fontSize: 34
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

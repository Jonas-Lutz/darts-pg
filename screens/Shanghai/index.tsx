import React, { useRef, useEffect, useState } from "react";
import {
  AsyncStorage,
  StyleSheet,
  Text,
  TouchableHighlight,
  Image,
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
import { smallScreen } from "utils/deviceRatio";
import { getLabel } from "utils/getLabel";
import calcMPR from "utils/calcMPR";
import goHome from "utils/goHome";
import updateStats from "utils/updateStats";

// ================================================================================================
// Types:
export interface ShanghaiStats {
  highscore: number;
}
import Player from "interfaces/player";

export interface Dart {
  multiplier: number;
  points: number;
}

export interface PlayerRound {
  playerId: string;
  rounds: Dart[][];
}

// Props:
export interface Props extends NavigationScreenProps {
  selectedPlayers: Player[];
}

// ================================================================================================

const isSmall = smallScreen();

const Shanghai: NavigationScreenComponent<Props> = ({ navigation }) => {
  const goals = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20
  ];

  const selectedPlayers = navigation.getParam("selectedPlayers");
  const [activePlayer, setActivePlayer] = useState(0);
  const [scores, setScores] = useState(selectedPlayers.map(sp => 0));
  const [gameHistory, setGameHistory] = useState<Array<PlayerRound>>(
    selectedPlayers.map(sp => ({ playerId: sp.id, rounds: [] }))
  );
  const [roundHistory, setRoundHistory] = useState<Array<Dart>>([]);
  const [round, setRound] = useState(1);
  const [finished, setFinished] = useState(false);
  const [highscore, setHighscore] = useState(0);
  const [shanghai, setShanghai] = useState(false);
  const didMountRef = useRef(false);

  // ================================================================================================

  useEffect(() => {
    if (didMountRef.current) {
      const mode = "shanghai";
      const shanghaiStats = selectedPlayers.map((sp, index) => ({
        gameMode: mode as "shanghai",
        playerId: sp.id,
        stats: { total: scores[index] }
      }));
      updateStats(shanghaiStats);
    } else {
      didMountRef.current = true;
    }
  }, [finished]);

  useEffect(() => {
    console.log(
      "// =======================NEUE RUNDE ============================================================="
    );
    console.log(gameHistory);
  }, [gameHistory]);

  // ================================================================================================

  const advanceRound = () => {
    const lastPlayer = activePlayer === selectedPlayers.length - 1;
    // Darts dieser Runde:
    let filledUpRoundHistory: Dart[] = [...roundHistory];

    // Das Gesamte Spiel:
    const copyGameHistory = [...gameHistory];

    // Runden Nummber
    const newRound = lastPlayer ? round + 1 : round;

    // Add Misses, if less than 3 Darts were entered
    if (filledUpRoundHistory.length < 3) {
      if (filledUpRoundHistory.length > 0) {
        copyGameHistory[activePlayer].rounds.pop();
      }
      for (let i = filledUpRoundHistory.length; i < 3; i++) {
        filledUpRoundHistory.push({
          points: 0,
          multiplier: 0
        });
      }
    }

    // filledUpRoundHistory an letzte Stelle in ActiverSpieler -> rounds packen
    const newRounds = [
      ...copyGameHistory[activePlayer].rounds,
      filledUpRoundHistory
    ];

    // neue Player history in Gamehistory verstauen
    copyGameHistory.splice(activePlayer, 1, {
      playerId: selectedPlayers[activePlayer].id,
      rounds: newRounds
    });

    // Update State
    setActivePlayer(lastPlayer ? 0 : activePlayer + 1);
    setRound(newRound);
    setRoundHistory([]);
    setGameHistory(copyGameHistory);
    setShanghai(false);
    if (round === 20 && lastPlayer) {
      setFinished(true);
    }
  };

  const countThrow = (points: number) => {
    const playerRoundHistory = gameHistory[activePlayer].rounds;
    if (roundHistory.length < 3) {
      // Removes the current Round from Game-History
      const copyPlayerGameHistory = [...playerRoundHistory];
      if (roundHistory.length > 0) {
        copyPlayerGameHistory.pop();
      }

      // Update new Round-History with current throw
      const newRoundHistory = [
        ...roundHistory,
        {
          points: points,
          multiplier: points === 0 ? 0 : 1
        }
      ];

      // Add Updated Round-History to Player-Game-History
      copyPlayerGameHistory.push(newRoundHistory);

      // Add Updated Player Game History to overall History
      const newGameHistory = [...gameHistory];

      newGameHistory[activePlayer].rounds = copyPlayerGameHistory;
      // Shanghai ?
      const isShanghai = newRoundHistory.map(dart => dart.points);

      setGameHistory(newGameHistory);
      setRoundHistory(newRoundHistory);
      const newScores = [...scores];
      newScores.splice(
        activePlayer,
        1,
        scores[activePlayer] - points * goals[round - 1]
      );

      setScores(newScores);

      if (
        isShanghai.includes(-1) &&
        isShanghai.includes(-2) &&
        isShanghai.includes(-3)
      ) {
        // Update State
        setFinished(true);
        setShanghai(true);
      } else {
        // Update State
        setFinished(false);
      }
    }
  };

  const removeScore = () => {
    let newActivePlayer = activePlayer;
    const firstPlayer = activePlayer === 0;
    const prevPlayer =
      activePlayer > 0 ? activePlayer - 1 : selectedPlayers.length - 1;

    // At least 1 dart thrown
    if (gameHistory[0].rounds.length > 0) {
      if (
        // Dart thrown previous round
        gameHistory[prevPlayer].rounds.length > 0 ||
        // or this round
        gameHistory[activePlayer].rounds.length > 0
      ) {
        let newRound = round;
        let newRoundHistory = [...roundHistory];
        let updatedGameHistory = [...gameHistory];
        let addValue = 0;

        // IF: darts thrown this round
        if (roundHistory.length > 0) {
          // Value to add to game score
          addValue =
            roundHistory[roundHistory.length - 1].points * goals[round - 1];

          newRoundHistory.pop();

          // Still darts left this round
          if (newRoundHistory.length > 0) {
            const removedLast = [...gameHistory[activePlayer].rounds];
            removedLast.pop();

            updatedGameHistory.splice(activePlayer, 1, {
              playerId: selectedPlayers[activePlayer].id,
              rounds: [...removedLast, newRoundHistory]
            });
          } else {
            // Removed the only dart this round
            const removedLast = [...gameHistory[activePlayer].rounds];
            removedLast.pop();
            updatedGameHistory.splice(activePlayer, 1, {
              playerId: selectedPlayers[activePlayer].id,
              rounds: removedLast
            });
          }
        }
        // ELSE: No darts thrown this round
        else {
          newActivePlayer = prevPlayer;
          newRound = firstPlayer
            ? newRound - 1 >= 1
              ? newRound - 1
              : 1
            : round;

          console.log(
            "// ============================================================================================="
          );
          console.log("GameHistory: ", gameHistory);
          console.log("NR: ", newRound);
          addValue =
            gameHistory[prevPlayer].rounds[newRound - 1][2].points *
            goals[newRound - 1];
          newRoundHistory = [...gameHistory[prevPlayer].rounds[newRound - 1]];

          newRoundHistory.pop();
          gameHistory[activePlayer].rounds.pop();

          if (newRoundHistory.length > 0) {
            updatedGameHistory.splice(activePlayer, 1, {
              playerId: selectedPlayers[activePlayer].id,
              rounds: [...gameHistory[activePlayer].rounds, newRoundHistory]
            });
          } else {
            updatedGameHistory.splice(prevPlayer, 1, {
              playerId: selectedPlayers[prevPlayer].id,
              rounds: [...gameHistory[prevPlayer].rounds, newRoundHistory]
            });
          }
        }

        const newScores = [...scores];
        newScores.splice(
          newActivePlayer,
          1,
          newScores[newActivePlayer] + addValue
        );

        // Update State
        setActivePlayer(newActivePlayer);
        setRound(newRound <= 1 ? 1 : newRound);
        setScores(newScores);
        setRoundHistory(newRoundHistory);
        setGameHistory(updatedGameHistory);
        setFinished(false);
        setShanghai(false);
      }
    } else {
      setRound(1);
    }
  };

  // ================================================================================================

  return (
    <Container>
      <Scoreboard
        flexVal={0.3}
        goHome={() => goHome(navigation)}
        headline="Shanghai"
      >
        <ScrollView
          horizontal
          contentContainerStyle={{
            width: "100%",
            flex: 1,
            flexDirection: "row"
          }}
        >
          {selectedPlayers.map((sp: Player, index: number) => (
            <View
              key={sp.id}
              style={{
                alignItems: "center",
                backgroundColor:
                  index === activePlayer
                    ? theme.primaries.yellows.ninth
                    : "transparent",
                marginBottom: 2,
                width:
                  selectedPlayers.length > 2
                    ? "33.3333%"
                    : selectedPlayers.length === 1
                    ? "100%"
                    : "50%"
              }}
            >
              <Text style={styles.nameText}>{sp.name}</Text>
              <View style={styles.scoreWrapper}>
                <Text style={styles.scoreText}>{`${scores[index]}`}</Text>
              </View>
              <View style={styles.mprWrapper}>
                <Text style={styles.mprText}>{`MPR: ${calcMPR(
                  scores[index],
                  Math.max(1, round - 1 + roundHistory.length / 3)
                )}`}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.dartsDisplay}>
          <View style={styles.dartsDisplayDart}>
            <Text style={styles.dartText}>
              {roundHistory.length > 0 ? (
                roundHistory[0].points === 0 ? (
                  "Miss"
                ) : (
                  `${getLabel(roundHistory[0].points * -1)}${goals[round - 1]}`
                )
              ) : (
                <Image
                  source={require("../../assets/arrow.png")}
                  style={{ width: 20, height: 20 }}
                />
              )}
            </Text>
          </View>
          <View style={styles.dartsDisplayDart}>
            <Text style={styles.dartText}>
              {roundHistory.length > 1 ? (
                roundHistory[1].points === 0 ? (
                  "Miss"
                ) : (
                  `${getLabel(roundHistory[1].points * -1)}${goals[round - 1]}`
                )
              ) : (
                <Image
                  source={require("../../assets/arrow.png")}
                  style={{ width: 20, height: 20 }}
                />
              )}
            </Text>
          </View>
          <View style={styles.dartsDisplayDart}>
            <Text style={styles.dartText}>
              {roundHistory.length > 2 ? (
                roundHistory[2].points === 0 ? (
                  "Miss"
                ) : (
                  `${getLabel(roundHistory[2].points * -1)}${goals[round - 1]}`
                )
              ) : (
                <Image
                  source={require("../../assets/arrow.png")}
                  style={{ width: 20, height: 20 }}
                />
              )}
            </Text>
          </View>
        </View>
      </Scoreboard>
      <View style={styles.buttonsWrapper}>
        {goals[round - 1] !== 25 && (
          <View style={{ flex: 0.25 }}>
            <TouchableHighlight
              onPress={() => countThrow(-3)}
              style={styles.scoreButton}
              underlayColor={theme.primaries.lightBlues.tenth}
            >
              <Text style={styles.buttonText}>{`T ${goals[round - 1]}`}</Text>
            </TouchableHighlight>
          </View>
        )}

        <View
          style={{
            flex: goals[round - 1] === 25 ? 1 / 3 : 0.25
          }}
        >
          <TouchableHighlight
            onPress={() => countThrow(-2)}
            style={styles.scoreButton}
            underlayColor={theme.primaries.lightBlues.tenth}
          >
            <Text style={styles.buttonText}>{`D ${goals[round - 1]}`}</Text>
          </TouchableHighlight>
        </View>
        <View
          style={{
            flex: goals[round - 1] === 25 ? 1 / 3 : 0.25
          }}
        >
          <TouchableHighlight
            onPress={() => countThrow(-1)}
            style={styles.scoreButton}
            underlayColor={theme.primaries.lightBlues.tenth}
          >
            <Text style={styles.buttonText}>{`S ${goals[round - 1]}`}</Text>
          </TouchableHighlight>
        </View>
        <View
          style={{
            flex: goals[round - 1] === 25 ? 1 / 3 : 0.25
          }}
        >
          <TouchableHighlight
            onPress={() => countThrow(0)}
            style={styles.scoreButton}
            underlayColor={theme.primaries.lightBlues.tenth}
          >
            <Text style={styles.buttonText}>{`Miss`}</Text>
          </TouchableHighlight>
        </View>
      </View>
      <GameNav
        backDisabled={gameHistory.length < 1}
        moveOn={advanceRound}
        moveOnText="Next"
        removeScore={removeScore}
        underlayBack={
          gameHistory.length < 1
            ? theme.neutrals.seventh
            : theme.neutrals.eighth
        }
        underlayMove={theme.primaries.lightBlues.eighth}
      />
      <FinishedModal
        goHome={() => goHome(navigation)}
        headline={shanghai ? "Shanghai!" : "Stats"}
        restart={() => {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "Shanghai",
                params: {
                  selectedPlayers: selectedPlayers
                }
              })
            ]
          });
          navigation.dispatch(resetAction);
        }}
        undo={removeScore}
        finished={finished}
      >
        <View style={styles.resultWrapper}>
          {shanghai && (
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {`${
                selectedPlayers[activePlayer].name
              } wins! Finished by Shanghai`}
            </Text>
          )}
          {selectedPlayers.map((sp, index) => (
            <View key={sp.id}>
              <Text>{sp.name}</Text>
              <Text style={styles.resultText}>{`Score: ${
                scores[index]
              } (MPR: ${(
                scores[index] /
                (gameHistory.length / selectedPlayers.length)
              ).toFixed(1)}).`}</Text>

              {finished && highscore < scores[index] ? (
                <Text
                  style={styles.resultText}
                >{`That's a new Carreer High - Gratz!`}</Text>
              ) : (
                <Text
                  style={styles.resultText}
                >{`Carreer High: ${highscore}`}</Text>
              )}
            </View>
          ))}
        </View>
      </FinishedModal>
    </Container>
  );
};

Shanghai.navigationOptions = {
  header: null
};

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
  nameText: {
    color: theme.neutrals.text
  },
  mprText: {
    color: theme.neutrals.text,
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
    justifyContent: "center",
    flex: 0.33
  },
  dartText: {
    color: theme.neutrals.text,
    fontSize: 20
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
    color: theme.neutrals.text,
    fontSize: 34,
    fontWeight: "bold"
  },
  buttonText: {
    color: theme.primaries.lightBlues.first,
    fontSize: 24
  },
  resultText: {
    fontSize: 20
  },
  resultWrapper: { flexDirection: "column", padding: 10 }
});

export default Shanghai;

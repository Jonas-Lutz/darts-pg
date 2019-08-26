import React, { useRef, useEffect, useState, ReactElement } from "react";
import {
  AsyncStorage,
  Dimensions,
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
import AnimatedNumber from "components/AnimatedNumber";
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
  const [shanghai, setShanghai] = useState(false);
  const [winners, setWinners] = useState<Array<number>>([]);
  const didMountRef = useRef(false);
  const winnerRef = useRef(false);
  const scoreBoardRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get("screen").width;

  // ================================================================================================

  useEffect(() => {
    if (winnerRef.current) {
      getWinner();
    } else {
      winnerRef.current = true;
    }
  }, [finished]);

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
  /* 
    Advances the round and/or player
    Fills up the roundHistory with misses, if less than 3 darts were entered
   */
  const advanceRound = () => {
    const copyGameHistory = [...gameHistory];
    // Last player in Array?
    const isLastPlayer = activePlayer === selectedPlayers.length - 1;

    // Darts dieser Runde:
    let filledUpRoundHistory = [...roundHistory];
    // Add Misses
    if (filledUpRoundHistory.length < 3) {
      for (let i = filledUpRoundHistory.length; i < 3; i++) {
        filledUpRoundHistory.push({
          points: 0,
          multiplier: 0
        });
      }
    }

    // letztes Element aus Player-Round-History entfernen (wird ersetzt)
    if (copyGameHistory[activePlayer].rounds.length === round) {
      copyGameHistory[activePlayer].rounds.pop();
    }

    // filledUpRoundHistory an letzte Stelle in Player-Round-History packen
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
    setActivePlayer(isLastPlayer ? 0 : activePlayer + 1);
    setRound(isLastPlayer ? round + 1 : round);
    setRoundHistory([]);
    setGameHistory(copyGameHistory);
    if (round === 20 && isLastPlayer) {
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

  const getWinner = () => {
    let maxVal = 0;
    let winnerIdexes: number[] = [];
    scores.map((score, index) => {
      if (score > maxVal) {
        maxVal = score;
        winnerIdexes = [index];
      } else if (score === maxVal) {
        winnerIdexes.push(index);
      }
    });
    setWinners(winnerIdexes);
  };

  const removeScore = () => {
    const firstPlayer = activePlayer === 0;
    const prevPlayer =
      activePlayer > 0 ? activePlayer - 1 : selectedPlayers.length - 1;
    const removePlayer = roundHistory.length > 0 ? activePlayer : prevPlayer;

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
            const removedLast = [...gameHistory[removePlayer].rounds];
            removedLast.pop();

            updatedGameHistory.splice(removePlayer, 1, {
              playerId: selectedPlayers[removePlayer].id,
              rounds: [...removedLast, newRoundHistory]
            });
          } else {
            // Removed the only dart this round
            const removedLast = [...gameHistory[removePlayer].rounds];
            removedLast.pop();
            updatedGameHistory.splice(removePlayer, 1, {
              playerId: selectedPlayers[removePlayer].id,
              rounds: removedLast
            });
          }
        }
        // ELSE: No darts thrown this round
        else {
          newRound = firstPlayer
            ? newRound - 1 >= 1
              ? newRound - 1
              : 1
            : round;

          addValue =
            gameHistory[removePlayer].rounds[newRound - 1][2].points *
            goals[newRound - 1];
          newRoundHistory = [...gameHistory[removePlayer].rounds[newRound - 1]];

          newRoundHistory.pop();
          gameHistory[removePlayer].rounds.pop();

          if (newRoundHistory.length > 0) {
            updatedGameHistory.splice(removePlayer, 1, {
              playerId: selectedPlayers[removePlayer].id,
              rounds: [...gameHistory[removePlayer].rounds, newRoundHistory]
            });
          } else {
            updatedGameHistory.splice(removePlayer, 1, {
              playerId: selectedPlayers[removePlayer].id,
              rounds: [...gameHistory[removePlayer].rounds, newRoundHistory]
            });
          }
        }

        const newScores = [...scores];
        newScores.splice(removePlayer, 1, newScores[removePlayer] + addValue);

        // Update State
        setActivePlayer(removePlayer);
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

  const saveStats = () => {
    const mode = "shanghai";
    const shanghaiStats = selectedPlayers.map((sp, index) => ({
      gameMode: mode as "shanghai",
      playerId: sp.id,
      stats: {
        total: scores[index],
        winner: selectedPlayers.length > 1 && winners.includes(index),
        shanghai: winners.includes(index) && shanghai
      }
    }));
    updateStats(shanghaiStats);
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
          ref={scoreBoardRef}
          style={{ flexDirection: "row" }}
        >
          {selectedPlayers.map((sp: Player, index: number) => {
            let hits = 0;
            gameHistory[index].rounds.forEach(p => {
              p.forEach(pp => {
                hits -= pp.points;
              });
            });

            return (
              <View
                key={`ScoreBoard-Player-View${sp.id}`}
                style={{
                  alignItems: "center",
                  backgroundColor:
                    index === activePlayer
                      ? theme.primaries.yellows.ninth
                      : "transparent",
                  marginBottom: 2,
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
                <Text style={styles.nameText}>{sp.name}</Text>
                <View style={styles.scoreWrapper}>
                  <AnimatedNumber
                    style={styles.scoreText}
                    value={scores[index]}
                  />
                </View>
                <View style={styles.mprWrapper}>
                  <Text style={styles.mprText}>{`MPR: ${calcMPR(
                    hits,
                    Math.max(1, round - 1 + roundHistory.length / 3)
                  )}`}</Text>
                </View>
              </View>
            );
          })}
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
      <View style={{ flex: 0.1 }}>
        <GameNav
          backDisabled={!(gameHistory[0].rounds.length > 0)}
          moveOn={advanceRound}
          moveOnText="Next"
          removeScore={removeScore}
          runAnimation={roundHistory.length > 2}
          underlayBack={
            gameHistory.length < 1
              ? theme.neutrals.seventh
              : theme.neutrals.eighth
          }
          underlayMove={theme.primaries.lightBlues.eighth}
        />
      </View>
      <FinishedModal
        goHome={() => {
          saveStats();
          goHome(navigation);
        }}
        headline={shanghai ? "Shanghai Finish!" : "Stats"}
        restart={() => {
          saveStats();
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
        <View>
          {shanghai && (
            <View style={styles.subHeader}>
              <Text style={styles.subHeaderText}>
                {`${selectedPlayers[activePlayer].name} wins!`}
              </Text>
            </View>
          )}
          {selectedPlayers.length > 1 && winners.length > 0 && !shanghai && (
            <View style={styles.subHeader}>
              {winners.length > 1 ? (
                <Text style={styles.subHeaderText}>{`Draw!`}</Text>
              ) : (
                <Text style={styles.subHeaderText}>{`${
                  selectedPlayers[winners[0]].name
                } wins!`}</Text>
              )}
            </View>
          )}
          {selectedPlayers.map((sp, index) => (
            <View key={sp.id} style={{ marginBottom: 10 }}>
              <Text style={styles.resultTextBold}>{sp.name}</Text>
              <Text style={styles.resultText}>{`Score: ${
                scores[index]
              } (MPR: ${(
                scores[index] /
                (gameHistory.length / selectedPlayers.length)
              ).toFixed(1)}).`}</Text>
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
    minHeight: 15,
    justifyContent: "space-between",
    width: "100%",
    marginTop: 2
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
  resultTextBold: {
    fontWeight: "bold",
    fontSize: 20
  },
  resultWrapper: { flexDirection: "column", padding: 10 },
  boldResultText: {
    fontWeight: "bold",
    fontSize: 20
  },
  subHeader: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10
  },
  subHeaderText: {
    fontWeight: "bold",
    fontSize: 24
  }
});

export default Shanghai;

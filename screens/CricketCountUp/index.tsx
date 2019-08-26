import React, { useRef, useEffect, useState } from "react";
import {
  AsyncStorage,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  Image,
  View,
  ScrollView
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

const isSmall = smallScreen();

// ================================================================================================
// Types:
import noIdDart from "interfaces/noIdDart";
import Player from "interfaces/player";

export interface PlayerRound {
  playerId: string;
  rounds: number[][];
}

export interface CricketCountUpStats {
  highscore: number;
}

// Props:
export interface Props extends NavigationScreenProps {
  selectedPlayers: Player[];
}

// ================================================================================================

const CricketCountUp: NavigationScreenComponent<Props> = ({ navigation }) => {
  const goals = [20, 19, 18, 17, 16, 15, 25];

  const selectedPlayers = navigation.getParam("selectedPlayers");
  const [gameHistory, setGameHistory] = useState<Array<PlayerRound>>(
    selectedPlayers.map(sp => ({ playerId: sp.id, rounds: [] }))
  );
  const [scores, setScores] = useState(selectedPlayers.map(sp => 0));
  const [roundHistory, setRoundHistory] = useState<Array<number>>([]);
  const [round, setRound] = useState(1);
  const [winners, setWinners] = useState<Array<number>>([]);

  const [finished, setFinished] = useState(false);
  const [activePlayer, setActivePlayer] = useState(0);
  const didMountRef = useRef(false);
  const scoreBoardRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get("screen").width;

  // ================================================================================================

  useEffect(() => {
    getWinner();
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
    let filledUpRoundHistory: number[] = [...roundHistory];
    // Add Misses
    if (filledUpRoundHistory.length < 3) {
      for (let i = filledUpRoundHistory.length; i < 3; i++) {
        filledUpRoundHistory.push(0);
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
    if (round === 7 && isLastPlayer) {
      setFinished(true);
    }
  };

  const countThrow = (points: number) => {
    const playerRoundHistory = gameHistory[activePlayer].rounds;

    if (roundHistory.length < 3) {
      // Removes the current Round from Players Game-History
      const copyPlayerGameHistory = [...playerRoundHistory];
      if (roundHistory.length > 0) {
        copyPlayerGameHistory.pop();
      }

      // Update new Round-History with current throw
      const newRoundHistory = [...roundHistory, points];

      // Add Updated Round-History to Player Game-History
      copyPlayerGameHistory.push(newRoundHistory);

      // Add Updated Player Game History to overall History
      const newGameHistory = [...gameHistory];

      newGameHistory[activePlayer].rounds = copyPlayerGameHistory;

      // Update State
      const newScores = [...scores];
      newScores.splice(activePlayer, 1, scores[activePlayer] + points);

      setScores(newScores);
      setGameHistory(newGameHistory);
      setRoundHistory(newRoundHistory);
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

    if (
      // Dart thrown previous round
      gameHistory[prevPlayer].rounds.length > 0 ||
      // or this round
      gameHistory[activePlayer].rounds.length > 0
    ) {
      let newRound = round;
      let newRoundHistory = [...roundHistory];
      let updatedGameHistory = [...gameHistory];
      let removeValue = 0;

      // IF: darts thrown this round
      if (roundHistory.length > 0) {
        // Value to add to game score
        removeValue = roundHistory[roundHistory.length - 1];

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
        newRound = firstPlayer ? (newRound - 1 >= 1 ? newRound - 1 : 1) : round;

        removeValue = gameHistory[removePlayer].rounds[newRound - 1][2];
        newRoundHistory = [...gameHistory[removePlayer].rounds[newRound - 1]];

        newRoundHistory.pop();

        if (newRoundHistory.length > 0) {
          updatedGameHistory[removePlayer].rounds.pop();
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
      newScores.splice(removePlayer, 1, newScores[removePlayer] - removeValue);

      // Update State
      setActivePlayer(removePlayer);
      setRound(newRound <= 1 ? 1 : newRound);
      setScores(newScores);
      setRoundHistory(newRoundHistory);
      setGameHistory(updatedGameHistory);
      setFinished(false);
    }
  };

  const saveStats = () => {
    if (didMountRef.current) {
      const mode = "cricketCountUp";
      const cricketCountUpStats = selectedPlayers.map((sp, index) => ({
        gameMode: mode as "cricketCountUp",
        playerId: sp.id,
        stats: {
          score: scores[index],
          rounds: gameHistory[index].rounds.map(round =>
            round.reduce((acc, val) => acc + val)
          ),
          winner: winners.includes(index)
        }
      }));
      updateStats(cricketCountUpStats);
    }
  };

  return (
    <Container>
      <Scoreboard
        flexVal={0.3}
        headline="Cricket - 28"
        goHome={() => goHome(navigation)}
      >
        <ScrollView
          horizontal
          ref={scoreBoardRef}
          style={{ flexDirection: "row" }}
        >
          {selectedPlayers &&
            selectedPlayers.length > 0 &&
            selectedPlayers.map((sp: Player, index) => (
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
                <View style={styles.playerNameWrapper}>
                  <Text style={styles.playerName}>{sp.name}</Text>
                </View>
                <View style={styles.scoreWrapper}>
                  <AnimatedNumber
                    style={styles.scoreText}
                    value={scores[index]}
                  />
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
                roundHistory[0] === 0 ? (
                  "Miss"
                ) : (
                  `${getLabel(roundHistory[0] * -1)}${goals[round - 1]}`
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
                roundHistory[1] === 0 ? (
                  "Miss"
                ) : (
                  `${getLabel(roundHistory[1] * -1)}${goals[round - 1]}`
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
                roundHistory[2] === 0 ? (
                  "Miss"
                ) : (
                  `${getLabel(roundHistory[2] * -1)}${goals[round - 1]}`
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
              onPress={() => countThrow(3)}
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
            onPress={() => countThrow(2)}
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
            onPress={() => countThrow(1)}
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
        restart={() => {
          saveStats();
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "CricketCountUp"
              })
            ]
          });

          navigation.dispatch(resetAction);
        }}
        undo={removeScore}
        finished={finished}
      >
        <View style={styles.resultWrapper}>
          {selectedPlayers.length > 1 && winners.length > 0 && (
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
          {selectedPlayers.map((sp: Player, index: number) => (
            <View key={`result-${sp.id}`} style={{ marginTop: 10 }}>
              <Text style={styles.resultTextBold}>{`${sp.name} `}</Text>
              <Text style={styles.resultText}>{`Score: ${
                scores[index]
              } (MPR: ${(scores[index] / 7).toFixed(1)}).`}</Text>
            </View>
          ))}
        </View>
      </FinishedModal>
    </Container>
  );
};

CricketCountUp.navigationOptions = {
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
  mprText: {
    color: theme.neutrals.text,
    fontSize: 14
  },
  dartsDisplay: {
    alignItems: "center",
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    minHeight: 15,
    marginTop: 2
  },
  dartsDisplayDart: {
    alignItems: "center",
    justifyContent: "center",
    color: theme.neutrals.text,
    flex: 0.33
  },
  dartText: {
    color: theme.neutrals.text,
    fontSize: 20
  },
  mprWrapper: {
    flex: 0.2,
    justifyContent: "center",
    marginBottom: 5
  },
  playerName: {
    color: theme.neutrals.text
  },
  playerNameWrapper: {
    marginTop: 5
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
  resultWrapper: {
    flexDirection: "column",
    padding: 10
  },
  resultText: {
    fontSize: 20
  },
  resultTextBold: {
    fontWeight: "bold",
    fontSize: 20
  },
  boldResultText: {
    fontWeight: "bold",
    fontSize: 20
  },
  subHeader: {
    alignItems: "center",
    marginBottom: 20
  },
  subHeaderText: {
    fontWeight: "bold",
    fontSize: 24
  }
});

export default CricketCountUp;

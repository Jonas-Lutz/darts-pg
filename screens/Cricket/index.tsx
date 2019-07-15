import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableHighlight,
  Image,
  View,
  Dimensions
} from "react-native";
import {
  NavigationScreenComponent,
  NavigationScreenProps,
  StackActions,
  NavigationActions
} from "react-navigation";
import { ScreenOrientation } from "expo";

// Atoms:
import Headline from "atoms/Headline";

// Colors:
import theme from "theme";

// Components:
import Container from "components/Container";
import FinishedModal from "components/FinishedModal";
import Scoreboard from "components/Scoreboard";

// Types:
import NoIdDart from "interfaces/noIdDart";
import Player from "interfaces/player";

// Utils
import goHome from "utils/goHome";
import { getLabel } from "utils/getLabel";

// ================================================================================================
// Interfaces:
interface CricketField {
  field: 20 | 19 | 18 | 17 | 16 | 15 | 25;
  isOpen: boolean;
}

interface CricketScore {
  goal: 20 | 19 | 18 | 17 | 16 | 15 | 25;
  hits: number;
}

interface PlayerRound {
  playerId: string;
  hits: CricketScore[];
  score: number;
  rounds: NoIdDart[][];
}

// Props:
export interface Props extends NavigationScreenProps {
  selectedPlayers: Player[];
}

// ================================================================================================

const Cricket: NavigationScreenComponent<Props> = ({ navigation }) => {
  const selectedPlayers = navigation.getParam("selectedPlayers");

  // ================================================================================================
  // State
  const [activePlayer, setActivePlayer] = useState<number>(0);
  const [gameHistory, setGameHistory] = useState<Array<PlayerRound>>(
    selectedPlayers.map(sp => ({
      hits: [
        { goal: 20, hits: 0 },
        { goal: 19, hits: 0 },
        { goal: 18, hits: 0 },
        { goal: 17, hits: 0 },
        { goal: 16, hits: 0 },
        { goal: 15, hits: 0 },
        { goal: 25, hits: 0 }
      ],
      playerId: sp.id,
      rounds: [],
      score: 0
    }))
  );
  const [goals, setGoals] = useState<Array<CricketField>>([
    { field: 20, isOpen: true },
    { field: 19, isOpen: true },
    { field: 18, isOpen: true },
    { field: 17, isOpen: true },
    { field: 16, isOpen: true },
    { field: 15, isOpen: true },
    { field: 25, isOpen: true }
  ]);
  const [closedNumbers, setClosedNumbers] = useState<Array<number>>([]);
  const [round, setRound] = useState(1);
  const scoreBoardRef = useRef<ScrollView>(null);
  const [playerRowHeight, setPlayerRowHeight] = useState<number>(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState("klo");
  const [wrapperHeight, setWrapperHeight] = useState(
    Dimensions.get("window").height / 2
  );

  // ================================================================================================

  useEffect(() => {
    console.log(
      "================================================================================================"
    );
    console.log("GameHistory: ");
    console.log(gameHistory);
  }, [gameHistory]);

  useEffect(() => {
    ScreenOrientation.unlockAsync().then(() => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      ).then(() => {
        ScreenOrientation.getOrientationAsync().then(val =>
          setHeader(val.orientation)
        );
        setWrapperHeight(Dimensions.get("window").width / 2);
        setLoading(false);
      });
    });
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  // Effect - Update Displayed Players
  useEffect(() => {
    if (selectedPlayers.length > 3 && scoreBoardRef.current) {
      const offset = activePlayer * playerRowHeight;
      scoreBoardRef.current.scrollTo({
        y: offset,
        animated: true
      });
    }
  }, [activePlayer, playerRowHeight]);

  // ================================================================================================

  const getScoreIcon = (hits: number) => {
    switch (hits) {
      case 0:
        break;
      case 1:
        return (
          <Image
            source={require("../../assets/cricketOne.png")}
            style={{ width: 20, height: 20 }}
          />
        );
      case 2:
        return (
          <Image
            source={require("../../assets/cricketTwo.png")}
            style={{ width: 20, height: 20 }}
          />
        );
      case 3:
        return (
          <Image
            source={require("../../assets/cricketThree.png")}
            style={{ width: 20, height: 20 }}
          />
        );
      default:
        return (
          <Image
            source={require("../../assets/cricketThree.png")}
            style={{ width: 20, height: 20 }}
          />
        );
    }
  };

  // Handler for ScoreBtns
  const addScore = (thrwnDrt: NoIdDart) => {
    // Geworfene Zahl offen:
    const goalIndex = goals.findIndex(g => g.field === thrwnDrt.points);
    let isOpen = false;
    if (goalIndex >= 0) {
      isOpen = goals[goalIndex].isOpen;
    }
    // playerRoundHistory: [[dart, dart, dart], [dart, dart, dart], [dart, dart, dart]]
    const playerRoundHistory = gameHistory[activePlayer].rounds;
    if (
      playerRoundHistory.length === 0 ||
      !playerRoundHistory[round - 1] ||
      (playerRoundHistory[round - 1] &&
        playerRoundHistory[round - 1].length < 3)
    ) {
      // Update new Player-Round-History with current throw
      const copyPlayerRoundHistory =
        playerRoundHistory.length > 0 && playerRoundHistory[round - 1]
          ? [...playerRoundHistory[round - 1]]
          : [];
      copyPlayerRoundHistory.push(thrwnDrt);

      // Add Updated Round-History to Player-Game-History
      const newGameHistory = [...gameHistory];

      // Remove old round and push new
      newGameHistory[activePlayer].rounds.splice(
        round - 1,
        1,
        copyPlayerRoundHistory
      );

      // Kein Miss -> Score handlen
      if (isOpen && thrwnDrt.multiplier > 0) {
        const hitIndex = newGameHistory[activePlayer].hits.findIndex(
          hit => hit.goal === thrwnDrt.points
        );

        const prevHits = newGameHistory[activePlayer].hits[hitIndex].hits;

        newGameHistory[activePlayer].hits[hitIndex].hits += thrwnDrt.multiplier;

        const addAmount =
          prevHits > 2
            ? thrwnDrt.multiplier
            : thrwnDrt.multiplier - 3 + prevHits;

        // Add Scores to Players
        if (addAmount > 0) {
          newGameHistory.forEach((playerHistory, index) => {
            if (
              index !== activePlayer &&
              playerHistory.hits[hitIndex].hits < 3
            ) {
              newGameHistory[index].score += thrwnDrt.points * addAmount;
            }
          });
        }
        let shouldClose = true;
        newGameHistory.forEach(pH => {
          if (shouldClose && pH.hits[hitIndex].hits < 3) {
            shouldClose = false;
          }
        });
        if (shouldClose && !closedNumbers.includes(thrwnDrt.points)) {
          const copyGoals = [...goals];
          copyGoals[goalIndex] = { ...copyGoals[goalIndex], isOpen: false };
          setGoals(copyGoals);
          setClosedNumbers([...closedNumbers, thrwnDrt.points]);
        }
      }

      // Update State
      setGameHistory(newGameHistory);

      checkWin();
    }
  };

  // Advance Round, fill up with misses if neccessary
  const advanceRound = () => {
    const copyGH = [...gameHistory]; // Komplette Game History
    const roundCopy = [...copyGH[activePlayer].rounds]; // GameHistory des aktiven Spielers // [[dart, dart, dart], [dart, ...]]
    // Ausgangswert: []

    const playerRound =
      roundCopy.length > round - 1 ? [...roundCopy[round - 1]] : [];

    if (playerRound.length < 3) {
      for (let i = playerRound.length; i < 3; i++) {
        playerRound.push({ multiplier: 0, points: 0 });
      }
      if (roundCopy.length === round) {
        roundCopy.splice(roundCopy.length - 1, 1, playerRound);
      } else {
        roundCopy.push(playerRound);
      }
      copyGH[activePlayer].rounds = roundCopy;
      setGameHistory(copyGH);
    }

    const isLastPlayer = activePlayer === selectedPlayers.length - 1;
    setActivePlayer(isLastPlayer ? 0 : activePlayer + 1);
    if (isLastPlayer) {
      setRound(round + 1);
    }
  };

  // Check if someone has won
  const checkWin = () => {
    let minimum = gameHistory[0].score;
    gameHistory.forEach(pH => {
      if (pH.score < minimum) {
        minimum = pH.score;
      }
    });

    gameHistory.forEach(pH => {
      const isSmallest = pH.score === minimum;
      const openFields = pH.hits.filter(hitScore => hitScore.hits < 3);

      if (isSmallest && openFields.length < 1) {
        setFinished(true);
      }
    });
  };

  // Remove last thrown dart
  const removeScore = () => {
    let removePlayer = activePlayer;
    // Darts thrown by active Player in this round:
    const aPHasThrown =
      gameHistory[activePlayer].rounds.length > 0 &&
      gameHistory[activePlayer].rounds[round - 1] &&
      gameHistory[activePlayer].rounds[round - 1].length > 0;
    // Check if remove dart from active player or previous Player
    if (!aPHasThrown) {
      removePlayer =
        activePlayer > 0 ? activePlayer - 1 : selectedPlayers.length - 1;
    }
    // start actual process
    const newGameHistory = [...gameHistory];
    const newPlayerHits = newGameHistory[removePlayer].hits;
    const removePlayerHistory = [...gameHistory[removePlayer].rounds];
    const lastItemIndex = removePlayerHistory.length - 1;
    const updatedRound = [...removePlayerHistory[lastItemIndex]];
    const removedDart = updatedRound[updatedRound.length - 1];
    const hitIndex = newPlayerHits.findIndex(
      h => h.goal === removedDart.points
    );

    // Remove Dart from Player History

    updatedRound.pop();
    if (updatedRound.length > 0) {
      removePlayerHistory.splice(lastItemIndex, 1, updatedRound);
    } else {
      removePlayerHistory.pop();
    }

    // Check if player closed fields should be updated
    const playerHits = gameHistory[removePlayer].hits.find(
      hit => hit.goal === removedDart.points
    );
    let newHits = 0;
    if (playerHits && playerHits.hits > 0) {
      newHits = playerHits.hits - removedDart.multiplier;
    }

    // Check if overall closed fields should be updated
    if (newHits < 3) {
      setClosedNumbers(closedNumbers.filter(cN => cN !== removedDart.points));
    }
    // Check if scores should be updated
    if (playerHits && playerHits.hits > 2) {
      if (playerHits.hits > 2) {
        const removeValue =
          newHits < 3
            ? removedDart.points * (playerHits.hits - 3)
            : removedDart.points * (playerHits.hits - newHits);
        newGameHistory.forEach((playerHistory, index) => {
          if (index !== removePlayer && playerHistory.hits[hitIndex].hits < 3) {
            newGameHistory[index].score -= removeValue;
          }
        });
      }
    }

    // Update State:
    if (hitIndex > -1) {
      newPlayerHits[hitIndex].hits = newHits;
    }
    newGameHistory[removePlayer].hits = newPlayerHits;
    newGameHistory[removePlayer].rounds = removePlayerHistory;

    if (activePlayer === 0 && removePlayer !== activePlayer && round != 1) {
      setRound(round - 1);
    }
    setGameHistory(newGameHistory);
    setActivePlayer(removePlayer);
    setFinished(false);
  };

  // ================================================================================================

  if (loading) {
    return <View />;
  }

  return (
    <Container noStatusbar>
      <View style={{ height: wrapperHeight * 2, width: "100%" }}>
        <View style={{ height: wrapperHeight, width: "100%" }}>
          <Scoreboard
            landscape
            flexVal={1}
            headline={"Cut-Throat Cricket"}
            goHome={() => {
              ScreenOrientation.unlockAsync().then(() => goHome(navigation));
            }}
          >
            <ScrollView ref={scoreBoardRef} style={{ flex: 0.8 }}>
              {gameHistory.map((pH, index) => {
                const isActive = activePlayer === index;
                const twentyHits = pH.hits.find(cs => cs.goal === 20);
                const nineteenHits = pH.hits.find(cs => cs.goal === 19);
                const eighteenHits = pH.hits.find(cs => cs.goal === 18);
                const seventeenHits = pH.hits.find(cs => cs.goal === 17);
                const sixteenHits = pH.hits.find(cs => cs.goal === 16);
                const fifteenhits = pH.hits.find(cs => cs.goal === 15);
                const bullHits = pH.hits.find(cs => cs.goal === 25);
                return (
                  <View
                    key={pH.playerId}
                    onLayout={layout => {
                      setPlayerRowHeight(layout.nativeEvent.layout.height);
                    }}
                    style={isActive ? styles.playerRowActive : styles.playerRow}
                  >
                    <View style={styles.nameColumn}>
                      <Text style={styles.playerNameText}>
                        {selectedPlayers[index].name.length > 9
                          ? `${selectedPlayers[index].name[0]}-Dawg`
                          : selectedPlayers[index].name}
                      </Text>
                    </View>
                    <View style={styles.fieldColumn}>
                      {twentyHits ? getScoreIcon(twentyHits.hits) : null}
                    </View>
                    <View style={styles.fieldColumn}>
                      {nineteenHits ? getScoreIcon(nineteenHits.hits) : null}
                    </View>
                    <View style={styles.fieldColumn}>
                      {eighteenHits ? getScoreIcon(eighteenHits.hits) : null}
                    </View>
                    <View style={styles.fieldColumn}>
                      {seventeenHits ? getScoreIcon(seventeenHits.hits) : null}
                    </View>
                    <View style={styles.fieldColumn}>
                      {sixteenHits ? getScoreIcon(sixteenHits.hits) : null}
                    </View>
                    <View style={styles.fieldColumn}>
                      {fifteenhits ? getScoreIcon(fifteenhits.hits) : null}
                    </View>
                    <View style={styles.fieldColumn}>
                      {bullHits ? getScoreIcon(bullHits.hits) : null}
                    </View>
                    <View style={styles.scoreColumn}>
                      <Text style={styles.scoreColumnText}>{`${
                        pH.score
                      }`}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
            <View style={styles.roundHistory}>
              {gameHistory[activePlayer].rounds.length > 0 &&
              gameHistory[activePlayer].rounds[round - 1] &&
              gameHistory[activePlayer].rounds[round - 1].length > 0 ? (
                <Text>{`${getLabel(
                  gameHistory[activePlayer].rounds[round - 1][0].multiplier
                )}${
                  gameHistory[activePlayer].rounds[round - 1][0].points
                }`}</Text>
              ) : (
                <Image
                  source={require("../../assets/arrow.png")}
                  style={{ width: 20, height: 20 }}
                />
              )}

              {gameHistory[activePlayer].rounds.length > 0 &&
              gameHistory[activePlayer].rounds[round - 1] &&
              gameHistory[activePlayer].rounds[round - 1].length > 1 ? (
                <Text>{`${getLabel(
                  gameHistory[activePlayer].rounds[round - 1][1].multiplier
                )}${
                  gameHistory[activePlayer].rounds[round - 1][1].points
                }`}</Text>
              ) : (
                <Image
                  source={require("../../assets/arrow.png")}
                  style={{ width: 20, height: 20 }}
                />
              )}
              {gameHistory[activePlayer].rounds.length > 0 &&
              gameHistory[activePlayer].rounds[round - 1] &&
              gameHistory[activePlayer].rounds[round - 1].length > 2 ? (
                <Text>{`${getLabel(
                  gameHistory[activePlayer].rounds[round - 1][2].multiplier
                )}${
                  gameHistory[activePlayer].rounds[round - 1][2].points
                }`}</Text>
              ) : (
                <Image
                  source={require("../../assets/arrow.png")}
                  style={{ width: 20, height: 20 }}
                />
              )}
            </View>
          </Scoreboard>
        </View>
        <View style={{ height: wrapperHeight, width: "100%" }}>
          <View style={styles.inputArea}>
            <View style={styles.navBtnRow}>
              <TouchableHighlight
                disabled={gameHistory[0].rounds.length < 1}
                onPress={removeScore}
                style={styles.backBtn}
              >
                <Text
                  style={
                    gameHistory[0].rounds.length < 1
                      ? styles.backBtnTextDisabled
                      : styles.backBtnText
                  }
                >
                  Remove
                </Text>
              </TouchableHighlight>
            </View>
            {goals.map(g => {
              const isClosed = closedNumbers.includes(g.field);
              if (g.field !== 25) {
                return (
                  <View key={g.field} style={styles.fieldColumn}>
                    <TouchableHighlight
                      onPress={() =>
                        addScore({ points: g.field, multiplier: 3 })
                      }
                      style={styles.scoreBtn}
                    >
                      <Text
                        style={
                          isClosed
                            ? styles.scoreBtnTextClosed
                            : styles.scoreBtnText
                        }
                      >{`T${g.field}`}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      onPress={() =>
                        addScore({ points: g.field, multiplier: 2 })
                      }
                      style={styles.scoreBtn}
                    >
                      <Text
                        style={
                          isClosed
                            ? styles.scoreBtnTextClosed
                            : styles.scoreBtnText
                        }
                      >{`D${g.field}`}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      onPress={() =>
                        addScore({ points: g.field, multiplier: 1 })
                      }
                      style={styles.scoreBtn}
                    >
                      <Text
                        style={
                          isClosed
                            ? styles.scoreBtnTextClosed
                            : styles.scoreBtnText
                        }
                      >{`${g.field}`}</Text>
                    </TouchableHighlight>
                  </View>
                );
              } else {
                return (
                  <View key={g.field} style={styles.fieldColumn}>
                    <TouchableHighlight
                      onPress={() => addScore({ points: 0, multiplier: 0 })}
                      style={styles.scoreBtn}
                    >
                      <Text style={styles.scoreBtnText}>Miss</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      onPress={() => addScore({ points: 25, multiplier: 2 })}
                      style={styles.scoreBtn}
                    >
                      <Text
                        style={
                          isClosed
                            ? styles.scoreBtnTextClosed
                            : styles.scoreBtnText
                        }
                      >
                        D25
                      </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      onPress={() => addScore({ points: 25, multiplier: 1 })}
                      style={styles.scoreBtn}
                    >
                      <Text
                        style={
                          isClosed
                            ? styles.scoreBtnTextClosed
                            : styles.scoreBtnText
                        }
                      >
                        25
                      </Text>
                    </TouchableHighlight>
                  </View>
                );
              }
            })}

            <View style={styles.scoreColumn}>
              <TouchableHighlight onPress={advanceRound} style={styles.nextBtn}>
                <Text style={styles.nextBtnText}>Next</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <FinishedModal
          goHome={() => {
            goHome(navigation);
          }}
          landscape
          restart={() => {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: "Cricket",
                  params: {
                    selectedPlayers
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
            <Text>{`${selectedPlayers[activePlayer].name} has won.`}</Text>
          </View>
          <View style={styles.resultWrapper}>
            {gameHistory.map((p, index) => {
              let totalhits = 0;
              p.hits.forEach(p => (totalhits += p.hits));
              return (
                <View key={`result-${p.playerId}`} style={{ margin: 10 }}>
                  <Text style={styles.resultTextBold}>{`${
                    selectedPlayers[index].name
                  } `}</Text>
                  <Text style={styles.resultText}>{`Score: ${p.score} (MPR: ${(
                    totalhits / p.rounds.length
                  ).toFixed(1)}).`}</Text>
                </View>
              );
            })}
          </View>
        </FinishedModal>
      </View>
    </Container>
  );
};

// ================================================================================================

Cricket.navigationOptions = {
  header: null
};

// ================================================================================================

const styles = StyleSheet.create({
  headerContent: {
    justifyContent: "center",
    flex: 0.2
  },
  homeContent: {
    justifyContent: "center",
    flex: 0.8,
    width: "100%"
  },
  inputArea: {
    flexDirection: "row",
    flex: 1,
    flexShrink: 0
  },
  scoreBoardContent: {
    flex: 1,
    flexDirection: "column"
  },
  playerRow: {
    borderColor: theme.neutrals.third,
    borderRightWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    height: (Dimensions.get("window").width / 100) * 11.25
  },
  playerRowActive: {
    backgroundColor: theme.primaries.yellows.ninth,
    borderColor: theme.neutrals.third,
    borderRightWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    height: (Dimensions.get("window").width / 100) * 11.25
  },
  navBtnRow: {
    borderColor: theme.neutrals.third,
    borderRightWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    width: "15%"
  },
  nameColumn: {
    justifyContent: "center",
    width: "15%",
    borderColor: theme.neutrals.third,
    borderRightWidth: 1
  },
  playerNameText: {
    color: theme.neutrals.text,
    fontSize: 18
  },
  fieldColumn: {
    alignItems: "center",
    borderColor: theme.neutrals.third,
    borderRightWidth: 1,
    justifyContent: "center",
    width: "10%"
  },
  scoreColumn: {
    alignItems: "center",
    justifyContent: "center",
    width: "15%"
  },
  scoreColumnText: {
    color: theme.neutrals.text,
    fontSize: 18
  },
  nextBtn: {
    alignItems: "center",
    backgroundColor: theme.primaries.lightBlues.third,
    justifyContent: "center",
    flex: 1,
    width: "100%"
  },
  nextBtnText: {
    color: theme.neutrals.tenth,
    fontSize: 18
  },
  backBtn: {
    alignItems: "center",
    backgroundColor: theme.neutrals.ninth,
    justifyContent: "center",
    flex: 1,
    width: "100%"
  },
  backBtnText: {
    color: theme.neutrals.text,
    fontSize: 18
  },
  backBtnTextDisabled: {
    color: theme.neutrals.seventh,
    fontSize: 18
  },
  scoreBtn: {
    alignItems: "center",
    borderColor: theme.neutrals.third,
    borderBottomWidth: 1,
    justifyContent: "center",
    flex: 1,
    width: "100%"
  },
  scoreBtnText: {
    color: theme.neutrals.text,
    fontSize: 18
  },
  scoreBtnTextClosed: {
    color: theme.neutrals.seventh,
    fontSize: 18
  },
  roundHistory: {
    alignItems: "center",
    flex: 0.2,
    borderColor: theme.neutrals.text,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: theme.primaries.yellows.eighth,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    flexShrink: 0
  },
  gameBtn: {
    alignItems: "center",
    justifyContent: "center",
    flex: 0.2,
    width: "100%"
  },
  gameBtnBorder: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: theme.neutrals.seventh,
    borderBottomWidth: 1,
    flex: 0.2,
    width: "100%"
  },
  gameBtnText: {
    color: theme.primaries.lightBlues.first,
    fontSize: 22
  },
  resultWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10
  },
  subHeader: {
    alignItems: "center",
    marginBottom: 20
  },
  resultText: {
    fontSize: 20
  },
  resultTextBold: {
    fontWeight: "bold",
    fontSize: 20
  },

  subHeaderText: {
    fontWeight: "bold",
    fontSize: 24
  }
});

export default Cricket;

/*


  



*/

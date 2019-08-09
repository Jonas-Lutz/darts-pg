import React, { useState, useEffect } from "react";
import { StyleSheet, Text, Image, ScrollView, View } from "react-native";
import {
  StackActions,
  NavigationActions,
  NavigationScreenComponent,
  NavigationParams,
  NavigationScreenProps
} from "react-navigation";

// Atoms:
import Headline from "atoms/Headline";

// Colors:
import theme from "theme";

// Components:
import Container from "components/Container";
import PulsatingText from "components/PulsatingText";
import Scoreboard from "components/Scoreboard";

// Utils:
import goHome from "utils/goHome";
import loadPlayers from "utils/loadPlayers";

// ================================================================================================
// Types:
import Player from "interfaces/player";
import { TouchableHighlight } from "react-native-gesture-handler";

// Props:
export interface Props extends NavigationScreenProps {
  followUp: string;
  headline: string;
  multi: boolean;
  showTimeFilter?: boolean;
}

// ================================================================================================

const PlayerSelection: NavigationScreenComponent<Props> = ({ navigation }) => {
  const followUp = navigation.getParam("followUp");
  const headline = navigation.getParam("headline", "Headline");
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [timeFrame, setTimeFrame] = useState("allTime");
  const showTimeFilter = navigation.getParam("showTimeFilter", false);
  const multi = navigation.getParam("multi");

  useEffect(() => {
    loadPlayers({ setLoading, setPlayers });
  }, []);

  // ================================================================================================

  const addPlayer = (player: Player) => {
    const newPlayers = [...selectedPlayers];
    newPlayers.push(player);
    setSelectedPlayers(newPlayers);
  };

  const removePlayer = (p: Player) => {
    const newPlayers = [...selectedPlayers].filter(np => np.id !== p.id);
    setSelectedPlayers(newPlayers);
  };

  // ================================================================================================

  return (
    <Container>
      <Scoreboard
        headline={headline}
        flexVal={0.3}
        goHome={() => goHome(navigation)}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("../../assets/arrow.png")}
            style={{ width: 50, height: 50, marginRight: 25 }}
          />
          <View style={{ alignItems: "center" }}>
            <Headline>
              {showTimeFilter ? "Stats Settings" : "Select Players"}
            </Headline>
            {showTimeFilter && (
              <Text style={{ color: theme.neutrals.text }}>
                Plese select 1 - 3 Players.
              </Text>
            )}
          </View>
          <View style={{ width: 75 }} />
        </View>
      </Scoreboard>
      <ScrollView style={styles.playerList}>
        {loading ? (
          <View style={styles.playerList}>
            <Text>Loading players...</Text>
          </View>
        ) : (
          players.map((p: Player, index: number) => {
            const selected = selectedPlayers.find(sP => sP.id === p.id);
            return (
              <TouchableHighlight
                key={`${p.id}-${index}`}
                onPress={() => {
                  if (!multi && selectedPlayers.length > 0) {
                    if (selected) {
                      setSelectedPlayers([]);
                    } else {
                      setSelectedPlayers([p]);
                    }
                  } else {
                    if (selected) {
                      removePlayer(p);
                    } else {
                      addPlayer(p);
                    }
                  }
                }}
                underlayColor={theme.primaries.lightBlues.tenth}
                style={
                  selected ? styles.playerButtonSelected : styles.playerButton
                }
              >
                <Text style={styles.playerButtonText}>{`${p.name} ${
                  selected
                    ? `(${selectedPlayers.findIndex(s => s.id === p.id) + 1})`
                    : ""
                }`}</Text>
              </TouchableHighlight>
            );
          })
        )}
      </ScrollView>
      {showTimeFilter ? (
        <View style={{ flex: 0.2, width: "100%" }}>
          {/* <View
            style={{
              backgroundColor: theme.neutrals.ninth,
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-between",
              width: "100%"
            }}
          >
            <View style={{ justifyContent: "center", width: "33%" }}>
              <TouchableHighlight
                onPress={() => setTimeFrame("24h")}
                style={styles.timeButton}
              >
                <Text style={styles.timeButtonText}>24h</Text>
              </TouchableHighlight>
            </View>
            <View style={{ justifyContent: "center", width: "33%" }}>
              <TouchableHighlight
                onPress={() => setTimeFrame("Week")}
                style={styles.timeButton}
              >
                <Text style={styles.timeButtonText}>Week</Text>
              </TouchableHighlight>
            </View>
            <View style={{ justifyContent: "center", width: "33%" }}>
              <TouchableHighlight
                onPress={() => setTimeFrame("allTime")}
                style={styles.timeButton}
              >
                <Text style={styles.timeButtonText}>All Time</Text>
              </TouchableHighlight>
            </View>
          </View> */}
          <View
            style={
              selectedPlayers.length < 1
                ? styles.applyBtnDisabled
                : styles.applyBtn
            }
          >
            <TouchableHighlight
              disabled={selectedPlayers.length < 1}
              onPress={() => {
                const resetAction = StackActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({
                      routeName: "Stats",
                      params: {
                        selectedPlayers,
                        timeFrame
                      }
                    })
                  ]
                });

                navigation.dispatch(resetAction);
              }}
              style={styles.timeButton}
            >
              <Text style={{ color: theme.neutrals.tenth, fontSize: 22 }}>
                Apply
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      ) : (
        <View
          style={
            selectedPlayers.length > 0
              ? styles.gameBtnWrapper
              : styles.gameBtnWrapperDisabled
          }
        >
          <TouchableHighlight
            disabled={selectedPlayers.length <= 0}
            onPress={() => {
              navigation.navigate(followUp, { selectedPlayers });
            }}
            style={styles.gameBtn}
            underlayColor={theme.primaries.lightBlues.second}
          >
            <PulsatingText
              runAnimation={selectedPlayers.length > 0}
              text="Game on"
              styles={styles.gameBtnText}
            />
          </TouchableHighlight>
        </View>
      )}
    </Container>
  );
};

// ================================================================================================

PlayerSelection.navigationOptions = {
  header: null
};

// ================================================================================================

const styles = StyleSheet.create({
  gameBtnWrapper: {
    flex: 0.2,
    width: "100%",
    backgroundColor: theme.primaries.lightBlues.third
  },
  gameBtnWrapperDisabled: {
    flex: 0.2,
    width: "100%",
    backgroundColor: theme.neutrals.eighth
  },
  gameBtn: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%"
  },
  gameBtnText: {
    color: theme.neutrals.tenth,
    fontSize: 24
  },
  playerButton: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: theme.neutrals.ninth,
    padding: 15,
    width: "100%"
  },
  playerButtonSelected: {
    alignItems: "center",
    backgroundColor: theme.primaries.lightBlues.ninth,
    borderBottomWidth: 1,
    borderColor: theme.neutrals.ninth,
    padding: 15,
    width: "100%"
  },
  playerButtonText: {
    color: theme.neutrals.text,
    fontSize: 20
  },
  playerList: {
    flexDirection: "column",
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    width: "90%"
  },
  timeButton: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%"
  },
  timeButtonText: {
    color: theme.neutrals.text,
    fontSize: 20
  },
  applyBtn: {
    backgroundColor: theme.primaries.lightBlues.fourth,
    flex: 1,
    justifyContent: "center",
    width: "100%"
  },
  applyBtnDisabled: {
    backgroundColor: theme.neutrals.eighth,
    flex: 1,
    justifyContent: "center",
    width: "100%"
  }
});

export default PlayerSelection;

import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  AsyncStorage,
  Text,
  Image,
  ScrollView,
  View,
  TouchableHighlight
} from "react-native";
import {
  NavigationScreenComponent,
  NavigationScreenProps
} from "react-navigation";

// Atoms:
import Headline from "atoms/Headline";

// Colors:
import theme from "theme";

// Components:
import Container from "components/Container";
import Scoreboard from "components/Scoreboard";

// Utils:
import goHome from "utils/goHome";
import loadPlayers from "utils/loadPlayers";

// ================================================================================================
// Interfaces:
import Player from "interfaces/player";
import StatsType from "interfaces/stats";

// Props:
export interface Props extends NavigationScreenProps {
  selectedPlayers?: Player[];
  timeFrame?: "24h" | "week" | "allTime";
}

// ================================================================================================

const Stats: NavigationScreenComponent<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<StatsType[]>([]);
  const [filteredStats, setFilteredStats] = useState<StatsType[]>([]);

  const [selectedPlayers, setSelectedPlayers] = useState(
    navigation.getParam("selectedPlayers", [])
  );
  const [timeFrame] = useState(navigation.getParam("timeFrame", "allTime"));

  const fields = [
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
    20,
    25
  ];
  const didMountRef = useRef(false);

  // ================================================================================================

  const getStats = async () => {
    const value = await AsyncStorage.getItem("stats");
    if (value) {
      setStats(JSON.parse(value));
    } else {
      console.log("No Stats found");
    }
  };

  // ================================================================================================

  useEffect(() => {
    console.log("SP: ", selectedPlayers);
    console.log("TF: ", timeFrame);
    loadPlayers({ setLoading, setPlayers });
    getStats();
  }, []);

  useEffect(() => {
    if (players.length > 1 && selectedPlayers.length < 1) {
      setSelectedPlayers([players[0]]);
    }
  }, [players, stats]);

  useEffect(() => {
    const selectedIds = selectedPlayers.map(sp => sp.id);
    const filteredStats = stats.filter(stat =>
      selectedIds.includes(stat.playerId)
    );
    setFilteredStats(filteredStats);
  }, [stats, selectedPlayers]);

  // ================================================================================================

  return (
    <Container>
      <Scoreboard flexVal={0.2} goHome={() => goHome(navigation)}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          <Image
            source={require("../../assets/stats.png")}
            style={{ width: 50, height: 50, marginLeft: 25 }}
          />
          <View style={{ alignItems: "center" }}>
            <Headline>Stats</Headline>
          </View>
          <TouchableHighlight
            onPress={() => {
              navigation.navigate("PlayerSelection", {
                followUp: "Stats",
                multi: true,
                showTimeFilter: true
              });
            }}
          >
            <Image
              source={require("../../assets/settings.png")}
              style={{ width: 35, height: 35, marginRight: 25 }}
            />
          </TouchableHighlight>
        </View>
      </Scoreboard>
      {selectedPlayers && selectedPlayers.length > 0 && (
        <>
          <View style={styles.namesWrapper}>
            <View style={styles.statLabel}>
              <Text>Player</Text>
            </View>
            <View style={styles.playerNumbers}>
              <Text>{selectedPlayers[0].name}</Text>
            </View>
            {selectedPlayers.length > 1 && (
              <View style={styles.playerNumbers}>
                <Text>{selectedPlayers[1].name}</Text>
              </View>
            )}
            {selectedPlayers.length > 2 && (
              <View style={styles.playerNumbers}>
                <Text>{selectedPlayers[2].name}</Text>
              </View>
            )}
          </View>
        </>
      )}
      <ScrollView
        contentContainerStyle={{
          alignItems: "center"
        }}
        style={styles.contentWrapper}
      >
        {loading && <Text>Loading ... </Text>}
        {!loading && (
          <>
            <View style={styles.gameHeader}>
              <Text style={styles.gameHeaderText}>Shanghai</Text>
            </View>
            <View style={styles.category}>
              <View style={styles.statLabel}>
                <Text>Highscore</Text>
              </View>
              {filteredStats.map((playerStats, index) => (
                <View key={playerStats.playerId} style={styles.playerNumbers}>
                  <View>
                    <Text>{`${playerStats.shanghai.highscore}`}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.gameHeader}>
              <Text style={styles.gameHeaderText}>Bob's 27</Text>
            </View>
            <View style={styles.category}>
              <View style={styles.statLabel}>
                <Text>Highscore</Text>
              </View>
              {filteredStats.map((playerStats, index) => (
                <View key={playerStats.playerId} style={styles.playerNumbers}>
                  <View>
                    <Text>{`${playerStats.bobs.highscore}`}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.gameHeader}>
              <Text style={styles.gameHeaderText}>Cricket Count Up</Text>
            </View>
            <View style={styles.category}>
              <View style={styles.statLabel}>
                <Text>Highscore</Text>
                <Text>MPR</Text>
              </View>
              {filteredStats.map((playerStats, index) => (
                <View key={playerStats.playerId} style={styles.playerNumbers}>
                  <View>
                    <Text>{`${playerStats.cricketCountUp.highscore}`}</Text>
                    <Text>{`${playerStats.cricketCountUp.avgMpr.toFixed(
                      2
                    )}`}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.gameHeader}>
              <Text style={styles.gameHeaderText}>Field Practice</Text>
            </View>
            {fields.map((field, index) => (
              <View key={field} style={styles.category}>
                <View style={styles.statLabel}>
                  <View style={{ marginBottom: 5, marginTop: 5 }}>
                    <Text>{`${field}`}</Text>
                  </View>
                  <Text>Highscore</Text>
                  <Text>PPR</Text>
                  <Text>Hit %</Text>
                  <Text>Triple %</Text>
                  <Text>Double %</Text>
                  <Text>Single %</Text>
                </View>
                {filteredStats.map(playerStats => {
                  const fieldStats = playerStats.nineNineX.fields.filter(
                    gameField => gameField.goal === field
                  );
                  return (
                    <View
                      key={playerStats.playerId}
                      style={styles.playerNumbers}
                    >
                      {fieldStats.length > 0 ? (
                        <View>
                          <Text />
                          <Text>{`${fieldStats[0].highscore}`}</Text>
                          <Text>{`${fieldStats[0].ppr.toFixed(2)}`}</Text>
                          <Text>{`${fieldStats[0].hitRate.toFixed(2)}`}</Text>
                          <Text>{`${fieldStats[0].tripleRate.toFixed(
                            2
                          )}`}</Text>
                          <Text>{`${fieldStats[0].doubleRate.toFixed(
                            2
                          )}`}</Text>
                          <Text>{`${fieldStats[0].singleRate.toFixed(
                            2
                          )}`}</Text>
                        </View>
                      ) : (
                        <View>
                          <Text />
                          <Text>{`-`}</Text>
                          <Text>{`-`}</Text>
                          <Text>{`-`}</Text>
                          <Text>{`-`}</Text>
                          <Text>{`-`}</Text>
                          <Text>{`-`}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </Container>
  );
};

// ================================================================================================

Stats.navigationOptions = {
  header: null
};

// ================================================================================================

const styles = StyleSheet.create({
  namesWrapper: {
    borderColor: theme.neutrals.text,
    borderBottomWidth: 1,
    flex: 0.05,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%"
  },
  contentWrapper: {
    flex: 0.75,
    width: "100%"
  },
  category: {
    flexDirection: "row",
    width: "100%"
  },
  gameHeader: {
    alignItems: "center",
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: theme.primaries.lightBlues.third,
    width: "100%"
  },
  gameHeaderText: {
    color: theme.neutrals.tenth,
    fontSize: 18
  },
  statLabel: {
    padding: 5,
    backgroundColor: theme.neutrals.ninth,
    width: "33%",
    justifyContent: "center"
  },
  playerNumbers: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  }
});

export default Stats;

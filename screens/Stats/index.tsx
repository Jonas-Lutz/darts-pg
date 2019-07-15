import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  AsyncStorage,
  Text,
  Image,
  SectionList,
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
import NoIdDart from "interfaces/noIdDart";
import Player from "interfaces/player";
import StatsType from "interfaces/stats";
import Bobs27 from "screens/Bobs";

interface ShanghaiStats {
  games: number;
  highscore: number;
  shanghaiFinishes: number;
  wins: number;
}

interface BobsStats {
  finishes: number;
  games: number;
  highscore: number;
  wins: number;
}

interface FieldPracticeStats {
  fields: [
    {
      goal: number;
      darts: NoIdDart[];
      tripleRate: number;
      doubleRate: number;
      singleRate: number;
      hitRate: number;
      ppr: number;
      highscore: number;
    }
  ];
}

interface CricketCountUpStats {
  avgMpr: number;
  darts: number[][];
  fourteenPlus: number;
  games: number;
  highscore: number;
  scores: number[];
  twentyonePlus: number;
  twentyeightPlus: number;
  wins: number;
}

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

  const [shanghaiStats, setShanghaiStats] = useState<ShanghaiStats[]>([]);
  const [bobsStats, setBobStats] = useState<BobsStats[]>([]);
  const [cricketCountUpStats, setCricketCountUpStats] = useState<
    CricketCountUpStats[]
  >([]);
  const [fieldPracticeStats, setFieldPracticeStats] = useState<
    FieldPracticeStats[]
  >([]);

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
      /*       console.log(JSON.parse(value));
       */
    } else {
      console.log("No Stats found");
    }
  };

  // ================================================================================================

  useEffect(() => {
    loadPlayers({ setLoading, setPlayers });
    getStats();
  }, []);

  useEffect(() => {
    if (players.length > 0 && selectedPlayers.length < 1) {
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

  useEffect(() => {
    if (filteredStats && filteredStats.length > 0) {
      const bobsCopy = [...bobsStats];
      const shanghaiCopy = [...shanghaiStats];
      const cricketCountUpCopy = [...cricketCountUpStats];
      const fieldPracticeCopy = [...fieldPracticeStats];
      filteredStats.map(fs => {
        bobsCopy.push(fs.bobs);
        shanghaiCopy.push(fs.shanghai);
        cricketCountUpCopy.push(fs.cricketCountUp);
        fieldPracticeCopy.push(fs.nineNineX);
      });
      setBobStats(bobsCopy);
      setShanghaiStats(shanghaiCopy);
      setCricketCountUpStats(cricketCountUpCopy);
      setFieldPracticeStats(fieldPracticeCopy);
    }
  }, [filteredStats]);

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
      {loading && (
        <View>
          <Text>Loading Stats...</Text>
        </View>
      )}
      {selectedPlayers && selectedPlayers.length > 0 && !loading && (
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
      <SectionList
        renderItem={({ item, index, section }) => {
          if (section.title === "Shanghai") {
            return (
              <View key={index} style={styles.category}>
                <View style={styles.statLabel}>
                  <Text>Games</Text>
                  <Text>Wins (PvP)</Text>
                  <Text>Highscore</Text>
                  <Text>Shanghais</Text>
                </View>
                {item.map((playerStats: ShanghaiStats, index: number) => (
                  <View
                    key={`shanghai-stats-${index}`}
                    style={styles.playerNumbers}
                  >
                    <Text>{`${playerStats.games}`}</Text>
                    <Text>{`${playerStats.wins}`}</Text>
                    <Text>{`${playerStats.highscore}`}</Text>
                    <Text>{`${playerStats.shanghaiFinishes}`}</Text>
                  </View>
                ))}
              </View>
            );
          } else if (section.title === "Bob's 27") {
            return (
              <View key={index} style={styles.category}>
                <View style={styles.statLabel}>
                  <Text>Games</Text>
                  <Text>Wins (PvP)</Text>
                  <Text>Highscore</Text>
                  <Text>Finishes</Text>
                </View>
                {item.map((playerStats: BobsStats, index: number) => (
                  <View
                    key={`bobs-stats-${index}`}
                    style={styles.playerNumbers}
                  >
                    <Text>{`${playerStats.games}`}</Text>
                    <Text>{`${playerStats.wins}`}</Text>
                    <Text>{`${playerStats.highscore}`}</Text>
                    <Text>{`${playerStats.finishes}`}</Text>
                  </View>
                ))}
              </View>
            );
          } else if (section.title === "Cricket Count Up") {
            return (
              <View style={styles.category}>
                <View style={styles.statLabel}>
                  <Text>Games</Text>
                  <Text>Wins (PvP)</Text>
                  <Text>Highscore</Text>
                  <Text>MPR</Text>
                  <Text>14+</Text>
                  <Text>21+</Text>
                  <Text>28+</Text>
                </View>
                {item.map((playerStats: CricketCountUpStats, index: number) => (
                  <View key={`28-stats-${index}`} style={styles.playerNumbers}>
                    <View>
                      <Text>{`${playerStats.games}`}</Text>
                      <Text>{`${playerStats.wins}`}</Text>
                      <Text>{`${playerStats.highscore}`}</Text>
                      <Text>{`${playerStats.avgMpr.toFixed(2)}`}</Text>
                      <Text>{`${playerStats.fourteenPlus}`}</Text>
                      <Text>{`${playerStats.twentyonePlus}`}</Text>
                      <Text>{`${playerStats.twentyeightPlus}`}</Text>
                    </View>
                  </View>
                ))}
              </View>
            );
          } else if (section.title === "Field Practice") {
            return (
              <>
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
                              <Text>{`${fieldStats[0].hitRate.toFixed(
                                2
                              )}`}</Text>
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
            );
          } else return <></>;
        }}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.gameHeader}>
            <Text style={styles.gameHeaderText}>{title}</Text>
          </View>
        )}
        sections={[
          { title: "Shanghai", data: [shanghaiStats] },
          { title: "Bob's 27", data: [bobsStats] },
          { title: "Cricket Count Up", data: [cricketCountUpStats] },
          { title: "Field Practice", data: [fieldPracticeStats] }
        ]}
        keyExtractor={(item, index) => item + index}
        style={styles.contentWrapper}
      />
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
    flex: 0.075,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%"
  },
  contentWrapper: {
    flex: 0.725,
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

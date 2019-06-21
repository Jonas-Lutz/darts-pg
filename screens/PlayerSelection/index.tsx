import React, { useState, useEffect } from "react";
import { StyleSheet, Text, Image, ScrollView, View } from "react-native";
import {
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
  multi: boolean;
}

// ================================================================================================

const PlayerSelection: NavigationScreenComponent<Props> = ({ navigation }) => {
  const followUp = navigation.getParam("followUp");
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
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
        headline={"Headline"}
        flexVal={0.3}
        goHome={() => goHome(navigation)}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("../../assets/arrow.png")}
            style={{ width: 50, height: 50, marginRight: 25 }}
          />
          <View style={{ alignItems: "center" }}>
            <Headline>Who's playing?</Headline>
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
                style={
                  selected ? styles.playerButtonSelected : styles.playerButton
                }
              >
                <Text style={styles.playerButtonText}>{p.name}</Text>
              </TouchableHighlight>
            );
          })
        )}
      </ScrollView>
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
        >
          <Text style={styles.gameBtnText}>Game on</Text>
        </TouchableHighlight>
      </View>
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
  }
});

export default PlayerSelection;

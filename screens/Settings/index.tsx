import React, { useEffect, useState, useRef } from "react";
import {
  AsyncStorage,
  StyleSheet,
  Text,
  TextInput,
  Image,
  ScrollView,
  View,
  Keyboard
} from "react-native";
import {
  NavigationScreenComponent,
  NavigationScreenProps
} from "react-navigation";
import uuidv4 from "uuid";

// Atoms:
import Headline from "atoms/Headline";

// Colors:
import theme from "theme";

// Components:
import Container from "components/Container";
import Profile from "components/Profile";
import Scoreboard from "components/Scoreboard";

// Utils
import goHome from "utils/goHome";
import loadPlayers from "utils/loadPlayers";
import savePlayers from "utils/savePlayers";
import initPlayerStats from "utils/initPlayerStats";
import deletePlayerStats from "utils/deletePlayerStats";

// ================================================================================================

// Props:
export interface Props extends NavigationScreenProps {}

// Types:
import Player from "interfaces/player";

// ================================================================================================

const Settings: NavigationScreenComponent<Props> = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<Array<Player>>([]);

  // ================================================================================================

  useEffect(() => {
    loadPlayers({ setLoading, setPlayers });
  }, []);

  // ================================================================================================

  const handleAddPlayer = () => {
    console.log("dismisse den mist");
    Keyboard.dismiss();
    const id = uuidv4();
    const newPlayers = [
      ...players,
      { name: input, id: id, lastGamePlayed: new Date().getTime() }
    ];
    setInput("");
    setPlayers(newPlayers);
    savePlayers(newPlayers);
    initPlayerStats(id);
  };

  const handleDeletePlayer = (index: number) => {
    const newPlayers = [...players];
    newPlayers.splice(index, 1);
    setPlayers(newPlayers);
    savePlayers(newPlayers);
    deletePlayerStats(players[index].id);
  };

  const handleInputChange = (input: string) => {
    setInput(input);
  };

  const handleRenamePlayer = (player: Player, index: number) => {
    const newPlayers = [...players];
    newPlayers.splice(index, 1, { name: player.name, ...player });
    setPlayers(newPlayers);
    savePlayers(newPlayers);
  };

  // ================================================================================================

  return (
    <Container>
      <Scoreboard flexVal={0.2} goHome={() => goHome(navigation)}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("../../assets/settings.png")}
            style={{ width: 35, height: 35, marginRight: 45 }}
          />
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Headline>Settings</Headline>
          </View>
          <View style={{ width: 75 }} />
        </View>
      </Scoreboard>
      <View style={styles.statContent}>
        {loading ? (
          <Text>Loading Players</Text>
        ) : (
          <>
            <Text style={styles.contentHeadline}>Players</Text>
            <View style={styles.addPlayer}>
              <TextInput
                onChangeText={handleInputChange}
                onSubmitEditing={handleAddPlayer}
                placeholder="Add player"
                style={styles.addPlayerTextfield}
                value={input}
              />
            </View>
            <View style={styles.playerListWrapper}>
              <ScrollView style={styles.playerList}>
                {players && players.length ? (
                  players.map((p: Player, index: number) => (
                    <Profile
                      key={p.id}
                      id={p.id}
                      index={index}
                      name={p.name}
                      onDelete={index => handleDeletePlayer(index)}
                      onRename={() => {
                        handleRenamePlayer(p, index);
                      }}
                    />
                  ))
                ) : (
                  <Text
                    style={{
                      fontSize: 20,
                      color: theme.neutrals.text
                    }}
                  >
                    Please create a Player
                  </Text>
                )}
              </ScrollView>
            </View>
          </>
        )}
      </View>
    </Container>
  );
};

// ================================================================================================

Settings.navigationOptions = {
  header: null
};

// ================================================================================================

const styles = StyleSheet.create({
  headerContent: {
    justifyContent: "center",
    flex: 0.2
  },
  statContent: {
    alignItems: "center",
    flex: 0.8,
    padding: 10,
    width: "100%"
  },
  addPlayer: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  addPlayerTextfield: {
    fontSize: 20,
    flex: 1
  },
  renamePlayerTextfield: {
    fontSize: 20,
    flex: 1,
    backgroundColor: theme.neutrals.ninth
  },
  contentHeadline: {
    color: theme.neutrals.text,
    fontSize: 22,
    fontWeight: "bold"
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
  player: {
    flexDirection: "row",
    marginTop: 5,
    justifyContent: "space-between",
    width: "100%"
  },
  playerList: {
    flexDirection: "column",
    width: "100%"
  },
  playerListWrapper: {
    flex: 0.85,
    width: "100%"
  },
  playerText: {
    fontSize: 20,
    color: theme.neutrals.text
  }
});

export default Settings;

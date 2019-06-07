import React, { FC, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  Image,
  StatusBar,
  ScrollView,
  View
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

// Utils
import goHome from "utils/goHome";

// ================================================================================================

// Props:
export interface Props extends NavigationScreenProps {}

export interface Player {
  name: string;
}

// ================================================================================================

const Settings: NavigationScreenComponent<Props> = ({ navigation }) => {
  const [editInput, setEditInput] = useState("");
  const [input, setInput] = useState("");
  const [players, setPlayers] = useState<Array<Player>>([]);
  const [editPosition, setEditPosition] = useState(-1);

  const editFieldRef = useRef<TextInput>(null);

  const handleAddPlayer = () => {
    setInput("");
    setPlayers([...players, { name: input }]);
  };

  const handleDeletePlayer = (index: number) => {
    const newPlayers = [...players];
    newPlayers.splice(index, 1);
    setPlayers(newPlayers);
  };

  const handleRenamePlayer = () => {
    const newPlayers = [...players];
    newPlayers.splice(editPosition, 1, {
      name: editInput
    });
    setPlayers(newPlayers);
  };

  const handleToggleEditPlayer = (index: number) => {
    if (editFieldRef.current) editFieldRef.current.focus();
    setEditInput(players[index].name);
    setEditPosition(index);
  };

  const handleInputChange = (input: string) => {
    setInput(input);
  };

  const handleEditInputChange = (input: string) => {
    setEditInput(input);
  };

  return (
    <Container>
      <StatusBar hidden />
      <Scoreboard flexVal={0.2} goHome={() => goHome(navigation)}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("../../assets/settings.png")}
            style={{ width: 35, height: 35, marginRight: 45 }}
          />
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Headline>Settings</Headline>
            {/*               <Text style={{ color: theme.neutrals.text }}>Coming soon!</Text>
             */}
          </View>
          <View style={{ width: 75 }} />
        </View>
      </Scoreboard>
      <View style={styles.statContent}>
        <Text style={styles.contentHeadline}>Players</Text>
        <View style={styles.addPlayer}>
          <TextInput
            onChangeText={handleInputChange}
            onSubmitEditing={handleAddPlayer}
            placeholder="Add player"
            style={styles.addPlayerTextfield}
            value={input}
          />
          <TouchableHighlight onPress={handleAddPlayer}>
            <Text>Add</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.playerListWrapper}>
          <ScrollView style={styles.playerList}>
            {players && players.length ? (
              players.map((p: Player, index: number) => (
                <View key={`${index}-${p.name}`} style={styles.player}>
                  {editPosition === index ? (
                    <TextInput
                      ref={editFieldRef}
                      onChangeText={handleEditInputChange}
                      onSubmitEditing={handleRenamePlayer}
                      placeholder={players[index].name}
                      style={styles.addPlayerTextfield}
                      value={editInput}
                    />
                  ) : (
                    <Text style={styles.playerText}>{p.name}</Text>
                  )}
                  <View style={{ flexDirection: "row" }}>
                    <TouchableHighlight
                      onPress={() => handleToggleEditPlayer(index)}
                    >
                      <Text>Edt</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      onPress={() => handleDeletePlayer(index)}
                    >
                      <Text>Del</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ fontSize: 20 }}>Please create a Player</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Container>
  );
};

Settings.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  headerContent: {
    justifyContent: "center",
    flex: 0.2
  },
  statContent: {
    alignItems: "center",
    flex: 0.8,
    padding: 5,
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
    fontSize: 20
  }
});

export default Settings;

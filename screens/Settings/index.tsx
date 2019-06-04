import React, { Component, createRef } from "react";
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
export interface Props {
  navigation: any;
}

// State:
type State = {
  input: string;
  editInput: string;
  // TODO: Player Interface
  players: any[];
  editPosition: number;
};

// ================================================================================================

class Settings extends Component<Props, State> {
  static navigationOptions = {
    header: null
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      editInput: "",
      input: "",
      players: [],
      editPosition: -1
    };
  }
  editFieldRef = createRef<TextInput>();

  handleAddPlayer = () => {
    this.setState({
      ...this.state,
      input: "",
      players: [...this.state.players, { name: this.state.input }]
    });
  };

  handleDeletePlayer = (index: number) => {
    const newPlayers = [...this.state.players];
    newPlayers.splice(index, 1);
    this.setState({
      ...this.state,
      players: newPlayers
    });
  };

  handleRenamePlayer = () => {
    const newPlayers = [...this.state.players];
    newPlayers.splice(this.state.editPosition, 1, {
      name: this.state.editInput
    });
    this.setState({
      ...this.state,
      players: newPlayers
    });
  };

  handleToggleEditPlayer = (index: number) => {
    if (this.editFieldRef.current) this.editFieldRef.current.focus();
    this.setState({
      ...this.state,
      editInput: this.state.players[index].name,
      editPosition: index
    });
  };

  handleInputChange = (input: string) => {
    this.setState({
      ...this.state,
      input: input
    });
  };

  handleEditInputChange = (input: string) => {
    this.setState({
      ...this.state,
      editInput: input
    });
  };

  render() {
    const { navigation } = this.props;

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
              onChangeText={this.handleInputChange}
              onSubmitEditing={this.handleAddPlayer}
              placeholder="Add player"
              style={styles.addPlayerTextfield}
              value={this.state.input}
            />
            <TouchableHighlight onPress={this.handleAddPlayer}>
              <Text>Add</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.playerListWrapper}>
            <ScrollView style={styles.playerList}>
              {this.state.players && this.state.players.length ? (
                this.state.players.map((p: any, index: number) => (
                  <View key={`${index}-${p.name}`} style={styles.player}>
                    {this.state.editPosition === index ? (
                      <TextInput
                        ref={this.editFieldRef}
                        onChangeText={this.handleEditInputChange}
                        onSubmitEditing={this.handleRenamePlayer}
                        placeholder={this.state.players[index].name}
                        style={styles.addPlayerTextfield}
                        value={this.state.editInput}
                      />
                    ) : (
                      <Text style={styles.playerText}>{p.name}</Text>
                    )}
                    <View style={{ flexDirection: "row" }}>
                      <TouchableHighlight
                        onPress={() => this.handleToggleEditPlayer(index)}
                      >
                        <Text>Edt</Text>
                      </TouchableHighlight>
                      <TouchableHighlight
                        onPress={() => this.handleDeletePlayer(index)}
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
  }
}

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

import React, { FC } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import {
  NavigationScreenComponent,
  NavigationScreenProps
} from "react-navigation";
// Colors:
import theme from "theme";

// Components:
import Container from "components/Container";
import Scoreboard from "components/Scoreboard";

// Utils:
import goHome from "utils/goHome";

// ================================================================================================
// Types:
import Player from "interfaces/player";

// Props:
export interface Props extends NavigationScreenProps {
  selectedPlayers: Player[];
}

// ================================================================================================

const Settings: NavigationScreenComponent<Props> = ({ navigation }) => {
  const selectedPlayer = navigation.getParam("selectedPlayers")[0];
  const buttonArray = [];

  for (let i = 1; i <= 20; i++) {
    buttonArray.push(i);
  }
  buttonArray.push(25);

  return (
    <Container>
      <Scoreboard
        flexVal={0.2}
        goHome={() => goHome(navigation)}
        headline="60 on X"
      >
        <Text style={{ color: theme.neutrals.text, fontSize: 24 }}>
          Select a field
        </Text>
      </Scoreboard>
      <View style={styles.buttonsWrapper}>
        {buttonArray.map(b => (
          <TouchableHighlight
            key={`key-${b}`}
            onPress={() => {
              navigation.navigate("NineNineX", {
                goal: b,
                round: 1,
                score: 0,
                gameHistory: [],
                roundHistory: [],
                fetchedStats: [],
                selectedPlayer: selectedPlayer
              });
            }}
            style={styles.goalButton}
            underlayColor={theme.primaries.lightBlues.tenth}
          >
            <Text style={styles.goalButtonText}>{b}</Text>
          </TouchableHighlight>
        ))}
      </View>
      <View style={styles.homeWrapper}>
        <TouchableHighlight
          key={`key-Home`}
          onPress={() => {
            navigation.navigate("Home");
          }}
          style={styles.homeButton}
          underlayColor={theme.primaries.lightBlues.tenth}
        >
          <Text style={styles.goalButtonText}>{"Cancel"}</Text>
        </TouchableHighlight>
      </View>
    </Container>
  );
};

Settings.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  buttonsWrapper: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 0.7,
    width: "100%",
    justifyContent: "center"
  },
  goalButton: {
    alignItems: "center",
    justifyContent: "center",
    height: "20%",
    margin: 1,
    width: "19%"
  },
  goalButtonText: {
    color: theme.primaries.lightBlues.first,
    fontSize: 22
  },
  homeWrapper: {
    flex: 0.1,
    width: "100%"
  },
  homeButton: {
    alignItems: "center",
    backgroundColor: theme.neutrals.ninth,
    justifyContent: "center",
    height: "100%",
    margin: 1,
    width: "100%"
  }
});

export default Settings;

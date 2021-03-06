import React, { FC, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  Image,
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

// ================================================================================================

const Multiplayer: NavigationScreenComponent<Props> = ({ navigation }) => {
  const buttons = [
    { destination: "X01", label: "X01" },
    { destination: "Bobs", label: "Bob's 27" },
    { destination: "Cricket", label: "Cricket" },
    { destination: "CricketCutThroat", label: "Cricket - Cut Throat" },
    { destination: "CricketCountUp", label: "Cricket - Count Up" },
    { destination: "Shanghai", label: "Shanghai" }
  ];

  return (
    <Container>
      <Scoreboard flexVal={0.2} goHome={() => goHome(navigation)}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("../../assets/multiplayer.png")}
            style={{ width: 40, height: 40, marginRight: 25 }}
          />
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Headline>Multiplayer Games</Headline>
          </View>
        </View>
      </Scoreboard>

      <View style={styles.homeContent}>
        {buttons.map((b, index) => (
          <TouchableHighlight
            key={b.destination}
            onPress={() => {
              navigation.navigate("PlayerSelection", {
                followUp: b.destination,
                multi: true
              });
            }}
            style={
              !(index === buttons.length - 1)
                ? styles.gameBtnBorder
                : styles.gameBtn
            }
            underlayColor={theme.primaries.lightBlues.tenth}
          >
            <Text style={styles.gameBtnText}>{b.label}</Text>
          </TouchableHighlight>
        ))}
      </View>
    </Container>
  );
};

Multiplayer.navigationOptions = {
  header: null
};

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
  gameBtn: {
    alignItems: "center",
    justifyContent: "center",
    flex: 0.2,
    width: "100%"
  },
  gameBtnBorder: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: theme.neutrals.ninth,
    borderBottomWidth: 1,
    flex: 0.2,
    width: "100%"
  },
  gameBtnText: {
    color: theme.primaries.lightBlues.first,
    fontSize: 22
  }
});

export default Multiplayer;

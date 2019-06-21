import React, { FC } from "react";
import { StyleSheet, Text, Image, View } from "react-native";
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

// ================================================================================================

// Props:
export interface Props extends NavigationScreenProps {}

// ================================================================================================

const Stats: NavigationScreenComponent<Props> = ({ navigation }) => {
  const buttons = [
    { destination: "NineNineXSettings", label: "60 on X" },
    { destination: "Bobs", label: "Bob's 27" },
    { destination: "OneOOneSettings", label: "Checkouts" },
    { destination: "CricketCountUp", label: "Cricket Count Up" },
    { destination: "Shanghai", label: "Shanghai" }
  ];

  return (
    <Container>
      <Scoreboard flexVal={0.2} goHome={() => goHome(navigation)}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("../../assets/stats.png")}
            style={{ width: 50, height: 50, marginRight: 25 }}
          />
          <View style={{ alignItems: "center" }}>
            <Headline>Stats</Headline>
            <Text style={{ color: theme.neutrals.text }}>Coming soon!</Text>
          </View>
          <View style={{ width: 75 }} />
        </View>
      </Scoreboard>
    </Container>
  );
};

Stats.navigationOptions = {
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
    borderColor: theme.neutrals.seventh,
    borderBottomWidth: 1,
    flex: 0.2,
    width: "100%"
  },
  gameBtnText: {
    color: theme.primaries.lightBlues.first,
    fontSize: 22
  }
});

export default Stats;

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  Image,
  StatusBar,
  View
} from "react-native";

// Atoms:
import Headline from "atoms/Headline";

// Colors:
import theme from "theme";

// Components:
import Container from "components/Container";
import Scoreboard from "components/Scoreboard";

// ================================================================================================

// Props:
export interface Props {
  navigation: any;
}

// State:
type State = {
  goal: number;
  round: number;
  score: number;
  gameHistory: any[];
  roundHistory: any[];
  fetchedStats: any[];
};

// ================================================================================================

class Home extends Component<Props, State> {
  static navigationOptions = {
    header: null
  };

  render() {
    const { navigation } = this.props;

    const buttons = [
      { destination: "NineNineXSettings", label: "60 on X" },
      { destination: "Bobs", label: "Bob's 27" },
      { destination: "OneOOneSettings", label: "Checkouts" },
      { destination: "CricketCountUp", label: "Cricket Count Up" },
      { destination: "Shanghai", label: "Shanghai" }
    ];

    return (
      <Container>
        <StatusBar hidden />
        <Scoreboard flexVal={0.2}>
          <View style={{ flexDirection: "row" }}>
            <Image
              source={require("../../assets/drticn-no-edges.png")}
              style={{ width: 50, height: 50, marginRight: 25 }}
            />
            <View style={{ alignItems: "center" }}>
              <Headline>Darts Trainer</Headline>
              <Text style={{ color: theme.neutrals.text }}>
                Select your training
              </Text>
            </View>
            <View style={{ width: 75 }} />
          </View>
        </Scoreboard>

        <View style={styles.homeContent}>
          {buttons.map((b, index) => (
            <TouchableHighlight
              key={b.destination}
              onPress={() => {
                navigation.navigate(b.destination);
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
  }
}

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

export default Home;

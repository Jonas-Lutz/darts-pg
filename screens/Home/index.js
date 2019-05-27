import React, { Component } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";

// Atoms:
import Headline from "mydarts/atoms/Headline";

// Colors:
import theme from "mydarts/theme";

// Components:
import Container from "mydarts/components/Container";
import Scoreboard from "mydarts/components/Scoreboard";

class Home extends Component {
  static navigationOptions = {
    header: null
  };
  state = {};

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
        <Scoreboard flexVal={0.2}>
          <Headline>Darts Trainer</Headline>
          <Text>Select your training</Text>
        </Scoreboard>

        <View style={styles.homeContent}>
          {buttons.map((b, index) => (
            <TouchableHighlight
              key={b.destination}
              onPress={() => {
                navigation.navigate(b.destination);
              }}
              style={
                index === buttons.length - 1
                  ? styles.gameBtnBottomBorder
                  : styles.gameBtn
              }
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
    borderColor: theme.neutrals.seventh,
    borderTopWidth: 1,
    justifyContent: "center",
    flex: 0.2,
    width: "100%"
  },
  gameBtnBottomBorder: {
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
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

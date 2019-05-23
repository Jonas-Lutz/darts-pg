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
      { destination: "OneOOneSettings", label: "Checkouts" },
      { destination: "CricketCountUp", label: "Cricket Count Up" },
      { destination: "Bobs", label: "Bob's 27" }
    ];

    return (
      <Container>
        <Scoreboard flexVal={1}>
          <Headline>Darts Trainer</Headline>
          <Text>Select your training</Text>
          <View style={styles.homeContent}>
            {buttons.map(b => (
              <View key={b.destination}>
                <TouchableHighlight
                  onPress={() => {
                    navigation.navigate(b.destination);
                  }}
                >
                  <View style={styles.gameBtn}>
                    <Text style={styles.gameBtnText}>{b.label}</Text>
                  </View>
                </TouchableHighlight>
              </View>
            ))}
          </View>
        </Scoreboard>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  homeContent: {
    justifyContent: "center",
    flex: 1
  },
  gameBtn: {
    backgroundColor: theme.neutrals.third,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    height: 75,
    padding: 5,
    width: 180
  },
  gameBtnText: {
    color: theme.neutrals.tenth,
    fontSize: 22
  }
});

export default Home;

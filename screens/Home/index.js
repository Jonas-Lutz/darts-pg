import React, { Component } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";

// Atoms:
import Headline from "../../atoms/Headline";

// Colors:
import theme from "../../theme";

// Components:
import Container from "../../components/Container";

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
      { destination: "CricketCountUp", label: "Cricket Count Up" }
    ];

    return (
      <Container>
        <Headline>Darts Trainer</Headline>
        <Text>Select your training</Text>
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
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  gameBtn: {
    backgroundColor: theme.primaries.sixth,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    height: 75,
    width: 180
  },
  gameBtnText: {
    fontSize: 20
  }
});

export default Home;

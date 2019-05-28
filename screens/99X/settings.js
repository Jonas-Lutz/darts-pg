import React, { Component } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";

// Colors:
import theme from "mydarts/theme";

// Components:
import Container from "mydarts/components/Container";
import Scoreboard from "mydarts/components/Scoreboard";

// Utils:
import { smallScreen } from "mydarts/utils/deviceRatio";

const isSmall = smallScreen();

class Settings extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    const { navigation } = this.props;

    const buttonArray = [];

    for (let i = 1; i <= 20; i++) {
      buttonArray.push(i);
    }
    buttonArray.push(25);

    return (
      <Container>
        <Scoreboard flexVal={0.2}>
          <Text style={{ fontSize: 24 }}>Select a field</Text>
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
                  fetchedStats: []
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
  }
}

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

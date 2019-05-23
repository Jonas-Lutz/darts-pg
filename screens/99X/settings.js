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
          <Text style={{ fontSize: 20 }}>Select a field</Text>
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
            >
              <View style={styles.goalButton}>
                <Text style={styles.goalButtonText}>{b}</Text>
              </View>
            </TouchableHighlight>
          ))}
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
    flex: 0.8,
    justifyContent: "center"
  },
  goalButton: {
    alignItems: "center",
    backgroundColor: theme.neutrals.tenth,
    justifyContent: "center",
    height: isSmall ? 65 : 80,
    margin: 1,
    width: isSmall ? 65 : 80
  },
  goalButtonText: {
    color: theme.primaries.lightBlues.first,
    fontSize: 18
  }
});

export default Settings;

import React, { Component } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";

// Colors:
import theme from "../../theme";

// Components:
import Container from "../../components/Container";

// Utils:
import { smallScreen } from "../../utils/deviceRatio";

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
        <View
          style={{
            alignItems: "center",
            backgroundColor: theme.primaries.ninth,
            flex: 0.2,
            justifyContent: "center"
          }}
        >
          <Text style={{ fontSize: 20 }}>Select a field</Text>
        </View>
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
                <Text style={{ fontSize: 18 }}>{b}</Text>
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
  }
});

export default Settings;

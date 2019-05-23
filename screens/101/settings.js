import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from "react-native";

// Atoms:
import Headline from "mydarts/atoms/Headline";

// Colors:
import theme from "mydarts/theme";

// Components:
import Container from "mydarts/components/Container";
import Scoreboard from "mydarts/components/Scoreboard";

// Utils:
import { smallScreen } from "mydarts/utils/deviceRatio";

const isSmall = smallScreen();

class OneOOneSettings extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      doubleIn: true,
      input: ""
    };
  }

  toggleDoubleIn = () => {
    this.setState({
      ...this.state,
      doubleIn: !this.state.doubleIn
    });
  };

  handleInputChange = input => {
    this.setState({
      ...this.state,
      input: input
    });
  };

  render() {
    const { navigation } = this.props;

    const suggestions = [101, 170];

    return (
      <Container>
        <Scoreboard flexVal={0.25}>
          <Headline>Custom checkouts</Headline>
          <Text>Pick or enter the starting score</Text>
        </Scoreboard>

        <View style={styles.content}>
          <View style={styles.buttonsWrapper}>
            {suggestions.map(s => {
              return (
                <View key={`default - ${s}`} style={styles.quickStart}>
                  <TouchableHighlight
                    onPress={() => {
                      navigation.navigate("OneOOne", {
                        doubleIn: this.state.doubleIn,
                        gameHistory: [],
                        multiplier: 1,
                        round: 1,
                        roundHistory: [],
                        finished: false,
                        bust: false,
                        score: s
                      });
                    }}
                  >
                    <View>
                      <Text style={styles.buttonText}>{s}</Text>
                    </View>
                  </TouchableHighlight>
                </View>
              );
            })}
            <View style={styles.scoreTextfieldWrapper}>
              <TextInput
                keyboardType="numeric"
                onChangeText={this.handleInputChange}
                placeholder="Enter score"
                value={this.state.input}
                style={styles.scoreTextfield}
              />
            </View>
            <View>
              <TouchableHighlight
                onPress={() => {
                  navigation.navigate("OneOOne", {
                    doubleIn: this.state.doubleIn,
                    gameHistory: [],
                    multiplier: 1,
                    round: 1,
                    roundHistory: [],
                    finished: false,
                    bust: false,
                    score: parseInt(this.state.input)
                  });
                }}
              >
                <View style={styles.startButton}>
                  <Text style={styles.buttonText}>Start</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 0.33
  },
  content: {
    flex: 0.67
  },
  buttonsWrapper: {
    alignItems: "center",
    justifyContent: "center"
  },
  quickStart: {
    backgroundColor: theme.primaries.lightBlues.fifth,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    height: 55,
    width: 120
  },
  startButton: {
    backgroundColor: theme.primaries.lightBlues.third,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    height: 55,
    width: 120
  },
  buttonText: {
    fontSize: 20
  },
  scoreTextfield: {
    fontSize: 18,
    marginLeft: 5
  },
  scoreTextfieldWrapper: {
    justifyContent: "center",
    height: 55,
    width: 120,
    borderColor: theme.neutrals.tenth,
    borderBottomWidth: 1
  }
});

export default OneOOneSettings;

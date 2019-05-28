import React, { Component } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
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

        <KeyboardAvoidingView style={styles.content} behavior="padding">
          <View style={styles.buttonsWrapper}>
            {suggestions.map(s => {
              return (
                <TouchableHighlight
                  key={`default - ${s}`}
                  style={styles.quickStart}
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
                  underlayColor={theme.primaries.lightBlues.tenth}
                >
                  <Text style={styles.buttonText}>{s}</Text>
                </TouchableHighlight>
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
            <View style={{ flex: 0.25, width: "100%" }}>
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
                    score: this.state.input ? parseInt(this.state.input) : 101
                  });
                }}
                style={styles.startButton}
                underlayColor={theme.primaries.lightBlues.tenth}
              >
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableHighlight>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 0.33
  },
  content: {
    flex: 0.75,
    width: "100%"
  },
  buttonsWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  quickStart: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: theme.neutrals.ninth,
    justifyContent: "center",
    flex: 0.25,
    width: "100%"
  },
  startButton: {
    backgroundColor: theme.primaries.lightBlues.fourth,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%"
  },
  buttonText: {
    fontSize: 24,
    color: theme.primaries.lightBlues.first
  },
  startButtonText: {
    fontSize: 24,
    color: theme.neutrals.tenth
  },
  scoreTextfield: {
    fontSize: 18,
    marginLeft: 5,
    flex: 0.25
  },
  scoreTextfieldWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 0.25,
    width: "100%",
    borderColor: theme.neutrals.tenth,
    borderBottomWidth: 1
  }
});

export default OneOOneSettings;

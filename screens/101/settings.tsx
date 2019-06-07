import React, { FC, useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from "react-native";
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
import { smallScreen } from "utils/deviceRatio";
import goHome from "utils/goHome";

// ================================================================================================

// Props:
export interface Props extends NavigationScreenProps {}

// ================================================================================================

const OneOOneSettings: NavigationScreenComponent<Props> = ({ navigation }) => {
  const [input, setInput] = useState("");

  const suggestions = [101, 170];

  return (
    <Container>
      <Scoreboard flexVal={0.25} goHome={() => goHome(navigation)}>
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
              onChangeText={input => setInput(input)}
              placeholder="Enter score"
              value={input}
              style={styles.scoreTextfield}
            />
          </View>
          <View style={{ flex: 0.175, width: "100%" }}>
            <TouchableHighlight
              onPress={() => {
                navigation.navigate("OneOOne", {
                  gameHistory: [],
                  multiplier: 1,
                  round: 1,
                  roundHistory: [],
                  finished: false,
                  bust: false,
                  score: input ? parseInt(input) : 101
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
};

OneOOneSettings.navigationOptions = {
  header: null
};

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
    flex: 0.275,
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
    fontSize: 22,
    color: theme.primaries.lightBlues.first
  },
  startButtonText: {
    fontSize: 24,
    color: theme.neutrals.tenth
  },
  scoreTextfield: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    flex: 0.25,
    color: theme.primaries.lightBlues.first
  },
  scoreTextfieldWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 0.275,
    width: "100%",
    borderColor: theme.neutrals.tenth,
    borderBottomWidth: 1
  }
});

export default OneOOneSettings;

import React from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  Image,
  StatusBar,
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

// ================================================================================================

// Props:
export interface Props extends NavigationScreenProps {}
// ================================================================================================

const Home: NavigationScreenComponent<Props> = ({ navigation }) => {
  const buttons = [
    { destination: "Singleplayer", label: "Singleplayer" },
    { destination: "Multiplayer", label: "Multiplayer" },
    { destination: "Settings", label: "Settings" },
    { destination: "Stats", label: "Stats" }
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
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-around",
                paddingLeft: 25,
                width: "100%"
              }}
            >
              {index === 0 && (
                <Image
                  source={require(`../../assets/singleplayer.png`)}
                  style={{ width: 35, height: 35 }}
                />
              )}
              {index === 1 && (
                <Image
                  source={require(`../../assets/multiplayer.png`)}
                  style={{ width: 35, height: 35 }}
                />
              )}
              {index === 2 && (
                <Image
                  source={require(`../../assets/settings.png`)}
                  style={{ width: 35, height: 30 }}
                />
              )}
              {index === 3 && (
                <Image
                  source={require(`../../assets/stats.png`)}
                  style={{ width: 35, height: 35 }}
                />
              )}
              <View
                style={{
                  alignItems: "center",
                  flex: 0.67
                }}
              >
                <Text style={styles.gameBtnText}>{b.label}</Text>
              </View>
              <View style={{ width: 40, height: 40 }} />
            </View>
          </TouchableHighlight>
        ))}
      </View>
    </Container>
  );
};

Home.navigationOptions = {
  header: null
};

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
    justifyContent: "center",
    flex: 0.25,
    width: "100%"
  },
  gameBtnBorder: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: theme.neutrals.seventh,
    borderBottomWidth: 1,
    flex: 0.25,
    width: "100%"
  },
  gameBtnText: {
    color: theme.primaries.lightBlues.first,
    fontSize: 22
  }
});

export default Home;

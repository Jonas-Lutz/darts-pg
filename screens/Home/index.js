import React, { Component } from "react";
import { StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";

// Colors:
import theme from "../../theme";

class Home extends Component {
  state = {};

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Text>Home</Text>
        <View>
          <TouchableNativeFeedback
            onPress={() => {
              navigation.navigate("NineNineX");
            }}
          >
            <View style={styles.gameBtn}>
              <Text>Start 99X</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.neutrals.tenth,
    alignItems: "center",
    justifyContent: "center"
  },
  gameBtn: {
    backgroundColor: theme.primaries.sixth,
    margin: 5,
    padding: 5
  }
});

export default Home;

import React, { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo";

// Colors:
import theme from "theme";

// ==================================================================================================

type Props = {
  bust?: boolean;
  flexVal: number;
};

// ==================================================================================================

const Scoreboard: FunctionComponent<Props> = ({
  bust = false,
  children,
  flexVal
}) => {
  return (
    <View style={{ flex: flexVal, width: "100%" }}>
      <LinearGradient
        colors={[
          theme.primaries.yellows.fifth,
          theme.primaries.yellows.sixth,
          theme.primaries.yellows.seventh,
          theme.primaries.yellows.eighth
        ]}
        style={!bust ? styles.scoreboard : styles.scoreboardBust}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  scoreboard: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 1,
    width: "100%"
  },
  scoreboardBust: {
    alignItems: "center",
    backgroundColor: theme.supporting.red.fifth,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 1,
    width: "100%"
  }
});

export default Scoreboard;

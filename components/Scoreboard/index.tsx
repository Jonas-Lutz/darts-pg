import React, { FunctionComponent } from "react";
import { StyleSheet, View, Image, TouchableHighlight } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Colors:
import theme from "theme";

// ==================================================================================================

type Props = {
  bust?: boolean;
  flexVal: number;
  goHome?: () => void;
};

// ==================================================================================================

const Scoreboard: FunctionComponent<Props> = ({
  bust = false,
  children,
  flexVal,
  goHome
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
        {goHome && (
          <TouchableHighlight onPress={goHome} style={styles.closeButton}>
            <Image
              style={styles.closeButtonImage}
              source={require("../../assets/close.png")}
            />
          </TouchableHighlight>
        )}
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
  closeButton: {
    position: "absolute",
    padding: 10,
    top: 1,
    right: 1,
    zIndex: 25
  },
  closeButtonImage: {
    width: 12,
    height: 12
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

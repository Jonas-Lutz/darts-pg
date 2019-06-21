import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Colors:
import theme from "theme";

// ==================================================================================================

type Props = {
  bust?: boolean;
  flexVal: number;
  headline?: string;
  leftHeadline?: string;
  goHome?: () => void;
};

// ==================================================================================================

const Scoreboard: FunctionComponent<Props> = ({
  bust = false,
  children,
  flexVal,
  headline,
  leftHeadline,
  goHome
}) => {
  return (
    <View style={{ flex: flexVal, width: "100%" }}>
      <LinearGradient
        colors={[
          theme.primaries.yellows.seventh,
          theme.primaries.yellows.eighth
        ]}
        style={!bust ? styles.scoreboard : styles.scoreboardBust}
      >
        {goHome && (
          <View
            style={{
              backgroundColor: theme.primaries.yellows.fifth,
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%"
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1
              }}
            >
              <Text>{leftHeadline ? leftHeadline : ""}</Text>
            </View>

            {headline && (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1
                }}
              >
                <Text>{headline}</Text>
              </View>
            )}
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <TouchableHighlight onPress={goHome} style={styles.closeButton}>
                <Image
                  style={styles.closeButtonImage}
                  source={require("../../assets/close.png")}
                />
              </TouchableHighlight>
            </View>
          </View>
        )}
        <View
          style={{
            alignItems: "center",
            flex: 1,
            width: "100%",
            justifyContent: "center"
          }}
        >
          {children}
        </View>
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

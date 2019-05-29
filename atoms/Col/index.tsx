import React, { FunctionComponent } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

const Col: FunctionComponent<ViewProps> = props => (
  <View {...props} style={styles.col}>
    {props.children}
  </View>
);

const styles = StyleSheet.create({
  col: {
    flexDirection: "column"
  }
});

export default Col;

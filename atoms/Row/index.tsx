import React, { FunctionComponent } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

const Row: FunctionComponent<ViewProps> = props => (
  <View style={styles.row} {...props}>
    {props.children}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row"
  }
});

export default Row;

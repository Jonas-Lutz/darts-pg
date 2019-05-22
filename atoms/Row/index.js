import React from "react";
import { StyleSheet, View } from "react-native";

const Row = props => (
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

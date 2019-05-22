import React from "react";
import { StyleSheet, View } from "react-native";

const Col = props => (
  <View {...props} style={styles.row}>
    {props.children}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "column"
  }
});

export default Col;

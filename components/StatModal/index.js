import React from "react";
import {
  StyleSheet,
  TouchableHighlight,
  Text,
  Modal,
  View
} from "react-native";

// Atoms:
import Headline from "../../atoms/Headline";

const StatModal = props => {
  let darts = [];

  if (props.gameHistory.length > 0) {
    props.gameHistory.map(round => {
      round.map(dart => {
        darts.push(dart);
      });
    });
  }

  const misses = darts.filter(dart => dart.score === 0).length;
  const triples = darts.filter(dart => dart.multiplier === 3).length;
  const doubles = darts.filter(dart => dart.multiplier === 2).length;
  const singles = darts.filter(dart => dart.multiplier === 1).length;
  const hits = darts.length - misses;
  const successRate = (100 * hits) / darts.length;
  const tripleRate = (100 * triples) / darts.length;
  const doubleRate = (100 * doubles) / darts.length;
  const singleRate = (100 * singles) / darts.length;
  const mpr = ((triples * 3 + doubles * 2 + singles) * 3) / darts.length;

  return (
    <Modal
      visible={props.visible}
      onRequestClose={() => {
        alert("closed");
      }}
    >
      <View>
        <View>
          <Headline>Stats</Headline>
          <View style={{ flexDirection: "row" }}>
            <View>
              <Text>Category</Text>
            </View>
            <View>
              <Text>Value</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View>
              <Text>Score:</Text>
            </View>
            <View>
              <Text>{props.score} </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View>
              <Text>Total Hit Rate: </Text>
            </View>
            <View>
              <Text>{`${hits} / ${darts.length} (${successRate.toFixed(
                2
              )} %)`}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View>
              <Text>Singles: </Text>
            </View>
            <View>
              <Text>{`${singles}  (${singleRate.toFixed(2)} %)`}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View>
              <Text>Doubles: </Text>
            </View>
            <View>
              <Text>{`${doubles}  (${doubleRate.toFixed(2)} %)`}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View>
              <Text>Triples: </Text>
            </View>
            <View>
              <Text>{`${triples} (${tripleRate.toFixed(2)} %)`}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View>
              <Text>MPR: </Text>
            </View>
            <View>
              <Text>{`${mpr.toFixed(2)}`}</Text>
            </View>
          </View>
        </View>
        <View>
          <TouchableHighlight onPress={props.onClose}>
            <View style={{ width: 150, height: 100, backgroundColor: "red" }}>
              <Text>Close</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({});

export default StatModal;

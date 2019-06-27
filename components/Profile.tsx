import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from "react-native";
import theme from "theme";

// ==============================================================================================================

// Props:
export interface Props {
  id: string;
  index: number;
  name: string;
  onDelete: (index: number) => void;
  onRename: (name: string, index: number) => void;
}

// ==============================================================================================================

const Player = ({ id, index, name, onDelete, onRename }: Props) => {
  const [editmode, setEditmode] = useState(false);
  const [newName, setNewName] = useState(name);

  const textfieldRef = useRef<TextInput>(null);

  useEffect(() => {
    if (editmode && textfieldRef.current) {
      textfieldRef.current.focus();
    }
  }, [editmode, textfieldRef.current]);

  // ==============================================================================================================

  return (
    <View key={id} style={styles.player}>
      <TextInput
        ref={textfieldRef}
        onChangeText={setNewName}
        onBlur={() => setEditmode(false)}
        onSubmitEditing={() => {
          setEditmode(false);
          onRename(newName, index);
        }}
        placeholder={newName}
        style={editmode ? styles.addPlayerTextfield : styles.hidden}
        value={newName}
      />
      <Text style={editmode ? styles.hidden : styles.playerText}>
        {newName}
      </Text>
      <View
        style={{
          justifyContent: "flex-end",
          flexDirection: "row"
        }}
      >
        <TouchableHighlight
          onPress={() => {
            setEditmode(true);
          }}
          style={styles.playerBtn}
          underlayColor={theme.primaries.lightBlues.ninth}
        >
          <Image source={require("../assets/edit.png")} style={styles.icnBtn} />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => onDelete(index)}
          style={styles.playerBtn}
          underlayColor={theme.primaries.lightBlues.ninth}
        >
          <Image
            source={require("../assets/delete.png")}
            style={styles.bigIcnBtn}
          />
        </TouchableHighlight>
      </View>
    </View>
  );
};

// ==============================================================================================================

const styles = StyleSheet.create({
  addPlayerTextfield: {
    fontSize: 20,
    flex: 1,
    paddingBottom: 10
  },
  hidden: {
    display: "none"
  },
  icnBtn: {
    height: 20,
    width: 20
  },
  bigIcnBtn: {
    height: 20,
    width: 18,
    marginBottom: 6
  },
  player: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    width: "100%"
  },
  playerBtn: {
    marginLeft: 5,
    padding: 5
  },
  playerList: {
    flexDirection: "column",
    width: "100%"
  },
  playerListWrapper: {
    flex: 0.85,
    width: "100%"
  },
  playerText: {
    fontSize: 20,
    color: theme.neutrals.text
  }
});

export default Player;

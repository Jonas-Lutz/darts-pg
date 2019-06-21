import { AsyncStorage } from "react-native";
import Player from "interfaces/player";

const savePlayersToStorage = async (newPlayers: Player[]) => {
  try {
    AsyncStorage.setItem("players", JSON.stringify(newPlayers));
    console.log("saved players");
  } catch {
    console.log("error saving");
  }
};

export default savePlayersToStorage;

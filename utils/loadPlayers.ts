import { AsyncStorage } from "react-native";
import Player from "interfaces/player";

export interface Props {
  setLoading: (loading: boolean) => void;
  setPlayers: (players: Player[]) => void;
}

const loadPlayers = async ({ setLoading, setPlayers }: Props) => {
  setLoading(true);
  const fetchedPlayers = await AsyncStorage.getItem("players");
  if (fetchedPlayers) {
    setPlayers(JSON.parse(fetchedPlayers));
    console.log("fetched Players");
  } else {
    setPlayers([]);
  }
  setLoading(false);
};

export default loadPlayers;

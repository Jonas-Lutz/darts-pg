import { AsyncStorage } from "react-native";

import Stats from "interfaces/stats";

const initPlayerStats = async (id: string) => {
  let error = false;
  let statHistory: Stats[] = [];

  // Fetch Prev Stats
  try {
    const value = await AsyncStorage.getItem("stats");
    if (value) {
      statHistory = JSON.parse(value);
    } else {
      console.log("no value");
    }
  } catch {
    error = true;
    console.log("error catch");
  }

  statHistory = statHistory.filter(playerStats => playerStats.playerId !== id);

  if (!error) {
    const res = await AsyncStorage.setItem(
      "stats",
      JSON.stringify(statHistory)
    );
    console.log("deleted - player", res);
  } else {
    console.log("didnt save weil error");
  }
};

export default initPlayerStats;

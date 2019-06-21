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

  statHistory.push({
    playerId: id,
    x01: {
      checkout: 0,
      highestScore: 0,
      highestCheckout: 0,
      ppr: 0,
      darts: [],
      plus100: 0,
      plus140: 0,
      plus160: 0
    },
    cricket: {
      avgMpr: 0,
      darts: []
    },
    cricketCountUp: {
      highscore: 0,
      mpr: 0,
      darts: []
    },
    nineNineX: {
      fields: [
        {
          goal: 0,
          darts: [],
          tripleRate: 0,
          doubleRate: 0,
          hitRate: 0,
          ppr: 0
        }
      ]
    },
    shanghai: {
      highscore: 0,
      darts: []
    },
    bobs: {
      highscore: 0,
      darts: []
    }
  });

  if (!error) {
    const res = await AsyncStorage.setItem(
      "stats",
      JSON.stringify(statHistory)
    );
    console.log("saved - init", res);
  } else {
    console.log("didnt save weil error");
  }
};

export default initPlayerStats;

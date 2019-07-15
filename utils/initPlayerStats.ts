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
      games: 0,
      wins: 0,
      checkout: 0,
      highestScore: 0,
      highestCheckout: 0,
      ppr: 0,
      darts: [],
      plus100: 0,
      plus140: 0,
      plus160: 0,
      plus180: 0
    },
    cricket: {
      games: 0,
      wins: 0,
      avgMpr: 0,
      darts: []
    },
    cricketCountUp: {
      games: 0,
      wins: 0,
      highscore: 0,
      avgMpr: 0,
      darts: [],
      scores: [],
      fourteenPlus: 0,
      twentyeightPlus: 0,
      twentyonePlus: 0
    },
    nineNineX: {
      fields: [
        {
          goal: 0,
          darts: [],
          tripleRate: 0,
          doubleRate: 0,
          singleRate: 0,
          hitRate: 0,
          ppr: 0,
          highscore: 0
        }
      ]
    },
    shanghai: {
      games: 0,
      wins: 0,
      shanghaiFinishes: 0,
      highscore: 0
    },
    bobs: {
      games: 0,
      wins: 0,
      highscore: 0,
      finishes: 0
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

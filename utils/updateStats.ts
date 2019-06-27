import { AsyncStorage } from "react-native";
import NoIdDart from "interfaces/noIdDart";
import Stats from "interfaces/stats";

const updateStats = async (
  playerGameHistory:
    | BobsGameHistory[]
    | ShanghaiGameHistory[]
    | NineNineXHistory[]
    | CricketCountUpHistory[]
) => {
  let statHistory: Stats[] = [];

  // Fetch Prev Stats
  try {
    const value = await AsyncStorage.getItem("stats");
    if (value) {
      statHistory = JSON.parse(value);
    } else {
      console.log("error fetching - no value");
    }
  } catch {
    console.log("error catch");
  }

  playerGameHistory.forEach(
    (
      p:
        | BobsGameHistory
        | ShanghaiGameHistory
        | NineNineXHistory
        | CricketCountUpHistory
    ) => {
      statHistory.forEach((playerStats, index) => {
        if (p.playerId === playerStats.playerId) {
          switch (p.gameMode) {
            /* case "x01":
              console.log("save x01 stats");
              break;
            case "cricket":
              console.log("save cricket stats");
              break;*/
            case "cricketCountUp":
              statHistory[index].cricketCountUp.highscore = Math.max(
                p.stats.score,
                statHistory[index].cricketCountUp.highscore
              );
              statHistory[index].cricketCountUp.darts.push(p.stats.rounds);
              statHistory[index].cricketCountUp.scores.push(p.stats.score);
              statHistory[index].cricketCountUp.avgMpr =
                statHistory[index].cricketCountUp.scores.reduce(
                  (acc, val) => acc + val
                ) /
                statHistory[index].cricketCountUp.scores.length /
                7;
              break;
            case "nineNineX":
              const statField = statHistory[index].nineNineX.fields.find(
                field => field.goal === p.stats.goal
              );
              if (statField) {
                const newDarts = [...statField.darts, ...p.stats.darts];
                const misses = newDarts.filter(dart => dart.multiplier === 0)
                  .length;
                const triples = newDarts.filter(dart => dart.multiplier === 3)
                  .length;
                const doubles = newDarts.filter(dart => dart.multiplier === 2)
                  .length;
                const singles = newDarts.filter(dart => dart.multiplier === 1)
                  .length;
                const amount = newDarts.length;
                const hits = amount - misses;
                statField.darts = newDarts;
                statField.tripleRate = (100 * triples) / amount;
                statField.doubleRate = (100 * doubles) / amount;
                statField.singleRate = (100 * singles) / amount;
                statField.hitRate = (100 * hits) / amount;
                statField.ppr =
                  ((triples * 3 + doubles * 2 + singles) * 3) / amount;
                statField.highscore = Math.max(
                  p.stats.highscore,
                  statHistory[index].cricketCountUp.highscore
                );
              } else {
                statHistory[index].nineNineX.fields.push(p.stats);
              }
              break;
            case "shanghai":
              statHistory[index].shanghai.highscore = Math.max(
                p.stats.total,
                statHistory[index].shanghai.highscore
              );
              break;
            case "bobs":
              statHistory[index].bobs.highscore = Math.max(
                p.stats.total,
                statHistory[index].bobs.highscore
              );
              break;
            default:
              console.log("default");
              break;
          }
        }
      });
    }
  );

  const response = await AsyncStorage.setItem(
    "stats",
    JSON.stringify(statHistory),
    error => console.log("error: ", error)
  );
};

export default updateStats;

export type GameMode =
  | "bobs"
  | "x01"
  | "shanghai"
  | "nineNineX"
  | "cricketCountUp"
  | "cricket";

export interface BobsGameHistory {
  gameMode: "bobs";
  stats: {
    total: number;
  };
  playerId: string;
}

export interface ShanghaiGameHistory {
  gameMode: "shanghai";
  stats: {
    total: number;
  };
  playerId: string;
}

export interface NineNineXHistory {
  gameMode: "nineNineX";
  playerId: string;
  stats: {
    goal: number;
    darts: NoIdDart[];
    tripleRate: number;
    doubleRate: number;
    singleRate: number;
    hitRate: number;
    ppr: number;
    highscore: number;
  };
}

export interface CricketCountUpHistory {
  gameMode: "cricketCountUp";
  playerId: string;
  stats: {
    score: number;
    rounds: number[];
  };
}

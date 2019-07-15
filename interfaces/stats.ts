import NoIdDart from "interfaces/noIdDart";

export default interface Stats {
  playerId: string;
  x01: {
    games: number;
    wins: number;
    checkout: number;
    highestScore: number;
    highestCheckout: number;
    ppr: number;
    darts: NoIdDart[];
    plus100: number;
    plus140: number;
    plus160: number;
    plus180: number;
  };
  cricket: {
    games: number;
    wins: number;
    avgMpr: number;
    darts: NoIdDart[];
  };
  cricketCountUp: {
    games: number;
    wins: number;
    highscore: number;
    avgMpr: number;
    darts: number[][];
    scores: number[];
    fourteenPlus: number;
    twentyonePlus: number;
    twentyeightPlus: number;
  };
  nineNineX: {
    fields: [
      {
        goal: number;
        darts: NoIdDart[];
        tripleRate: number;
        doubleRate: number;
        singleRate: number;
        hitRate: number;
        ppr: number;
        highscore: number;
      }
    ];
  };
  shanghai: {
    games: number;
    highscore: number;
    shanghaiFinishes: number;
    wins: number;
  };
  bobs: {
    finishes: number;
    games: number;
    highscore: number;
    wins: number;
  };
}

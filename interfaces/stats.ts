import NoIdDart from "interfaces/noIdDart";

export default interface Stats {
  playerId: string;
  x01: {
    checkout: number;
    highestScore: number;
    highestCheckout: number;
    ppr: number;
    darts: NoIdDart[];
    plus100: number;
    plus140: number;
    plus160: number;
  };
  cricket: {
    avgMpr: number;
    darts: NoIdDart[];
  };
  cricketCountUp: {
    highscore: number;
    avgMpr: number;
    darts: number[][];
    scores: number[];
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
    highscore: number;
  };
  bobs: {
    highscore: number;
  };
}

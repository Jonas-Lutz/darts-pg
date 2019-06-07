// Types:
export interface Dart {
  points: number;
  multiplier: number;
}

export default (darts: Dart[][]) => {
  let throwndarts = 0;
  darts.map(round => {
    round.map((dart: Dart) => {
      throwndarts = throwndarts + 1;
    });
  });

  return throwndarts;
};

export default (darts: any[]) => {
  let throwndarts = 0;
  darts.map(round => {
    round.map((dart: any) => {
      throwndarts = throwndarts + 1;
    });
  });

  return throwndarts;
};

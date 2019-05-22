export default darts => {
  let throwndarts = 0;
  let rounds = darts && darts.length > 0 ? darts.length : 0;
  darts.map(round => {
    round.map(dart => {
      throwndarts = throwndarts + 1;
    });
  });

  return throwndarts;
};

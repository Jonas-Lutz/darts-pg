// Types:
import Dart from "interfaces/dart";
import noIdDart from "interfaces/noIdDart";

export default (darts: noIdDart[][]) => {
  let throwndarts = 0;
  darts.map(round => {
    round.map((dart: noIdDart) => {
      throwndarts = throwndarts + 1;
    });
  });

  return throwndarts;
};

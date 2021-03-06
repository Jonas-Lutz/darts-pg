export default (points: number, rounds: number) => {
  if (rounds === 0) return "0.0";
  return (points / rounds).toFixed(1);
};

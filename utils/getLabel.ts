export const getLabel = (multiplier: number) => {
  let label = "";
  switch (multiplier) {
    case 3:
      label = "T";
      break;
    case 2:
      label = "D";
      break;
    default:
      break;
  }
  return label;
};

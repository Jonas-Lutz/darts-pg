export const calculateFinish = score => {
  const finishes = [
    { score: 170, finish: ["T20", "T20", "D25"] },
    { score: 167, finish: ["T20", "T19", "D25"] },
    { score: 164, finish: ["T20", "T18", "D25"] },
    { score: 161, finish: ["T20", "T17", "D25"] },
    { score: 160, finish: ["T20", "T20", "D20"] },
    { score: 158, finish: ["T20", "T20", "D19"] },
    { score: 157, finish: ["T20", "T19", "D20"] },
    { score: 156, finish: ["T20", "T20", "D18"] },
    { score: 154, finish: ["T20", "T18", "D20"] },
    { score: 153, finish: ["T20", "T19", "D18"] },
    { score: 152, finish: ["T20", "T20", "D16"] },
    { score: 151, finish: ["T20", "T17", "D20"] },
    { score: 150, finish: ["T20", "T18", "D18"] },
    { score: 149, finish: ["T20", "T19", "D16"] },
    { score: 148, finish: ["T20", "T16", "D20"] },
    { score: 147, finish: ["T20", "T17", "D18"] },
    { score: 146, finish: ["T20", "T18", "D16"] },
    { score: 145, finish: ["T20", "T15", "D20"] },
    { score: 144, finish: ["T20", "T20", "D12"] },
    { score: 143, finish: ["T20", "T17", "D16"] },
    { score: 142, finish: ["T20", "T14", "D20"] },
    { score: 141, finish: ["T20", "T19", "D12"] },
    { score: 140, finish: ["T20", "T16", "D16"] },
    { score: 139, finish: ["T19", "T14", "D20"] },
    { score: 138, finish: ["T20", "T18", "D12"] },
    { score: 137, finish: ["T19", "T16", "D16"] },
    { score: 136, finish: ["T20", "T20", "D8"] },
    { score: 135, finish: ["T20", "T17", "D12"] },
    { score: 134, finish: ["T20", "T14", "D16"] },
    { score: 133, finish: ["T20", "T19", "D8"] },
    { score: 132, finish: ["T20", "T16", "D12"] },
    { score: 131, finish: ["T20", "T13", "D16"] },
    { score: 130, finish: ["T20", "T20", "D5"] },
    { score: 129, finish: ["T19", "T16", "D12"] },
    { score: 128, finish: ["T18", "T14", "D16"] },
    { score: 127, finish: ["T20", "T17", "D8"] },
    { score: 126, finish: ["T19", "T19", "D6"] },
    { score: 125, finish: ["25", "T20", "D20"] },
    { score: 124, finish: ["T20", "T16", "D8"] },
    { score: 123, finish: ["T19", "T16", "D9"] },
    { score: 122, finish: ["T18", "T20", "D4"] },
    { score: 121, finish: ["T17", "T10", "D20"] },
    { score: 120, finish: ["T20", "20", "D20"] },
    { score: 119, finish: ["T19", "T10", "D16"] },
    { score: 118, finish: ["T20", "18", "D20"] },
    { score: 117, finish: ["T20", "17", "D20"] },
    { score: 116, finish: ["T20", "16", "D20"] },
    { score: 115, finish: ["T20", "15", "D20"] },
    { score: 114, finish: ["T20", "14", "D20"] },
    { score: 113, finish: ["T20", "13", "D20"] },
    { score: 112, finish: ["T20", "12", "D20"] },
    { score: 111, finish: ["T20", "19", "D16"] },
    { score: 110, finish: ["T20", "18", "D16"] },
    { score: 109, finish: ["T19", "20", "D16"] },
    { score: 108, finish: ["T20", "16", "D16"] },
    { score: 107, finish: ["T19", "18", "D16"] },
    { score: 106, finish: ["T20", "14", "D16"] },
    { score: 105, finish: ["T19", "16", "D16"] },
    { score: 104, finish: ["T18", "18", "D16"] },
    { score: 103, finish: ["T20", "3", "D20"] },
    { score: 102, finish: ["T20", "10", "D16"] },
    { score: 101, finish: ["T20", "1", "D20"] },
    { score: 100, finish: ["T20", "D20"] },
    { score: 99, finish: ["T19", "10", "D16"] },
    { score: 98, finish: ["T20", "D19"] },
    { score: 97, finish: ["T19", "D20"] },
    { score: 96, finish: ["T20", "D18"] },
    { score: 95, finish: ["T19", "D19"] },
    { score: 94, finish: ["T18", "D20"] },
    { score: 93, finish: ["T19", "D18"] },
    { score: 92, finish: ["T20", "D16"] },
    { score: 91, finish: ["T17", "D20"] },
    { score: 90, finish: ["T20", "D15"] },
    { score: 89, finish: ["T19", "D16"] },
    { score: 88, finish: ["T16", "D20"] },
    { score: 87, finish: ["T17", "D18"] },
    { score: 86, finish: ["T18", "D16"] },
    { score: 85, finish: ["T15", "D20"] },
    { score: 84, finish: ["T20", "D12"] },
    { score: 83, finish: ["T17", "D16"] },
    { score: 82, finish: ["T14", "D20"] },
    { score: 81, finish: ["T19", "D12"] },
    { score: 80, finish: ["T20", "D10"] },
    { score: 79, finish: ["T19", "D11"] },
    { score: 78, finish: ["T18", "D12"] },
    { score: 77, finish: ["T19", "D10"] },
    { score: 76, finish: ["T20", "D8"] },
    { score: 75, finish: ["T17", "D12"] },
    { score: 74, finish: ["T14", "D16"] },
    { score: 73, finish: ["T19", "D8"] },
    { score: 72, finish: ["T16", "D12"] },
    { score: 71, finish: ["T13", "D16"] },
    { score: 70, finish: ["T10", "D20"] },
    { score: 69, finish: ["T15", "D12"] },
    { score: 68, finish: ["T20", "D4"] },
    { score: 67, finish: ["T17", "D8"] },
    { score: 66, finish: ["T10", "D18"] },
    { score: 65, finish: ["T19", "D4"] },
    { score: 64, finish: ["T16", "D8"] },
    { score: 63, finish: ["T13", "D12"] },
    { score: 62, finish: ["T10", "D16"] },
    { score: 61, finish: ["T15", "D8"] },
    { score: 60, finish: ["20", "D20"] },
    // Custom
    { score: 59, finish: ["19", "D20"] },
    { score: 58, finish: ["18", "D20"] },
    { score: 57, finish: ["17", "D20"] },
    { score: 56, finish: ["16", "D20"] },
    { score: 55, finish: ["15", "D20"] },
    { score: 54, finish: ["14", "D20"] },
    { score: 53, finish: ["13", "D20"] },
    { score: 52, finish: ["20", "D16"] },
    { score: 51, finish: ["19", "D16"] },
    { score: 50, finish: ["18", "D16"] },
    { score: 49, finish: ["17", "D16"] },
    { score: 48, finish: ["16", "D16"] },
    { score: 47, finish: ["15", "D16"] },
    { score: 46, finish: ["14", "D16"] },
    { score: 45, finish: ["13", "D16"] },
    { score: 44, finish: ["12", "D16"] },
    { score: 43, finish: ["11", "D16"] },
    { score: 42, finish: ["10", "D16"] },
    { score: 41, finish: ["9", "D16"] },
    { score: 40, finish: ["D20"] },
    { score: 39, finish: ["7", "D16"] },
    { score: 38, finish: ["D19"] },
    { score: 37, finish: ["5", "D16"] },
    { score: 36, finish: ["D18"] },
    { score: 35, finish: ["3", "D16"] },
    { score: 34, finish: ["D17"] },
    { score: 33, finish: ["17", "D8"] },
    { score: 32, finish: ["D16"] },
    { score: 31, finish: ["7", "D12"] },
    { score: 30, finish: ["D15"] },
    { score: 29, finish: ["5", "D12"] },
    { score: 28, finish: ["D14", ""] },
    { score: 27, finish: ["3", "D12"] },
    { score: 26, finish: ["D13"] },
    { score: 25, finish: ["9", "D8"] },
    { score: 24, finish: ["D12"] },
    { score: 23, finish: ["7", "D8"] },
    { score: 22, finish: ["D11"] },
    { score: 21, finish: ["5", "D8"] },
    { score: 20, finish: ["D10"] },
    { score: 19, finish: ["3", "D8"] },
    { score: 18, finish: ["D9", ""] },
    { score: 17, finish: ["1", "D8"] },
    { score: 16, finish: ["D8"] },
    { score: 15, finish: ["7", "D4"] },
    { score: 14, finish: ["D7"] },
    { score: 13, finish: ["5", "D4"] },
    { score: 12, finish: ["D6"] },
    { score: 11, finish: ["3", "D4"] },
    { score: 10, finish: ["D5"] },
    { score: 9, finish: ["5", "D2"] },
    { score: 8, finish: ["D4"] },
    { score: 7, finish: ["3", "D2"] },
    { score: 6, finish: ["D3"] },
    { score: 5, finish: ["1", "D2"] },
    { score: 4, finish: ["D2"] },
    { score: 3, finish: ["1", "D1"] },
    { score: 2, finish: ["D1"] }
  ];

  let wayOut = finishes.find(f => f.score === score);
  if (wayOut && wayOut.finish) {
    return wayOut.finish;
  }
  return [];
};

import React, { FC, useEffect, useState } from "react";
import AnimateNumber from "react-native-animate-number";

// ================================================================================================
// Props:
interface Props {
  style: React.CSSProperties;
  value: number;
}

// ================================================================================================

const AnimatedNumber: FC<Props> = ({ style, value }) => {
  return (
    <AnimateNumber
      formatter={(val: number) => {
        return val.toFixed(0);
      }}
      interval={5}
      steps={10}
      timing="easeOut"
      style={style}
      value={value}
    />
  );
};

export default AnimatedNumber;

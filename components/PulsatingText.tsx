import React, { FC, useCallback, useEffect, useState } from "react";
import { Animated } from "react-native";

interface Props {
  runAnimation: boolean;
  styles: React.CSSProperties;
  text: string;
}

const PulsatingText: FC<Props> = ({ runAnimation, styles, text }) => {
  const [zoom] = useState(new Animated.Value(1));
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (runAnimation) {
      if (!isAnimating) {
        animate();
      }
    }
  }, [isAnimating, runAnimation]);

  // Run the animation (once)
  const animate = () => {
    setIsAnimating(true);
    Animated.sequence([
      Animated.timing(zoom, {
        toValue: 1.3,
        duration: 700
      }),
      Animated.timing(zoom, {
        toValue: 1,
        duration: 700
      })
    ]).start(() => {
      setIsAnimating(false);
    });
  };

  // Clean up
  useEffect(() => {
    return () => {
      zoom.stopAnimation();
    };
  }, []);

  return (
    <Animated.Text
      style={{
        ...styles,
        transform: [{ scale: zoom }]
      }}
    >
      {text}
    </Animated.Text>
  );
};

export default PulsatingText;

import { Dimensions } from "react-native";

export const getDeviceWidth = () => {
  return Dimensions.get("window").width;
};

export const getDeviceHeight = () => {
  return Dimensions.get("window").height;
};

/**
 * Is device next gen device with raised height (aspect ratio 18:9)?
 * E.g. IPhone X or Pixel 2
 */
export const raisedScreenHeight = () => {
  return getDeviceWidth() >= 375 && getDeviceHeight() / getDeviceWidth() >= 2;
};

/**
 * Iphone SE & Co.
 */
export const smallScreen = () => {
  return getDeviceWidth() < 345;
};

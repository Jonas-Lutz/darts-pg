import { createStackNavigator, createAppContainer } from "react-navigation";

// Screens:

// 101:
import OneOOneSettings from "../screens/101/settings";
import OneOOne from "../screens/101";

// 99X:
import NineNineX from "../screens/99X";
import NineNineXSettings from "../screens/99X/settings";
import NineNineXStats from "../screens/99X/stats";

// CricketCountUp:
import CricketCountUp from "../screens/CricketCountUp";

// Home:
import HomeScreen from "../screens/Home";

const AppNavigator = createStackNavigator(
  {
    CricketCountUp: CricketCountUp,
    Home: HomeScreen,
    NineNineX: NineNineX,
    NineNineXSettings: NineNineXSettings,
    NineNineXStats: NineNineXStats,
    OneOOne: OneOOne,
    OneOOneSettings: OneOOneSettings
  },
  {
    initialRouteName: "Home"
  }
);

export default createAppContainer(AppNavigator);

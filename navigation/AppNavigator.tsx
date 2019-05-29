import { createStackNavigator, createAppContainer } from "react-navigation";

// Screens:

// 101:
import OneOOneSettings from "screens/101/settings";
import OneOOne from "screens/101";

// 99X:
import NineNineX from "screens/99X";
import NineNineXSettings from "screens/99X/settings";
import NineNineXStats from "screens/99X/stats";

// Bob' 27:
import Bobs from "screens/Bobs";

// CricketCountUp:
import CricketCountUp from "screens/CricketCountUp";

// Shanghai:
import Shanghai from "screens/Shanghai";

// Home:
import HomeScreen from "screens/Home";

const AppNavigator = createStackNavigator(
  {
    Bobs,
    CricketCountUp,
    Home: HomeScreen,
    NineNineX,
    NineNineXSettings,
    NineNineXStats,
    OneOOne,
    OneOOneSettings,
    Shanghai
  },
  {
    initialRouteName: "Home"
  }
);

export default createAppContainer(AppNavigator);

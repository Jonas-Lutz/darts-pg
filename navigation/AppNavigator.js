import { createStackNavigator, createAppContainer } from "react-navigation";

// Screens:

// 101:
import OneOOneSettings from "mydarts/screens/101/settings";
import OneOOne from "mydarts/screens/101";

// 99X:
import NineNineX from "mydarts/screens/99X";
import NineNineXSettings from "mydarts/screens/99X/settings";
import NineNineXStats from "mydarts/screens/99X/stats";

// Bob' 27:
import Bobs from "mydarts/screens/Bobs";

// CricketCountUp:
import CricketCountUp from "mydarts/screens/CricketCountUp";

// Shanghai:
import Shanghai from "mydarts/screens/Shanghai";

// Home:
import HomeScreen from "mydarts/screens/Home";

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

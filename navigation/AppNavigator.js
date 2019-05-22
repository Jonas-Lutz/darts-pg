import { createStackNavigator, createAppContainer } from "react-navigation";

// Screens:

// 101:
import OneOOneSettings from "mydarts/screens/101/settings";
import OneOOne from "mydarts/screens/101";

// 99X:
import NineNineX from "mydarts/screens/99X";
import NineNineXSettings from "mydarts/screens/99X/settings";
import NineNineXStats from "mydarts/screens/99X/stats";

// CricketCountUp:
import CricketCountUp from "mydarts/screens/CricketCountUp";

// Home:
import HomeScreen from "mydarts/screens/Home";

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

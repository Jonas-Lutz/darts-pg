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

// Cricket:
import Cricket from "screens/Cricket";

// CricketCountUp:
import CricketCountUp from "screens/CricketCountUp";

// Cricket Cut Throat
import CricketCutThroat from "screens/CricketCutThroat";

// Home:
import HomeScreen from "screens/Home";

// Multiplayer:
import Multiplayer from "screens/Multiplayer";

// PlayerSelection:
import PlayerSelection from "screens/PlayerSelection";

// Settings:
import Settings from "screens/Settings";

// Shanghai:
import Shanghai from "screens/Shanghai";

// Singleplayer:
import Singleplayer from "screens/Singleplayer";

// Stats:
import Stats from "screens/Stats";

// X01:
import X01 from "screens/X01";

const AppNavigator = createStackNavigator(
  {
    Bobs,
    Cricket,
    CricketCutThroat,
    CricketCountUp,
    Home: HomeScreen,
    Multiplayer,
    NineNineX,
    NineNineXSettings,
    NineNineXStats,
    OneOOne,
    OneOOneSettings,
    PlayerSelection,
    Settings,
    Shanghai,
    Singleplayer,
    Stats,
    X01
  },
  {
    initialRouteName: "Home"
  }
);

export default createAppContainer(AppNavigator);

import { createStackNavigator, createAppContainer } from "react-navigation";

// Screens:

// 99X:
import NineNineX from "../screens/99X";

// Home:
import HomeScreen from "../screens/Home";

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    NineNineX: NineNineX
  },
  {
    initialRouteName: "NineNineX"
  }
);

export default createAppContainer(AppNavigator);

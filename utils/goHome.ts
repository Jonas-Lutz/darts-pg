import {
  StackActions,
  NavigationActions,
  NavigationParams
} from "react-navigation";

const goHome = (navigation: NavigationParams) => {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: "Home"
      })
    ]
  });

  navigation.dispatch(resetAction);
};

export default goHome;

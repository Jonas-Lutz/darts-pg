import { StackActions, NavigationActions } from "react-navigation";

const goHome = (nav: any) => {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: "Home"
      })
    ]
  });

  nav.dispatch(resetAction);
};

export default goHome;

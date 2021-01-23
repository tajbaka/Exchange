import { NavigationActions, StackActions, NavigationResetActionPayload } from 'react-navigation';

let _navigator: any;

function setTopLevelNavigator(navigatorRef: any) {
  _navigator = navigatorRef;
}

function navigate(routeName: any, params: any) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function reset(options: NavigationResetActionPayload) {
  _navigator.dispatch(
    StackActions.reset(
      options
    )
  );
}

// add other navigation functions that you need and export them

export default {
  navigate,
  reset,
  setTopLevelNavigator,
};
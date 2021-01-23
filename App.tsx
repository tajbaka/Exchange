import React from 'react';
import { StatusBar, AppState } from 'react-native';
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Landing, CreateAccount, CreateAccountPassword, ProfileDetailed, ForgotPassword, SignIn, Password, ChatBasic, ChatDetailed, SetSpokenLanguage, SetLearningLanguage, AccountSettings, SetName, SetDescription, CreateMessage, SetPhotos, ViewPhotos } from './src/containers';
import NavigationService from './NavigationService';
import { authActions, createAxiosInstance, accountSettingsActions } from './src/actions';
import { Platform } from 'react-native';
import reducers from "./src/reducers/";

export default class App extends React.Component<{}, {}> {
  private store: any;
  private detailedChatId: any;
  private onMessage: any;
  private onNavigationStateChange: any

  constructor(props: any){
    super(props);
    console.disableYellowBox = true;
    createAxiosInstance();
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  async checkPermission() {
    messaging().hasPermission().then((enabled: any) => {
      if (enabled) {
        console.log("Permission granted");
        setTimeout(() => {
          messaging().getInitialNotification().then((remoteMessage: any) => {
            console.log('get init notif', remoteMessage);
            let clickAction;
    
            if(Platform.OS === 'android' && remoteMessage && remoteMessage.notification && remoteMessage.notification.android){
              clickAction = remoteMessage.notification.android.clickAction;
            }
            else {
              clickAction = remoteMessage.category;
            }
    
            if (remoteMessage) {
              const { data } = remoteMessage;
              this.store.dispatch(authActions.onDirectPushNotification(data, clickAction));
            }
          });
        }, 100);
      } else {
        console.log("Request Permission");
        this.requestPermission();
      }
    });
  }

  async requestPermission() {
    messaging().requestPermission()
      .then(() => {
        console.log("Permission granted");
      })
      .catch(error => {
        console.log('permission rejected');
      });
  }

  public componentWillMount(){
    this.checkPermission();
    this.store = createStore(reducers, {}, applyMiddleware(thunkMiddleware));
  }

  public componentDidMount() {
    changeNavigationBarColor('white', true, false);

    AppState.addEventListener('change', this.handleAppStateChange);

    this.onMessage = messaging().onMessage(remoteMessage => {
      if (remoteMessage) {
      console.log('on foreground', remoteMessage);
      const { data } = remoteMessage;
      const title = (remoteMessage as any).data.title;
      const message = (remoteMessage as any).data.content;
      const id: string = (remoteMessage as any).data.id;
      const shortID: string = (remoteMessage as any).data.shortId;
      let clickAction;

      if(Platform.OS === 'android' && remoteMessage && remoteMessage.notification && remoteMessage.notification.android){
        clickAction = remoteMessage.notification.android.clickAction;
      }
      else{
        clickAction = remoteMessage.category;
      }

      if(this.detailedChatId !== id && clickAction === 'message'){
          PushNotification.localNotification({
            id: shortID,
            title,
            message,
            largeIcon: '',
            smallIcon: 'ic_notification',
            visibility: 'public',
            importance: 'max',
            color: "#007aff",
            userInfo: {
              id: shortID,
            }
          });
      }

      this.store.dispatch(authActions.onAddToNotificationQueue(data));

      }
    });

    //opened from background state but app closed
    
    this.onNavigationStateChange = (prevNavigationState: any, nextNavigationState: any, action: any) => {
      const routes = nextNavigationState.routes[0].routes;
      const route = routes[routes.length - 1];
      if(route.routeName === 'ChatDetailed'){
        this.detailedChatId = route.params.id;
      }
      else {
        this.detailedChatId = null;
      }
    }
  }

  public componentWillUnmount() {
    this.onMessage();
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  public render() {
    return (
      <SafeAreaProvider>
        <Provider store={this.store as any}>
          <React.Fragment>
            <StatusBar barStyle="dark-content" hidden={false} translucent={false} backgroundColor="white" />
            <AppContainer
              ref={(navigatorRef: any) => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
              onNavigationStateChange={(prevNavigationState, nextNavigationState, action) => this.onNavigationStateChange(prevNavigationState, nextNavigationState, action)}
            />
          </React.Fragment>
        </Provider>
      </SafeAreaProvider>
    );
  }

  private handleAppStateChange(nextAppState: string){
    this.store.dispatch(accountSettingsActions.onChangeAppState(nextAppState));
  }
}

const AuthenticationNavigator = createStackNavigator({
  Landing,
  SignIn,
  CreateAccountPassword,
  CreateAccount,
  Password,
  ForgotPassword,
  ChatBasic,
  ChatDetailed,
  ProfileDetailed,
  SetName,
  SetDescription,
  SetPhotos,
  ViewPhotos,
  SetSpokenLanguage,
  SetLearningLanguage,
  AccountSettings,
  CreateMessage
},
{
  defaultNavigationOptions: {
    gesturesEnabled: false
  },
  navigationOptions: {
    gesturesEnabled: false
  }
});

const AppNavigator = createSwitchNavigator({
  Auth: AuthenticationNavigator
});

const AppContainer = createAppContainer(AppNavigator);
import { checkIfAccountExists, setCreateAccountPassword, addToNotificationQueue, openLocalNotification, createAccount, directPushNotification, logoutUser, backAction, loginUser, nextAction, resetPassword, passwordChanged, usernameChanged } from './auth-api';

export const onUsernameChanged = (value: string) => {
  return (dispatch: any) => {
    usernameChanged({ dispatch, value });
  };
};

export const onPasswordChanged = (value: string) => {
  return (dispatch: any) => {
    passwordChanged({ dispatch, value });
  };
};

export const onLoginUser = (navigation: any, userUid?: string) => {
  return (dispatch: any, getState: any) => {
    const state = getState();
    const { auth, accountSettings } = state;
    const { usernameValue, passwordValue } = auth;
    const { spokenLanguage } = accountSettings
    loginUser({ dispatch, usernameValue, passwordValue, navigation, userUid, spokenLanguage });
  };
};

export const onLogoutUser = (navigation: any) => {
  return (dispatch: any) => {
    logoutUser({ navigation, dispatch });
  };
};

export const onSetCreateAccountPassword = (navigation: any) => {
  return (dispatch: any, getState: any) => {
    const state = getState();
    const { auth, accountSettings } = state;
    const { passwordValue } = auth;
    const { spokenLanguage } = accountSettings;
    setCreateAccountPassword({ passwordValue, navigation, dispatch, spokenLanguage });
  };
};

export const onCreateAccount = (navigation: any) => {
  return (dispatch: any, getState: any) => {
    const state = getState();
    const { auth, accountSettings } = state;
    const { usernameValue, passwordValue } = auth;
    const { spokenLanguage } = accountSettings;
    createAccount({ dispatch, usernameValue, passwordValue, navigation, spokenLanguage });
  };
};

export const onDirectPushNotification = (data: any, clickAction: string) => {
  return (dispatch: any) => {
    directPushNotification({ clickAction, data, dispatch });
  };
};

export const onResetPassword = (navigation: any) => {
  return (dispatch: any, getState: any) => {
    const auth = getState().auth;
    const { usernameValue } = auth;
    resetPassword({ dispatch, usernameValue, navigation });
  };
};

export const onNextAction = (navigation: any) => {
  return (dispatch: any, getState: any) => {
    const state = getState();
    const { auth } = state;
    const { usernameValue } = auth;
    nextAction({ dispatch, usernameValue, navigation });
  };
};

export const onBackAction = (navigation: any) => {
  return (dispatch: any) => {
    backAction({ dispatch, navigation });
  };
};

export const onAddToNotificationQueue = (data: any) => {
  return (dispatch: any) => {
    addToNotificationQueue({ data });
  };
};

export const onOpenLocalNotification = (notification: any, navigation: any) => {
  return (dispatch: any, getState: any) => {
    const state = getState();
    const { accountSettings } = state;
    const { images } = accountSettings;
    openLocalNotification({ images, notification, navigation });
  };
};

export const onCheckIfAccountExists = (navigation: any) => {
  return (dispatch: any, getState: any) => {
    const state = getState();
    const { auth } = state;
    const { usernameValue } = auth;
    checkIfAccountExists({ dispatch, usernameValue, navigation });
  };
};
import { validateEmail, validatePassword } from "../";

import { NavigationActions } from 'react-navigation';

import { updateData } from '../global/global-api';

import moment from "moment";

import Mixpanel from 'react-native-mixpanel';

import { Platform } from 'react-native';

import auth from '@react-native-firebase/auth';

import { authLanguages } from './languages';

import { UPDATE_TAB, UPDATE_SELECTED_START_DATE_NOTIFIED } from '../';

import { axiosInstance } from '../common';

import {
    CREATE_USER_SUCCESS,
    LOGIN_USER_SUCCESS,
    RESET_PASSWORD_SUCCESS,
    PASSWORD_CHANGED,
    USERNAME_CHANGED,
    LOGOUT_USER_SUCCESS
} from "../";

import { formatLanguages } from '../general-functions';

import { UPDATE_ERROR, UPDATE_LOADING } from '../';
import { UPDATE_NAVIGATION_BAR_COLOR } from "../global";

export const usernameChanged = (ref: any) => {
    const { dispatch, value } = ref;
    dispatch({ type: USERNAME_CHANGED, payload: value });
};

export const passwordChanged = (ref: any) => {
    const { dispatch, value } = ref;
    dispatch({ type: PASSWORD_CHANGED, payload: value });
};

export const nextAction = (ref: any) => {
    const { dispatch, usernameValue, navigation } = ref;
    const { navigate, state } = navigation;
    const routeName = state.routeName;
      if (validateEmail(usernameValue)) {
        dispatch({
            type: UPDATE_ERROR,
            payload: undefined
        });

        switch(routeName){
            case 'SignIn':
                Mixpanel.trackWithProperties("Sign In Next", { username: usernameValue });
                navigate('Password')
                break;
            case 'CreateAccount': 
                Mixpanel.trackWithProperties("Create Account Next", { username: usernameValue });
                navigate('CreateAccountPassword');
                break;
            default:
                break;
        }
      } 
    else {
        displayError(dispatch, "Enter a Valid Email");
        dispatch({ type: USERNAME_CHANGED, payload: '' });
    }
};

let notifDatas:Array<any> = [];

export const directPushNotification = (ref: any) => {
    const { clickAction, data, dispatch } = ref;
    if(clickAction === 'message'){
        Mixpanel.track("Opened Message");
        dispatch({ type: UPDATE_TAB, payload: 1 });
    }
    else if(clickAction.includes('journal') || clickAction.includes('test')){
        const { date } = data;
        Mixpanel.track("Opened Journal");
        dispatch({ type: UPDATE_NAVIGATION_BAR_COLOR, payload: 'white' });
        dispatch({ type: UPDATE_SELECTED_START_DATE_NOTIFIED, payload: date });
        dispatch({ type: UPDATE_TAB, payload: 2 });
    }
};

export const addToNotificationQueue = (ref: any) => {
    const { data } = ref;
    notifDatas.push(data);
};

export const openLocalNotification = (ref: any) => {
    const { notification, navigation, images } = ref;
    for(let i = 0; i < notifDatas.length; i++){
        const data = notifDatas[i];
        let id;
        
        if(Platform.OS === 'android'){
            id = notification.id
        }
        else {
            id = notification.data.id;
        }

        if (id === data.shortId) {
            console.log('here3')
            notifDatas.splice(i, 1);
            const { id, name } = data;
            let { otherUsersSettings } = data;
            otherUsersSettings = JSON.parse(otherUsersSettings);
            const otherUsersImages = otherUsersSettings.images;

            let otherUserPrimaryPhoto;
            let primaryPhoto;

            if(images){
                for(let i = 0; i < images.length; i++){
                    const image = images[i];
                    if(image.primary){
                        primaryPhoto = image;
                        break;
                    }
                }
            }

            if(otherUsersImages){
                for(let i = 0; i < otherUsersImages.length; i++){
                    const image = otherUsersImages[i];
                    if(image.primary){
                        otherUserPrimaryPhoto = image;
                        break;
                    }
                }
            }
            
            Mixpanel.track("Notif Clicked Logging In");
            navigation.navigate({ routeName: 'ChatDetailed' , params: { title: name, id, otherUsersSettings, primaryPhoto, otherUserPrimaryPhoto }})
            break;
        }
    }
};

export const backAction = (ref: any) => {
    const { dispatch, navigation } = ref;
    const { state, pop } = navigation;
    const routeName = state.routeName;
    
    dispatch({
        type: UPDATE_ERROR,
        payload: undefined
    });

    switch(routeName){
        case 'Password': case 'CreateAccountPassword':
            dispatch({ type: PASSWORD_CHANGED, payload: '' });
            pop();
            break;
        case 'CreateAccount': case 'ForgotPassword': 
            dispatch({ type: USERNAME_CHANGED, payload: '' });
            pop();
            break;
        default:
            break;
    }
};

export const checkIfAccountExists = (ref: any) => {
    const { dispatch, usernameValue } = ref;
    if(usernameValue && usernameValue.length > 0){
        dispatch({ type: UPDATE_LOADING, payload: true });
        axiosInstance.post('/check-user-exists', { 
            usernameValue
        }).then((response: any) => {
            const exists = response.data;
            if(exists){
                const message = 'Username exists';
                dispatch({ type: USERNAME_CHANGED, payload: '' });
                displayError(dispatch, message);
            }
            else {
                nextAction(ref);
            }
        }).catch((error: any) => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            displayError(dispatch, error.message);
        });
    }
};

export const createAccount = (ref: any) => {
    const { dispatch, usernameValue, passwordValue, navigation, images, name, learningLanguage } = ref;
    let { spokenLanguage } = ref;
      if (passwordValue.length > 0 && validateEmail(usernameValue)) {
        dispatch({ type: UPDATE_LOADING, payload: true });
        Mixpanel.trackWithProperties("Creating Account", { username: usernameValue });
        auth().createUserWithEmailAndPassword(usernameValue.trim(), passwordValue).then((authToken: any) => {
            const userUid = authToken.user.uid;
            if(spokenLanguage === undefined){
                spokenLanguage = 'en';
            }
            else {
                spokenLanguage = formatLanguages(spokenLanguage);
            }
            const createdOn = moment().unix();
            
            axiosInstance.post('/create-account', {
                name,
                spokenLanguage,
                learningLanguage,
                userUid,
                images,
                email: usernameValue,
                createdOn
            }).then((response: any) => {
                const userUid = response.data;
                updateData(userUid, dispatch);
                navigation.reset([NavigationActions.navigate({ routeName: 'ChatBasic' })], 0);
                dispatch({ type: CREATE_USER_SUCCESS, payload: userUid });
                dispatch({ type: UPDATE_LOADING, payload: false });
            }).catch((error: any) => {
                dispatch({ type: UPDATE_LOADING, payload: false });
                displayError(dispatch, error.message);
            });
        }).catch((error: any) => {
            dispatch({ type: UPDATE_LOADING, payload: false });
            displayError(dispatch, error.message);
        });
      } else if(passwordValue.length < 6) {
        displayError(dispatch, "Enter a password longer than 5 characters");
      }
      else if(!validateEmail(usernameValue)){
        displayError(dispatch, "Enter a valid Email");
      }
};

export const setCreateAccountPassword = (ref: any) => {
    const { dispatch, passwordValue, navigation, spokenLanguage } = ref;

    if(validatePassword(passwordValue)) {
        // navigation.navigate('SetName');
        navigation.navigate('SetSpokenLanguage');
    }
    else {
        const languageContent = authLanguages[spokenLanguage as any];
        const error = languageContent.passwordError;
        displayError(dispatch, error);
    }
};

export const loginUser = (ref: any) => {
    const { dispatch, usernameValue, passwordValue, spokenLanguage, navigation, userUid } = ref;

        // setTimeout(() => {
        //     if(openedNotif !== null)  {
        //         const { id, name } = openedNotif;
        //         let { otherUsersSettings } = openedNotif;
        //         otherUsersSettings = JSON.parse(otherUsersSettings);
        //         const otherUsersImages = otherUsersSettings.images;
        //         let otherUserPrimaryPhoto;
        //         let primaryPhoto;
        //         if(images){
        //             for(let i = 0; i < images.length; i++){
        //                 const image = images[i];
        //                 if(image.primary){
        //                     primaryPhoto = image;
        //                     break;
        //                 }
        //             }
        //         }
        //         if(otherUsersImages){
        //             for(let i = 0; i < otherUsersImages.length; i++){
        //                 const image = otherUsersImages[i];
        //                 if(image.primary){
        //                     otherUserPrimaryPhoto = image;
        //                     break;
        //                 }
        //             }
        //         }

        //         Mixpanel.trackWithProperties("Notif Clicked Logging In", { username: usernameValue, userUid });
        //         navigation.navigate({ routeName: 'ChatDetailed' , params: { title: name, id, otherUsersSettings, primaryPhoto, otherUserPrimaryPhoto }});
        //         openedNotif = null;
        //     }
        // }, 0);

        if(userUid){
            const lastLogin = moment().unix();
            axiosInstance.post('/login', { 
                userUid,
                lastLogin
            });
        }

        if (passwordValue.length > 0 && validateEmail(usernameValue) && userUid === undefined) {
            dispatch({ type: UPDATE_LOADING, payload: true });
            Mixpanel.trackWithProperties("Logging In", { username: usernameValue, userUid });
            auth().signInWithEmailAndPassword(usernameValue.trim(), passwordValue).then((authToken: any) => {
                const userUid = authToken.user.uid;
                updateData(userUid, dispatch);
                navigation.reset([NavigationActions.navigate({ routeName: 'ChatBasic' })], 0);
                dispatch({ type: UPDATE_LOADING, payload: false });
                dispatch({ type: LOGIN_USER_SUCCESS, payload: userUid });
            }).catch((error: any) => {
                dispatch({ type: UPDATE_LOADING, payload: false });
                const languageContent = authLanguages[spokenLanguage as any];
                const errorMessage = languageContent.passwordWrongError;
                dispatch({ type: PASSWORD_CHANGED, payload: '' });
                displayError(dispatch, errorMessage);
            });
        }
        else if(userUid !== undefined){
            updateData(userUid, dispatch);
            Mixpanel.trackWithProperties("Auto Logging In", { username: usernameValue, userUid });
            navigation.reset([NavigationActions.navigate({ routeName: 'ChatBasic' })], 0);
            dispatch({ type: LOGIN_USER_SUCCESS, payload: userUid });
           
        }
        else if(passwordValue.length === 0) {
            displayError(dispatch, "Enter a valid Password");
        }
        else if(!validateEmail(usernameValue)){
            displayError(dispatch, "Enter a valid Email");
        }
};

const displayError = (dispatch: any, error: string) => {
    dispatch({
        type: UPDATE_ERROR,
        payload: error
    });
    dispatch({ type: PASSWORD_CHANGED, payload: '' });
};

export const logoutUser = (ref: any) => {
    const { dispatch } = ref;
    auth().signOut();
    dispatch({ type: LOGOUT_USER_SUCCESS, payload: undefined });
};

export const resetPassword = (ref: any) => {
    const { dispatch, usernameValue } = ref;
    dispatch({ type: UPDATE_LOADING, payload: true });
    if (validateEmail(usernameValue)) {
    auth().sendPasswordResetEmail(usernameValue).then((event: any) => {
        dispatch({
            type: RESET_PASSWORD_SUCCESS
        });
        }).catch((error: any) => {
        displayError(dispatch, error.message);
        });
    } else {
    displayError(dispatch, "Enter a valid Email");
    }
};
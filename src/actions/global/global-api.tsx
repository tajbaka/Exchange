

import { globalActionsLanguages } from './languages';
import { axiosInstance } from '../common';

import { Alert, BackHandler, Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

import { UPDATE_CHAT_LIST, UPDATE_ACCOUNT_SETTINGS, UPDATE_LOADING, UPDATE_CHAT_LAST_USERUID, UPDATE_USER_AGREEMENT } from '../';
import { UPDATE_JOURNAL_LIST } from '../journal';
import { UPDATE_NAVIGATION_BAR_COLOR } from './types';

import database from '@react-native-firebase/database';

export const updateData = (userUid: string, dispatch: any) => {
    const dbRef = database().ref(`/users/${userUid}`);
    
    dbRef.on('value', (snapshot: any) => {
        let data = snapshot.val();
        if(data !== null && data !== undefined){
            const { accountSettings, lastUserUid } = data;
            const { blockedUsers, acceptedUserAgreement } = accountSettings;
            if(blockedUsers === undefined || blockedUsers === null){
                accountSettings.blockedUsers = [];
            }
            if(acceptedUserAgreement === undefined || acceptedUserAgreement === undefined){
                accountSettings.acceptedUserAgreement = false;
            }

            dispatch({ type: UPDATE_CHAT_LAST_USERUID, payload: lastUserUid });
            dispatch({ type: UPDATE_ACCOUNT_SETTINGS, payload: JSON.parse(JSON.stringify(accountSettings)) });

            let { journalList } = data;
            if(journalList !== undefined){
                const revisedJournalList: Array<any> = [];
                Object.keys(journalList).forEach((key) => {
                    revisedJournalList.push(journalList[key]);
                });

                for(let i = 0; i < revisedJournalList.length; i++){
                    const list = revisedJournalList[i].list;
                    const revisedJournalItemList: Array<any> = [];
                    Object.keys(list).forEach((key) => {
                        revisedJournalItemList.push(list[key]);
                    });
                    revisedJournalList[i].list = list;
                };
                dispatch({ type: UPDATE_JOURNAL_LIST, payload: revisedJournalList });
            }
            else {
                dispatch({ type: UPDATE_JOURNAL_LIST, payload: [] });
            }

            let { chatList } = data;
            if(chatList !== undefined){
                const revisedChatList: Array<any> = [];
                Object.keys(chatList).forEach((key) => {
                    if(chatList[key] !== null){
                        revisedChatList.push(chatList[key]);
                    }
                });

                for(let i = 0; i < revisedChatList.length; i++){
                    const detailedChatList = revisedChatList[i].detailedChatList;
                    const revisedDetailChatList: Array<any> = [];
                    Object.keys(detailedChatList).forEach((key) => {
                        revisedDetailChatList.push(detailedChatList[key]);
                    });
                    revisedChatList[i].detailedChatList = revisedDetailChatList;
                };

                dispatch({ type: UPDATE_CHAT_LIST, payload: revisedChatList });
            }
            else {
                dispatch({ type: UPDATE_CHAT_LIST, payload: [] });
            }
        }
    }); 
}

export const setLoading = (ref: any) => {
    const { dispatch, loading } = ref;
    dispatch({ type: UPDATE_LOADING, payload: loading });
};

export const updateNavigationBarColor = (ref: any) => {
    const { dispatch, navigationBarColor } = ref;
    dispatch({ type: UPDATE_NAVIGATION_BAR_COLOR, payload: navigationBarColor });
};

export const checkAppVersion = (ref: any) => {
    const { spokenLanguage } = ref;
    const platform = Platform.OS;

    axiosInstance.post('/get-app-version', { platform }).then((response: any) => {
        const newVersion = parseFloat(response.data);
        const currentVersion = parseFloat(DeviceInfo.getVersion());
        if(newVersion > currentVersion){
            const languageContent = globalActionsLanguages[spokenLanguage as any];
            showAlerts(languageContent);
        }
    }).catch((error: any) => {
        console.log(error);
    });
};

const showAlerts = (languageContent: any) => {
    Alert.alert(
        languageContent.updateApplicationTitle,
        languageContent.updateApplicationMessage,
        [
            {
                text: languageContent.update,
                onPress: () => onUpdateAppPressed(languageContent)
            }
        ],
        { 
            cancelable: false
        }
    );
}

const onUpdateAppPressed = (languageContent: any) => {
    if(Platform.OS === 'android') {
        BackHandler.exitApp(); 
        Linking.openURL("market://details?id=com.exchange.messenger")
    }
    else {
        Linking.openURL('https://google.com');
        showAlerts(languageContent)
    }
}

export const getUserAgreement = (ref: any) => {
    const { dispatch }  = ref;
    axiosInstance.get('/get-user-agreement').then((res: any) => { 
        const userAgreement = res.data;
        dispatch({ type: UPDATE_USER_AGREEMENT, payload: userAgreement });
    }).catch(() => { 
        dispatch({ type: UPDATE_USER_AGREEMENT, payload: '' });
    });
}
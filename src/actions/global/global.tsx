
import { updateNavigationBarColor, checkAppVersion, setLoading, getUserAgreement } from './global-api';

export const onSetLoading = (loading: false) => {
    return (dispatch: any) => {
        setLoading({ dispatch, loading });
    };
};

export const onCheckAppVersion = () => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { accountSettings } = state;
        const { spokenLanguage } = accountSettings;
        checkAppVersion({ dispatch, spokenLanguage });
    };
};

export const onGetUserAgreement = () => {
    return (dispatch: any, getState: any) => {
        getUserAgreement({ dispatch });
    };
};

export const onUpdateNavigationBarColor = (navigationBarColor: string | null) => {
    return (dispatch: any) => {
        updateNavigationBarColor({ dispatch, navigationBarColor });
    };
};


export function timeConverter(timestamp: any){
    var a = new Date(timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }
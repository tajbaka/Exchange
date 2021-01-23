import { acceptUserAgreement, updateCoordinates, changeAppState, setPrimaryPhoto, updateAbout, updateLearningLanguage, updateImages, updateLocalSpokenLanguage, updateSpokenLanguage, updateName, updateFCMToken } from './account-settings-api';

export const onUpdateSpokenLanguage = (spokenLanguage: string, navigation?: any) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { accountSettings, auth } = state;
        const { userUid } = auth;
        const { spokenLanguage: oldSpokenLanguage } = accountSettings;
        updateSpokenLanguage({ dispatch, oldSpokenLanguage, spokenLanguage, userUid, accountSettings, navigation });
    };
};

export const onUpdateLearningLanguage = (learningLanguage?: string, navigation?: any) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { accountSettings, auth } = state;
        const { userUid } = auth;
        updateLearningLanguage({ dispatch, learningLanguage, userUid, accountSettings, navigation });
    };
};

export const onUpdateCoordinates = (coords: any) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { auth } = state;
        const { userUid } = auth;
        updateCoordinates({ coords, userUid });
    };
};

export const onUpdateLocalSpokenLanguage = (spokenLanguage: string) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { accountSettings } = state;
        updateLocalSpokenLanguage({ dispatch, accountSettings, spokenLanguage })
    };
};

export const onUpdateFCMToken = (fcmToken: string, userUid: string) => {
    return (dispatch: any) => {
        updateFCMToken({ dispatch, userUid, fcmToken });
    };
};

export const onUpdateName = (name?: string, navigation?: any) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { accountSettings, auth } = state;
        const { userUid } = auth;
        updateName({ dispatch, name, navigation, userUid, accountSettings });
    };
};

export const onUpdateAbout = (about?: string, navigation?: any) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { accountSettings, auth } = state;
        const { userUid } = auth;
        updateAbout({ dispatch, about, navigation, userUid, accountSettings });
    };
};

export const onUpdateImages = (images: Array<string>, navigation: any, firstTimeLogin: boolean) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { auth, accountSettings } = state;
        const { userUid, usernameValue, passwordValue } = auth;
        const { name, learningLanguage, spokenLanguage } = accountSettings;
        updateImages({ dispatch, images, userUid, navigation, firstTimeLogin, accountSettings, usernameValue, passwordValue, name, learningLanguage, spokenLanguage });
    };
};

export const onSetPrimaryPhoto = (images: any, index: number, navigation: any) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { accountSettings } = state;
        setPrimaryPhoto({ dispatch, images, index, accountSettings, navigation });
    };
};

export const onChangeAppState = (nextAppState: any) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { auth } = state;
        const { userUid } = auth;
        changeAppState({ nextAppState, userUid });
    };
};

export const onAcceptUserAgreement = () => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { auth } = state;
        const { userUid } = auth;
        acceptUserAgreement({ dispatch, userUid });
    };
};
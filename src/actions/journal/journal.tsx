import { dateChange, switchContent, updateSelectedStartDateNotified, play, stop, itemClick, changeText, changeTranslationText, sendMessage, sendVoiceMessage } from './journal-api';

export const onItemClick = (selectedStartDate: string, journalListItemId: string) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { journal, accountSettings, auth } = state;
        const { spokenLanguage, learningLanguage } = accountSettings;
        const { journalList } = journal;
        const { userUid } = auth;
        itemClick({ journalList, selectedStartDate, journalListItemId, dispatch, spokenLanguage, learningLanguage, userUid });
    };
};

export const onStop = (selectedStartDate: string, journalListItemId: string) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { journal } = state;
        const { journalList } = journal;
        stop({ dispatch, journalList, journalListItemId, selectedStartDate });
    };
};

export const onPlay = (selectedStartDate: string, journalListItemId: string, type: string) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { journal, accountSettings, auth } = state;
        const { learningLanguage, spokenLanguage } = accountSettings;
        const { userUid } = auth;
        const { journalList } = journal;
        play({ dispatch, userUid, journalList, selectedStartDate, journalListItemId, learningLanguage, spokenLanguage, type });
    };
};

export const onChangeText = (content: String) => {
    return (dispatch: any, getState: any) => {
        changeText({ content, dispatch });
    };
};

export const onChangeTranslationText = (value: string) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { journal, accountSettings, global } = state;
        const { spokenLanguage, learningLanguage } = accountSettings;
        const { loading } = global;
        const { isSwitched } = journal;
        changeTranslationText({ value,  dispatch, spokenLanguage, learningLanguage, loading, isSwitched });
    };
};

export const onSwitchContent = () => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { journal, auth } = state;
        const { translatedContent, content, isSwitched } = journal;
        const { userUid } = auth;
        switchContent({ dispatch, isSwitched, translatedContent, content, userUid });
    };
};

export const onSendMessage = (selectedStartDate: Date) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { auth, journal } = state;
        const { userUid } = auth;
        const { content, firstMessage } = journal;
        sendMessage({ content, dispatch, userUid, selectedStartDate, firstMessage });
    };
};

export const onSendVoiceMessage = (selectedStartDate: Date, voiceMessagePath: string) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { auth, journal } = state;
        const { userUid } = auth;
        const { content, firstMessage } = journal;
        sendVoiceMessage({ content, dispatch, userUid, selectedStartDate, voiceMessagePath, firstMessage });
    };
};

export const onDateChange = (selectedStartDate: Date) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { auth, journal, accountSettings } = state;
        const { spokenLanguage } = accountSettings;
        const { userUid } = auth;
        const { selectedStartDateNotified } = journal;
        dateChange({ dispatch, selectedStartDate, userUid, selectedStartDateNotified, spokenLanguage });
    };
};

export const onUpdateSelectedStartDateNotified = (selectedStartDateNotified: Date | null) => {
    return (dispatch: any) => {
        updateSelectedStartDateNotified({ dispatch, selectedStartDateNotified });
    };
};

// export const onEditMessage = (chatItemId: string, chatDetailItemId: string) => {
//     return (dispatch: any, getState: any) => {
//         const state = getState();
//         const { chat, accountSettings } = state;
//         const { chatList } = chat;
//         const { spokenLanguage, learningLanguage } = accountSettings;
//         editMessage({ dispatch, chatItemId, chatDetailItemId, spokenLanguage, learningLanguage, chatList });
//     };
// };

// export const onFinishEditMessage = (chatItemId: string, chatDetailItemId: string, otherUsersSettings: any) => {
//     return (dispatch: any, getState: any) => {
//         const state = getState();
//         const { chat, auth } = state;
//         const { userUid } = auth;
//         const { translatedContent, content, isSwitched } = chat;
//         finishEditMessage({ userUid, otherUsersSettings, dispatch, chatItemId, chatDetailItemId, translatedContent, content, isSwitched });
//     };
// };

// export const onStopEditMessage = () => {
//     return (dispatch: any, getState: any) => {
//         stopEditMessage({ dispatch });
//     };
// };
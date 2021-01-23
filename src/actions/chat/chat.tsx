import { reportUser, blockUser, getPhrases, switchContent, pressPhrase, finishEditMessage, editMessage, stopEditMessage, chatBasicItemClick, play, changeChatUserAppState, stop, changeTab, backChat, nextChat, findChat, resetTexts, createMessage, createMessageItemClick, chatDetailItemClick, changeChatText, changeTranslationChatText, sendMessage, sendVoiceMessage } from './chat-api';

export const onChatBasicItemClick = (id: string, navigation: any, ) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { chat, accountSettings } = state;
        const { chatList } = chat;
        const { images } = accountSettings;
        chatBasicItemClick({ chatList, id, navigation, images });
    };
};

export const onCreateMessage = (navigation: any) => {
    return (dispatch: any, getState: any) => {
        const { auth, accountSettings } = getState();
        const { userUid } = auth;
        const { spokenLanguage, learningLanguage } = accountSettings
        createMessage({ dispatch, spokenLanguage, userUid, navigation, learningLanguage });
    };
};  

export const onFindChat = (navigation: any) => {
    return (dispatch: any, getState: any) => {
        const { auth, accountSettings } = getState();
        const { userUid } = auth;
        const { spokenLanguage, learningLanguage, images } = accountSettings;
        findChat({ dispatch, learningLanguage, spokenLanguage, userUid, navigation, images });
    };
};

export const onChangeTab = (tab: number) => {
    return (dispatch: any) => {
        changeTab({ dispatch, tab });
    };
}; 

export const onCreateMessageItemClick = (navigation: any, otherUsersSettings: any) => {
    return (dispatch: any, getState: any) => {
        const { auth, chat, accountSettings } = getState();
        const { userUid } = auth;
        const { chatList } = chat;
        const { images } = accountSettings;
        createMessageItemClick({ dispatch, otherUsersSettings, userUid, navigation, chatList, images });
    };
};

export const onResetTexts = () => {
    return (dispatch: any) => {
        resetTexts({ dispatch });
    };
};

export const onChatDetailItemClick = (chatItemId: string, chatDetailItemId: string) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { chat, accountSettings, auth } = state;
        const { spokenLanguage, learningLanguage } = accountSettings;
        const { chatList } = chat;
        const { userUid } = auth;
        chatDetailItemClick({ chatList, chatItemId, chatDetailItemId, dispatch, spokenLanguage, learningLanguage, userUid });
    };
};

export const onStop = (chatItemId: string, chatDetailItemId: string) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { chat } = state;
        const { chatList } = chat;
        stop({ dispatch, chatList, chatDetailItemId, chatItemId });
    };
};

export const onPlay = (chatItemId: string, chatDetailItemId: string, type: string) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { chat, accountSettings, auth } = state;
        const { learningLanguage, spokenLanguage } = accountSettings;
        const { userUid } = auth;
        const { chatList } = chat;
        play({ dispatch, userUid, chatList, chatItemId, chatDetailItemId, learningLanguage, spokenLanguage, type });
    };
};

export const onChangeChatText = (content: string, id: string, otherUsersSettings: any) => {
    return (dispatch: any, getState: any) => {
        changeChatText({ id, content, dispatch, otherUsersSettings });
    };
};

export const onChangeTranslationChatText = (value: string, id: string) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { chat, accountSettings, global } = state;
        const { spokenLanguage, learningLanguage } = accountSettings;
        const { loading } = global;
        const { chatList, isSwitched } = chat;
        changeTranslationChatText({ id, value, chatList, dispatch, spokenLanguage, learningLanguage, loading, isSwitched });
    };
};

export const onSwitchContent = () => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { chat, auth } = state;
        const { translatedContent, content, isSwitched } = chat;
        const { userUid } = auth;
        switchContent({ dispatch, isSwitched, translatedContent, content, userUid });
    };
};

export const onSendMessage = (id: string, otherUsersSettings: any) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { auth, chat } = state;
        const { userUid } = auth;
        const { content, isSwitched, firstMessage } = chat;
        sendMessage({ content, dispatch, userUid, id, otherUsersSettings, isSwitched, firstMessage });
    };
};

export const onPressPhrase = (phrase: any) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { accountSettings, auth } = state;
        const { userUid } = auth;
        const { spokenLanguage, learningLanguage } = accountSettings;
        pressPhrase({ dispatch, phrase, spokenLanguage, learningLanguage, userUid });
    };
};

export const onEditMessage = (chatItemId: string, chatDetailItemId: string) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { chat, accountSettings } = state;
        const { chatList } = chat;
        const { spokenLanguage, learningLanguage } = accountSettings;
        editMessage({ dispatch, chatItemId, chatDetailItemId, spokenLanguage, learningLanguage, chatList });
    };
};

export const onFinishEditMessage = (chatItemId: string, chatDetailItemId: string, otherUsersSettings: any) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { chat, auth } = state;
        const { userUid } = auth;
        const { translatedContent, content, isSwitched } = chat;
        finishEditMessage({ userUid, otherUsersSettings, dispatch, chatItemId, chatDetailItemId, translatedContent, content, isSwitched });
    };
};

export const onStopEditMessage = () => {
    return (dispatch: any, getState: any) => {
        stopEditMessage({ dispatch });
    };
};

export const onSendVoiceMessage = (id: string, otherUsersSettings: any, voiceMessagePath: string) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { auth, chat } = state;
        const { userUid } = auth;
        const { content, firstMessage } = chat;
        sendVoiceMessage({ content, dispatch, userUid, id, otherUsersSettings, voiceMessagePath, firstMessage });
    };
};

export const onBackChat = (navigation: any) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { chat, accountSettings } = state;
        const { images, userUid } = accountSettings;
        const { foundList, swipeIndex } = chat;
        backChat({  dispatch, userUid, foundList, swipeIndex, navigation, images });
    };
};

export const onNextChat = (otherUserUid: string, navigation: any) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { chat, accountSettings } = state;
        const { images } = accountSettings;
        const { swipeIndex, foundList } = chat;
        nextChat({ dispatch, swipeIndex, foundList, navigation, images });
    };
};

export const onChangeChatUserAppState = (nextAppState: string, id: string, otherUsersSettings: any) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        changeChatUserAppState({ dispatch, otherUsersSettings, id, nextAppState });
    };
};

export const onGetPhrases = () => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { auth } = state;
        const { userUid } = auth;
        getPhrases({ dispatch, userUid });
    };
};

export const onReportUser = (otherUsersSettings: any, id: string, reason?: string) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { auth } = state;
        const { userUid } = auth;
        reportUser({ dispatch, userUid, otherUsersSettings, id, reason });
    };
};

export const onBlockUser = (otherUsersSettings: any) => {
    return (dispatch: any, getState: any) => {
        const state = getState();
        const { auth } = state;
        const { userUid } = auth;
        blockUser({ dispatch, userUid, otherUsersSettings });
    };
};
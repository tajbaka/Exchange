import { UPDATE_PHRASES, LOGOUT_USER_SUCCESS, UPDATE_VOICE_MESSAGE_ERROR, UPDATE_FOUND_LIST, UPDATE_TAB, UPDATE_IS_SWITCHED, UPDATE_TRANSLATE_CONTENT, UPDATE_CONTENT, UPDATE_CHAT_LIST, UPDATE_TRANSLATION_LOADING, UPDATE_USER_LIST, UPDATE_SWIPE_INDEX, UPDATE_CHAT_LAST_USERUID, UPDATE_CHAT_FIRST_ENTRY } from "../actions";
  
const INITIAL_STATE = {
    users: [],
    chatList : [],
    translationLoading: false,
    translatedContent: null,
    content: '',
    isSwitched: false,
    tab: 0,
    lastUserUid: undefined,
    swipeIndex: 0,
    foundList: [],
    voiceMessageError: false,
    phrases: null,
    error: '',
    firstMessage: true
};

export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case UPDATE_CHAT_FIRST_ENTRY:
            return {
                ...state,
                firstMessage: action.payload
            };
        case LOGOUT_USER_SUCCESS:
            return {
                ...state,
                ...INITIAL_STATE
            };
        case UPDATE_CONTENT:
            return {
                ...state,
                content: action.payload
            };
        case UPDATE_PHRASES:
            return {
                ...state,
                phrases: action.payload
            };
        case UPDATE_VOICE_MESSAGE_ERROR:
            return {
                ...state,
                voiceMessageError: action.payload
            };
        case UPDATE_SWIPE_INDEX:
            return {
                ...state,
                swipeIndex: action.payload
            };
        case UPDATE_CHAT_LAST_USERUID:
            return {
                ...state,
                lastUserUid: action.payload
            };
        case UPDATE_FOUND_LIST:
            return {
                ...state,
                swipeIndex: 0,
                foundList: action.payload
            };
        case UPDATE_TRANSLATE_CONTENT:
            return {
                ...state,
                translatedContent: action.payload
            };
        case UPDATE_IS_SWITCHED:
            return {
                ...state,
                isSwitched: action.payload
            };
        case UPDATE_CHAT_LIST:
            if(action.payload !== undefined){
                return {
                    ...state,
                    chatList: action.payload
                };
            }
            else {
                break;
            }
        case UPDATE_TAB:
            return {
                ...state,
                tab: action.payload
            };
        case UPDATE_USER_LIST:
            return {
                ...state,
                users: action.payload
            };
        case UPDATE_TRANSLATION_LOADING:
            return {
                ...state,
                translationLoading: action.payload
            };
        default:
            return state;
    }
};
    
  
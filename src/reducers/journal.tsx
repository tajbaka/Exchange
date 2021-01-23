import { 
    UPDATE_JOURNAL_TRANSLATE_CONTENT, 
    UPDATE_JOURNAL_LIST, 
    UPDATE_JOURNAL_TRANSLATION_LOADING, 
    UPDATE_JOURNAL_CONTENT,
    UPDATE_IS_JOURNAL_SWITCHED, 
    UPDATE_JOURNAL_VOICE_MESSAGE_ERROR,
    UPDATE_SELECTED_START_DATE_NOTIFIED,
    UPDATE_JOURNAL_ENTRY_STATEMENT,
    UPDATE_JOURNAL_FIRST_ENTRY
} from "../actions";
  
const INITIAL_STATE = {
    journalList : [],
    translationLoading: false,
    translatedContent: null,
    content: '',
    isSwitched: false,
    voiceMessageError: false,
    journalEntryStatement: '',
    error: '',
    selectedStartDateNotified: null,
    firstMessage: true
};

export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case UPDATE_JOURNAL_FIRST_ENTRY:
            return {
                ...state,
                firstMessage: action.payload
            };
        case UPDATE_JOURNAL_ENTRY_STATEMENT:
            return {
                ...state,
                journalEntryStatement: action.payload
            };
        case UPDATE_SELECTED_START_DATE_NOTIFIED:
            return {
                ...state,
                selectedStartDateNotified: action.payload
            };
        case UPDATE_JOURNAL_CONTENT:
            return {
                ...state,
                content: action.payload
            };
        case UPDATE_JOURNAL_VOICE_MESSAGE_ERROR:
            return {
                ...state,
                voiceMessageError: action.payload
            };
        case UPDATE_JOURNAL_TRANSLATE_CONTENT:
            return {
                ...state,
                translatedContent: action.payload
            };
        case UPDATE_IS_JOURNAL_SWITCHED:
            return {
                ...state,
                isSwitched: action.payload
            };
        case UPDATE_JOURNAL_LIST:
            if(action.payload !== undefined){
                return {
                    ...state,
                    journalList: action.payload
                };
            }
            else {
                break;
            }
        case UPDATE_JOURNAL_TRANSLATION_LOADING:
            return {
                ...state,
                translationLoading: action.payload
            };
        default:
            return state;
    }
};
    
  
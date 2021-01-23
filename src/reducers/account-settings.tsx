import { UPDATE_ACCOUNT_SETTINGS, LOGOUT_USER_SUCCESS } from "../actions/";
  
const INITIAL_STATE = {
    spokenLanguage: 'en',
    learningLanguage: 'en',
    name: undefined,
    about: undefined,
    fcmToken: undefined,
    images: [],
    blockedUsers: [],
    coords: undefined,
    acceptedUserAgreement: 1.0
};
    
export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
    case UPDATE_ACCOUNT_SETTINGS:
        return {
            ...state,
            ...action.payload
        };
    case LOGOUT_USER_SUCCESS:
        return {
          ...INITIAL_STATE
        };
    default:
        return state;
    }
};
    
  
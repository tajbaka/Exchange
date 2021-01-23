import {
  CREATE_USER_SUCCESS,
  PASSWORD_CHANGED,
  USERNAME_CHANGED,
  RESET_PASSWORD_SUCCESS,
  UPDATE_USER_UID,
  LOGOUT_USER_SUCCESS,
  LOGIN_USER_SUCCESS,
} from "../actions";

  const INITIAL_STATE = {
    passwordValue: '',
    usernameValue: '',
    userUid: undefined,
    fatalError: undefined,
  };
  
  export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
      case USERNAME_CHANGED:
        return {
          ...state,
          usernameValue: action.payload
        };
      case PASSWORD_CHANGED:
        return {
          ...state,
          passwordValue: action.payload
        };
      case LOGIN_USER_SUCCESS:
        return {
          ...state,
          usernameValue: '',
          passwordValue: '',
          userUid: action.payload
        };
      case LOGOUT_USER_SUCCESS:
        return {
          ...INITIAL_STATE
        };
      case CREATE_USER_SUCCESS:
        return {
          ...state,
          usernameValue: '',
          passwordValue: '',
          userUid: action.payload
        };
      case RESET_PASSWORD_SUCCESS:
        return {
          ...state,
          usernameValue: '',
          passwordValue: ''
        };
      case UPDATE_USER_UID:
        return {
          ...state,
          userUid: action.payload,
        };
      default:
        return state;
    }
  };
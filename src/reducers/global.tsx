import {
  UPDATE_ERROR,
  UPDATE_LOADING,
  UPDATE_FATAL_ERROR,
  LOGOUT_USER_SUCCESS,
  UPDATE_USER_AGREEMENT,
  UPDATE_NAVIGATION_BAR_COLOR
} from "../actions";
  
    const INITIAL_STATE = {
      errorValue: undefined,
      loading: false,
      fatalError: undefined,
      userAgreement: {},
      forcedNavigationBarColor: null
    };
    
    export default (state = INITIAL_STATE, action: any) => {
      switch (action.type) {
        case UPDATE_NAVIGATION_BAR_COLOR:
          return {
              ...state,
              forcedNavigationBarColor: action.payload
          };
        case UPDATE_USER_AGREEMENT:
          return {
              ...state,
              userAgreement: action.payload
          };
        case UPDATE_ERROR:
          return {
              ...state,
              errorValue: action.payload,
              loading: false,
          };
        case UPDATE_LOADING:
          return {
            ...state,
            loading: action.payload,
          };
        case UPDATE_FATAL_ERROR:
          return {
            ...state,
            fatalError: action.payload
          };
        case LOGOUT_USER_SUCCESS:
          return {
            ...INITIAL_STATE
          };
        default:
          return state;
      }
    };
    
  
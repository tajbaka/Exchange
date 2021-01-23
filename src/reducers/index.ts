import { combineReducers } from "redux";
import accountSettings from './account-settings'
import auth from './auth';
import chat from './chat';
import global from './global';
import journal from './journal';

export default combineReducers({
  accountSettings,
  auth,
  chat,
  global,
  journal
});

import { IAccountSettingsProps } from '../';

import { Dispatch } from "redux";

export interface IAuthenticationProps extends IAccountSettingsProps {
    errorValue?: string;
    loading?: boolean;
    usernameValue?: string;
    passwordValue?: string;
    onChangeUsername: (value: string) => (dispatch: Dispatch<any>) => Promise<void>;
    onChangePassword: (value: string) => (dispatch: Dispatch<any>) => Promise<void>;
    onBackAction: (navigation: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onNextAction: (navigation: any) => (dispatch: Dispatch<any>) => Promise<void>;
}
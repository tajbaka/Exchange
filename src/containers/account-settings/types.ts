import { Dispatch } from "redux";

export interface IAccountSettingsProps {
    loading?: boolean;
    name: string;
    about: string;
    tab: number;
    images: Array<any>;
    spokenLanguage: string;
    learningLanguage?: string;
    onLogoutUser?: (navigation: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onUpdateImages?: (photos: Array<any> | null, navigation: any, callback: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onUpdateName?: (value?: string | null, navigation?: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onUpdateAbout?: (value?: string | null, navigation?: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onUpdateLearningLanguage?: (value: string | null, navigation?: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onUpdateSpokenLanguage?: (value: string, navigation?: any) => (dispatch: Dispatch<any>) => Promise<void>;
}
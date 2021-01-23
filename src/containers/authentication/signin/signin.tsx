import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { authActions, accountSettingsActions, globalActions } from '../../../actions';
import SafeAreaView from 'react-native-safe-area-view';

import { KeyboardAvoidingView, StyleSheet, StatusBar } from 'react-native';

import { LoginButton, AccessToken } from 'react-native-fbsdk';

import { GeneralForm } from '../../../components';

import { IAuthenticationProps } from '../types';

import { signInLanguages } from './languages';

interface ISignInProps extends IAuthenticationProps {
    fatalError: string;
    onUpdateFCMToken: (fcmToken: any, user: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onCheckAppVersion: () => (dispatch: Dispatch<any>) => Promise<void>;
    onUpdateLocalSpokenLanguage: (spokenLanguage: string) => (dispatch: Dispatch<any>) => Promise<void>;
}

class SignIn extends React.Component<ISignInProps> {

    constructor(props: ISignInProps){
        super(props);
        this.onBack = this.onBack.bind(this);
        this.onForgotPassword = this.onForgotPassword.bind(this);
        this.onNextClick = this.onNextClick.bind(this);
    }

    static navigationOptions = {
        header: null
    };

    public render() {
        const { onChangeUsername, usernameValue, errorValue, spokenLanguage } = this.props;
        const languageContent = signInLanguages[spokenLanguage];

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    <React.Fragment>
                        <StatusBar barStyle="light-content" hidden={true}  />
                        <GeneralForm
                            title={languageContent && languageContent.signIn}
                            labelText={languageContent && languageContent.email}
                            errorPlaceholder={errorValue}
                            rightButtonText={languageContent && languageContent.forgotPassword}
                            rightButtonProps={{
                                onPress: this.onForgotPassword,
                                transparent: true,
                            }}
                            iconName='ios-mail'
                            inputProps={{
                                onChangeText: onChangeUsername,
                                value: usernameValue
                            }}
                            leftActionButtonText={languageContent && languageContent.back}
                            leftActionButtonProps={{
                                onPress: this.onBack,
                                iconLeft: true,
                                transparent: true,
                                iconName: 'ios-arrow-back'
                            }}
                            rightActionButtonText={languageContent && languageContent.next}
                            rightActionButtonProps={{
                                onPress: this.onNextClick,
                                iconRight: true,
                                transparent: true,
                                iconName: 'ios-arrow-forward',
                            }}
                        />
                    </React.Fragment>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    };

    private onNextClick(){
        this.props.onNextAction((this.props as any).navigation)
    }

    private onBack(){
        const { onChangeUsername } = this.props;
        (this.props as any).navigation.pop();
        onChangeUsername('');
    }

    private onForgotPassword(){
        const { onChangeUsername } = this.props;
        (this.props as any).navigation.navigate('ForgotPassword');
        onChangeUsername('');
    }
}

const styles = StyleSheet.create({
   
});

const mapStateToProps = (state: any) => {
    const { auth, global, accountSettings } = state;
    const { errorValue, fatalError } = global;
    const { usernameValue } = auth;
    const { spokenLanguage } = accountSettings;

    return {
        usernameValue,
        errorValue,
        fatalError,
        spokenLanguage
    };
  };
  
  const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        onNextAction: bindActionCreators(
            authActions.onNextAction,
            dispatch
        ),
        onChangeUsername: bindActionCreators(
            authActions.onUsernameChanged,
            dispatch
        ),
        onUpdateFCMToken: bindActionCreators(
            accountSettingsActions.onUpdateFCMToken,
            dispatch
        ),
        onUpdateLocalSpokenLanguage: bindActionCreators(
            accountSettingsActions.onUpdateLocalSpokenLanguage,
            dispatch
        ),
        onCheckAppVersion: bindActionCreators(
            globalActions.onCheckAppVersion,
            dispatch
        )
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
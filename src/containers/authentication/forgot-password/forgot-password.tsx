import React from 'react';

import { KeyboardAvoidingView, StyleSheet } from 'react-native';

import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { authActions } from '../../../actions';

import { IAuthenticationProps } from '../types';

import { GeneralForm } from '../../../components';

import { forgotPasswordLanguages } from './languages';
import SafeAreaView from 'react-native-safe-area-view';

interface IForgotPasswordProps extends IAuthenticationProps {
    onResetPassword: (navigation: any) => (dispatch: Dispatch<any>) => Promise<void>;
}

class ForgotPassword extends React.Component<IForgotPasswordProps> {
    static navigationOptions = {
        header: null
    };
    
    public render() {
        const { onBackAction, onChangeUsername, loading, errorValue, usernameValue, onResetPassword, spokenLanguage } = this.props;

        const languageContent = forgotPasswordLanguages[spokenLanguage as any];

        return (
            <SafeAreaView style={{flex: 1}}>

                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    <GeneralForm
                        title={languageContent && languageContent.forgotPassword}
                        labelText={languageContent && languageContent.email}
                        loading={loading}
                        errorPlaceholder={errorValue}
                        iconName='ios-mail'
                        leftActionButtonText={languageContent && languageContent.back}
                        leftActionButtonProps={{
                            onPress: () => onBackAction((this.props as any).navigation),
                            iconLeft: true,
                            transparent: true,
                            iconName: 'ios-arrow-back'
                        }}
                        inputProps={{
                            onChangeText: onChangeUsername,
                            value: usernameValue
                        }}
                        rightActionButtonText={languageContent && languageContent.reset}
                        rightActionButtonProps={{
                            onPress: () => onResetPassword((this.props as any).navigation),
                            iconRight: true,
                            primary: true
                        }}
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    };
}

const styles = StyleSheet.create({
   
});

const mapStateToProps = (state: any) => {
    const { auth, global, accountSettings } = state;
    const { errorValue, loading } = global;
    const { spokenLanguage } = accountSettings;
    const { usernameValue } = auth;
    return {
        errorValue,
        loading,
        usernameValue,
        spokenLanguage
    };
  };
  
  const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        onChangeUsername: bindActionCreators(
            authActions.onUsernameChanged,
            dispatch
        ),
        onResetPassword: bindActionCreators(
            authActions.onResetPassword,
            dispatch
        ),
        onBackAction: bindActionCreators(
            authActions.onBackAction,
            dispatch
        ),
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
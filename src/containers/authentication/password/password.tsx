import React from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';

import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { authActions } from '../../../actions';

import { GeneralForm } from '../../../components';

import { passwordLanguages } from './languages';

import { IAuthenticationProps } from '../types';

import Mixpanel from 'react-native-mixpanel';
import SafeAreaView from 'react-native-safe-area-view';

interface IPasswordProps extends IAuthenticationProps {
    onLoginUser: (navigation: any) => (dispatch: Dispatch<any>) => Promise<void>;
}

class Password extends React.Component<IPasswordProps> {

    constructor(props: IPasswordProps){
        super(props);
        this.onLoginUser = this.onLoginUser.bind(this);
    }

    static navigationOptions = {
        header: null
    };

    public render() {
        const { onChangePassword, onBackAction, onLoginUser, passwordValue, errorValue, loading, spokenLanguage } = this.props;
        const languageContent = passwordLanguages[spokenLanguage as any];

        return (
            <SafeAreaView style={{flex: 1}}>

                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    <GeneralForm
                        title={languageContent && languageContent.enterPassword}
                        labelText={languageContent && languageContent.password}
                        loading={loading}
                        iconName='ios-key'
                        errorPlaceholder={errorValue}
                        leftActionButtonText={languageContent && languageContent.back}
                        leftActionButtonProps={{
                            onPress: () => onBackAction((this.props as any).navigation),
                            iconLeft: true,
                            transparent: true,
                            iconName: 'ios-arrow-back'
                        }}
                        inputProps={{
                            onChangeText: onChangePassword,
                            value: passwordValue,
                            secureTextEntry: true
                        }}
                        rightActionButtonText={languageContent && languageContent.login}
                        rightActionButtonProps={{
                            onPress: this.onLoginUser,
                            block: true,
                            primary: true
                        }}
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    };

    private onLoginUser(){
        this.props.onLoginUser((this.props as any).navigation)
    }
}

const styles = StyleSheet.create({
    
});

const mapStateToProps = (state: any) => {
    const { auth, global, accountSettings } = state;
    const { errorValue, loading } = global;
    const { spokenLanguage } = accountSettings;
    const { passwordValue } = auth;
    return {
        spokenLanguage,
        errorValue,
        loading,
        passwordValue
    };
  };
  
  const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        onChangePassword: bindActionCreators(
            authActions.onPasswordChanged,
            dispatch
        ),
        onLoginUser: bindActionCreators(
            authActions.onLoginUser,
            dispatch
        ),
        onBackAction: bindActionCreators(
            authActions.onBackAction,
            dispatch
        ),
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(Password);
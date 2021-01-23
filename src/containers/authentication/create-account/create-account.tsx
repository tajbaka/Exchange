import React from 'react';

import { KeyboardAvoidingView, StyleSheet } from 'react-native';

import { GeneralForm } from '../../../components';

import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { authActions } from '../../../actions';

import { IAuthenticationProps } from '../types';

import { createAccountLanguages } from './languages';

interface ICreateAccountProps extends IAuthenticationProps  {
    spokenLanguage: any
    errorValue: any
    loading: any
    usernameValue: any
    onCheckIfAccountExists: (navigation: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onBackAction:(navigation: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onChangeUsername:(navigation: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onNextAction:(navigation: any) => (dispatch: Dispatch<any>) => Promise<void>;
}

class CreateAccount extends React.Component<ICreateAccountProps> {

    constructor(props: ICreateAccountProps){
        super(props);
        this.onNextClick = this.onNextClick.bind(this);
    }

    static navigationOptions = {
        header: null
    };

    public render() {
        const { onBackAction, onChangeUsername, usernameValue, errorValue, spokenLanguage } = this.props;

        const languageContent = createAccountLanguages[spokenLanguage as any];

        return (
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <GeneralForm
                    title={languageContent && languageContent.createAccount}
                    labelText={languageContent && languageContent.email}
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
                    rightActionButtonText={languageContent && languageContent.next}
                    rightActionButtonProps={{
                        onPress: this.onNextClick,
                        iconRight: true,
                        transparent: true,
                        iconName: 'ios-arrow-forward'
                    }}
                />
            </KeyboardAvoidingView>
        );
    };

    private onNextClick(){
        this.props.onCheckIfAccountExists((this.props as any).navigation)
    }
}

const mapStateToProps = (state: any) => {
    const { auth, global, accountSettings } = state;
    const { spokenLanguage } = accountSettings; 
    const { errorValue, loading } = global;
    const { usernameValue } = auth;
    return {
        spokenLanguage,
        errorValue,
        loading,
        usernameValue
    };
  };
  
  const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        onChangeUsername: bindActionCreators(
            authActions.onUsernameChanged,
            dispatch
        ),
        onNextAction: bindActionCreators(
            authActions.onNextAction,
            dispatch
        ),
        onBackAction: bindActionCreators(
            authActions.onBackAction,
            dispatch
        ),
        onCheckIfAccountExists: bindActionCreators(
            authActions.onCheckIfAccountExists,
            dispatch
        )
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount);
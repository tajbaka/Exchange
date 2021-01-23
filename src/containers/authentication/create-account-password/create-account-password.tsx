import React from 'react';

import { KeyboardAvoidingView, StyleSheet } from 'react-native';

import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { authActions } from '../../../actions';

import { GeneralForm } from '../../../components';

import { IAuthenticationProps } from '../types';

import { createAccountPasswordLanguages } from './languages';

interface ICreateAccountPasswordProps extends IAuthenticationProps {
    onSetCreateAccountPassword: (navigation: any) => (dispatch: Dispatch<any>) => Promise<void>;
}

class CreateAccountPassword extends React.Component<ICreateAccountPasswordProps> {

    constructor(props: ICreateAccountPasswordProps){
        super(props);
        this.onCreateAccount = this.onCreateAccount.bind(this);
    }

    static navigationOptions = {
        header: null
    };

    public render() {
        const { onBackAction, onChangePassword, passwordValue, errorValue, loading, spokenLanguage } = this.props;
        const languageContent = createAccountPasswordLanguages[spokenLanguage as any];

        return (
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <GeneralForm
                    title={languageContent && languageContent.choose}
                    labelText={languageContent && languageContent.password}
                    loading={loading}
                    errorPlaceholder={errorValue}
                    iconName='ios-key'
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
                    rightActionButtonText={languageContent && languageContent.create}
                    rightActionButtonProps={{
                        onPress: this.onCreateAccount,
                        iconRight: true,
                        primary: true
                    }}
                />
            </KeyboardAvoidingView>
        );
    };

    private onCreateAccount(){
        this.props.onSetCreateAccountPassword((this.props as any).navigation)
    }
}

const styles = StyleSheet.create({
   
});


const mapStateToProps = (state: any) => {
    const { auth, global, accountSettings } = state;
    const { spokenLanguage } = accountSettings;
    const { errorValue, loading } = global;
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
        onBackAction: bindActionCreators(
            authActions.onBackAction,
            dispatch
        ),
        onSetCreateAccountPassword: bindActionCreators(
            authActions.onSetCreateAccountPassword,
            dispatch
        )
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountPassword);
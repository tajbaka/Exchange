import React from 'react';

import { connect } from "react-redux";

import { KeyboardAvoidingView } from 'react-native';

import { IAccountSettingsProps } from "../../account-settings";

import { GeneralForm } from '../../../components'

import { setNameLanguage } from './languages';

import { accountSettingsActions } from '../../../actions';

import { bindActionCreators, Dispatch } from "redux";

interface ISetNameState {
    name: string;
}

class SetName extends React.Component<IAccountSettingsProps, ISetNameState> {

    constructor(props: IAccountSettingsProps) {
        super(props);
        this.state = {
            name: ''
        }
    }

    static navigationOptions = {
        header: null,
    };

    public render() {
        const { onUpdateName } = this.props;
        const { name } = this.state;
        const { pop } = (this.props as any).navigation;
        let { spokenLanguage } = this.props;

        const languageContent = setNameLanguage[spokenLanguage as any];

        return (
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <GeneralForm
                    title={languageContent.whatIsYourName}
                    labelText={languageContent.name}
                    inputProps={{
                        onChangeText: (name: string) => this.setState({ name }),
                        value: name
                    }}
                    iconName='md-person'
                    leftActionButtonText={languageContent.back}
                    leftActionButtonProps={{
                        onPress: () => pop(),
                        iconLeft: true,
                        transparent: true,
                        iconName: 'ios-arrow-back'
                    }}
                    rightActionButtonText={languageContent.next}
                    rightActionButtonProps={{
                        onPress: () => onUpdateName && onUpdateName(name, (this.props as any).navigation),
                        iconRight: true,
                        transparent: true,
                        iconName: 'ios-arrow-forward',
                    }}
                />
            </KeyboardAvoidingView>
        );
    }
};


const mapStateToProps = (state: any) => {
    const { accountSettings } = state;
    const { name, spokenLanguage } = accountSettings; 

    return {
      name,
      spokenLanguage
    };
};
  
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        onUpdateName: bindActionCreators(
            accountSettingsActions.onUpdateName,
            dispatch
        ),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetName);
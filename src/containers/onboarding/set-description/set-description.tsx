import React from 'react';

import { connect } from "react-redux";

import { KeyboardAvoidingView } from 'react-native';

import { IAccountSettingsProps } from "../../account-settings";

import { GeneralForm } from '../../../components'

import { setNameLanguage } from './languages';

import { accountSettingsActions } from '../../../actions';

import { bindActionCreators, Dispatch } from "redux";

interface ISetDescriptionState {
    about: string;
}

class SetDescription extends React.Component<IAccountSettingsProps, ISetDescriptionState> {

    constructor(props: IAccountSettingsProps) {
        super(props);
        this.state = {
            about: ''
        }
    }

    static navigationOptions = {
        header: null,
    };

    public render() {
        const { onUpdateAbout } = this.props;
        const { about } = this.state;
        const { pop } = (this.props as any).navigation;
        let { spokenLanguage } = this.props;

        const languageContent = setNameLanguage[spokenLanguage as any];

        return (
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <GeneralForm
                    title={languageContent.tellUsAboutYou}
                    labelText={languageContent.myInterest +  '...'}
                    textAreaProps={{
                        bordered: false,
                        underline: false,
                        rowSpan: 5,
                        value: about,
                        onChangeText: (about: string) => this.setState({ about })
                    }}
                    iconName='ios-basketball'
                    leftActionButtonText={languageContent.back}
                    leftActionButtonProps={{
                        onPress: () => pop(),
                        iconLeft: true,
                        transparent: true,
                        iconName: 'ios-arrow-back'
                    }}
                    rightActionButtonText={languageContent.next}
                    rightActionButtonProps={{
                        onPress: () => onUpdateAbout && onUpdateAbout(about, (this.props as any).navigation),
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
    const { about, spokenLanguage } = accountSettings; 

    return {
        about,
        spokenLanguage
    };
};
  
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        onUpdateAbout: bindActionCreators(
            accountSettingsActions.onUpdateAbout,
            dispatch
        ),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetDescription);
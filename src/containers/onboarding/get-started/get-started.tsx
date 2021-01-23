import React from 'react';

import { StyleSheet } from 'react-native';

import { connect } from "react-redux";

import { Container, Button, Text, View } from 'native-base';

import { getStartedLanguages } from './languages';

import { IAccountSettingsProps } from "../../account-settings";

class GetStarted extends React.Component<IAccountSettingsProps> {

    static navigationOptions = {
        header: null,
    };

    public render() {
        const { containerStyle, buttonStyle, titleWrapperStyle, titleStyle } = styles;
        const navigation = (this.props as any).navigation;
        const { navigate } = navigation;
        let { spokenLanguage } = this.props;

        const languageContent = getStartedLanguages[spokenLanguage as any];

        return (
            <Container style={containerStyle}>
                <View  style={titleWrapperStyle}>
                    <Text style={titleStyle}> { languageContent.welcomeToExchangeMessenger } </Text>
                </View>
                <Button onPress={() => navigate('SetName') } style={buttonStyle}>
                    <Text> { languageContent.letsGetStarted }  </Text>
                </Button>
            </Container>
        );
    }
};

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: 40,
        paddingBottom: 40
    },
    titleWrapperStyle: {
        alignItems: 'center',
    },
    titleStyle: {
        fontSize: 20,
        color: '#007aff',
        fontWeight: '700'
    },
    buttonStyle: {
        alignSelf: 'center',
        backgroundColor: '#007aff',
        borderRadius: 5
    }
});


const mapStateToProps = (state: any) => {
    const { accountSettings } = state;
    const { spokenLanguage } = accountSettings; 
    return {
        spokenLanguage
    };
};

export default connect(mapStateToProps)(GetStarted);
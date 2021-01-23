import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { authActions, accountSettingsActions, globalActions, distance } from '../../../actions';

import { StatusBar, NativeModules, Platform, KeyboardAvoidingView, StyleSheet, View, Dimensions } from 'react-native';

import { Button, Text } from 'native-base';

import { landingLanguages } from './languages';

import { IAuthenticationProps } from '../types';

import Mixpanel from 'react-native-mixpanel';

import DeviceInfo from 'react-native-device-info';

import messaging from '@react-native-firebase/messaging';

import auth from '@react-native-firebase/auth';

import changeNavigationBarColor from 'react-native-navigation-bar-color';
import SafeAreaView from 'react-native-safe-area-view';
import SplashScreen from 'react-native-splash-screen';


interface ILandingProps extends IAuthenticationProps {
    fatalError: string;
    onUpdateFCMToken: (fcmToken: any, user: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onCheckAppVersion: () => (dispatch: Dispatch<any>) => Promise<void>;
    onGetUserAgreement: () => (dispatch: Dispatch<any>) => Promise<void>;
    onLoginUser: (navigation: any, userUid?: string) => (dispatch: Dispatch<any>) => Promise<void>;
    onUpdateLocalSpokenLanguage: (spokenLanguage: string) => (dispatch: Dispatch<any>) => Promise<void>;
}

interface ILandingState {
    userUid?: any;
    screenHeight: any;
    screenWidth: any;
}

class Landing extends React.Component<ILandingProps, ILandingState> {
    constructor(props: ILandingProps){
        super(props);
        this.onCreateAccount = this.onCreateAccount.bind(this);
        this.onSignIn = this.onSignIn.bind(this);

        const screenHeight = Math.round(Dimensions.get('window').height);
        const screenWidth = Math.round(Dimensions.get('window').width);

        this.state = {
            screenWidth,
            screenHeight,
            userUid : undefined
        }
    }

    static navigationOptions = {
        header: null,
        headerTintColor: 'white',
    };

    async componentDidMount(){
        SplashScreen.hide();
        const { onUpdateFCMToken } = this.props;
        const spokenLanguage = Platform.OS === 'ios' ? NativeModules.SettingsManager.settings.AppleLocale : NativeModules.I18nManager.localeIdentifier;
        if (spokenLanguage) this.props.onUpdateLocalSpokenLanguage(spokenLanguage);
        else this.props.onUpdateLocalSpokenLanguage('en');

        auth().onAuthStateChanged((res: any) => {
            let user: any;
            if(res){
                user = res._user;
            }
            else {
                (this.props as any).navigation.navigate('Landing')
            }

            async function updateFCMToken() {
                const fcmToken = await messaging().getToken();
                if(user && user.uid){
                    onUpdateFCMToken(fcmToken, user.uid);
                }
            }

            updateFCMToken();

            if (this.state.userUid === undefined && user && user.uid) {
                const userUid = user.uid;
                Mixpanel.sharedInstanceWithToken('234fbcc1b0529e5ddc8e6d893ae29003').then(() => {
                    const deviceId = DeviceInfo.getDeviceId();
                    const buildNumber = DeviceInfo.getBuildNumber();
                    Mixpanel.identify('ID:' + deviceId + ' BUILDNUMBER:' + buildNumber);
                    this.setState({ userUid }, () => {
                        this.props.onLoginUser((this.props as any).navigation, userUid);
                    });
                });
            }
            else {
                this.setState({ userUid: null });
            }
        });

        this.props.onCheckAppVersion();
        this.props.onGetUserAgreement();
    }

    componentWillMount(){
        changeNavigationBarColor('white', true, false);
    }

    public render() {
        const { spokenLanguage } = this.props;
        const { buttonStyle, buttonTextStyle, loadingStyle, titleStyle, descriptionStyle } = styles;
        const { screenWidth, userUid } = this.state;
        const languageContent = landingLanguages[spokenLanguage];
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    {userUid === undefined ?
                        // <View style={loadingStyle} pointerEvents='none'>
                        //     <Image 
                        //         source={require('./globe-blue.png')}
                        //         style={{ height: screenWidth/2, width: screenWidth/2 }}
                        //     />
                        // </View>
                        <View style={loadingStyle} pointerEvents='none' />
                    :
                    userUid === null &&
                        <React.Fragment>
                            <StatusBar barStyle="light-content" hidden={true}  />
                            <View style={{ flexDirection: 'column', flex: 1, paddingHorizontal: 20, paddingVertical: 20 }}>
                                <Text style={titleStyle}> { languageContent.welcome } </Text>
                                <View style={{  flex: 1, justifyContent: 'center', alignItems: 'center'}} />
                                <View>
                                    <Button transparent onPress={this.onCreateAccount} style={[buttonStyle, { width: '100%' }]}> 
                                        <Text style={buttonTextStyle}>
                                            { languageContent.createAccount }
                                        </Text>
                                    </Button>
                                    <Button transparent onPress={this.onSignIn} style={{ alignSelf: 'center', marginTop: 20 }}> 
                                        <Text style={buttonTextStyle}>
                                            <Text style={[descriptionStyle, { fontSize: 16, marginBottom: 30, marginTop: 10 }]}> { languageContent.alreadyMember } </Text>
                                        </Text>
                                    </Button>
                                </View>
                            </View>
                        </React.Fragment>
                    }
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    };

    private onCreateAccount(){
        Mixpanel.sharedInstanceWithToken('234fbcc1b0529e5ddc8e6d893ae29003').then(() => {
            Mixpanel.track("Create Account Init");
            (this.props as any).navigation.navigate('CreateAccount');
        });
    }

    private onSignIn(){
        Mixpanel.sharedInstanceWithToken('234fbcc1b0529e5ddc8e6d893ae29003').then(() => {
            Mixpanel.track("Sign In Init");
            (this.props as any).navigation.navigate('SignIn');
        });
    }
}

const styles = StyleSheet.create({
    loadingStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleWrapperStyle: {
        alignItems: 'center',
    },
    titleStyle: {
        fontSize: 24,
        color: '#007aff',
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30
    },
    descriptionStyle: {
        color: 'rgba(0,0,0,0.5)',
        fontSize: 18,
        textAlign: 'center'
    },
    otherDescriptionStyle: {
        color: 'rgba(0,0,0,0.5)',
        fontSize: 20,
        textAlign: 'center'
    },
    buttonStyle: {
        alignSelf: 'center',
        backgroundColor: '#007aff',
        borderRadius: 25,
        width: 170,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTextStyle: {
        color: 'rgba(255,255,255,0.85)',
    }
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
        onLoginUser: bindActionCreators(
            authActions.onLoginUser,
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
        ),
        onGetUserAgreement: bindActionCreators(
            globalActions.onGetUserAgreement,
            dispatch
        )
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
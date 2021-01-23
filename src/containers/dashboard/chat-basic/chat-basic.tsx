import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { chatActions, authActions, sortList, accountSettingsActions, globalActions } from '../../../actions';
import { MiniProfile } from '../../../components';
import { ChatBasicHeader, IChatBasicListItemProps, Connect, Chats, UserPolicy, UserBanned } from './components';

import Journal from './components/journal/journal';

import { chatBasicLanguages } from './languages';

import { StyleSheet, Animated, Modal, Dimensions, StatusBar, Image } from 'react-native';

import messaging from '@react-native-firebase/messaging';

import { Container, NativeBase, Icon, Button, View } from 'native-base';

import changeNavigationBarColor from 'react-native-navigation-bar-color';

import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import SafeAreaView from 'react-native-safe-area-view';

import Geolocation from '@react-native-community/geolocation';

export interface IChatBasicProps extends NativeBase.Container {
    chatList: Array<IChatBasicListItemProps>;
    userAgreement: any;
    acceptedUserAgreement: number;
    spokenLanguage: string;
    loading?: boolean;
    errorValue?: string;
    tab: number;
    images?: any;
    banned?: boolean;
    forcedNavigationBarColor?: string;
    acceptUserAgreement: () => (dispatch: Dispatch<any>) => Promise<void>;
    onChangeTab: (tab: number) => (dispatch: Dispatch<any>) => Promise<void>;
    onFindChat: (navigation: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onCreateMessage: (navigation: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onChatBasicItemClick: (id: string, navigation: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onResetTexts: () => (dispatch: Dispatch<any>) => Promise<void>;
    onLocalPushNotification: (data?: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onAddToNotificationQueue: (data: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onOpenLocalNotification: (notification: any, navigation: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onUpdateNavigationBarColor: (forcedNavigationBarColor: string | null) => (dispatch: Dispatch<any>) => Promise<void>;
    onUpdateCoordinates: (coords: any) => (dispatch: Dispatch<any>) => Promise<void>;
}

interface IChatBasicState {
    stopPulseAnimation: boolean;
    stopRingAnimation: boolean;
    connect: boolean;
    profileItem: any;
    primaryPhoto?: any;
    screenHeight: any;
    screenWidth: any;
}

class ChatBasic extends React.Component<IChatBasicProps, IChatBasicState> {

    private pulseAnim = new Animated.Value(0);
    private ringFirstAnim = new Animated.Value(0);
    private opacityAnim = new Animated.Value(0);
    private buttonDropAnim = new Animated.Value(0);
    private focusListener: any;
    private blurListener: any;

    constructor(props: IChatBasicProps){
        super(props);

        this.componentDidFocus = this.componentDidFocus.bind(this);
        this.onConnectButtonPress = this.onConnectButtonPress.bind(this);
        this.onStopConnectButtonPress = this.onStopConnectButtonPress.bind(this);
        this.runAnimation = this.runAnimation.bind(this);
        this.runRingAnimation = this.runRingAnimation.bind(this);
        this.runButtonDropAnimation = this.runButtonDropAnimation.bind(this);
        this.runButtonUpAnimation = this.runButtonUpAnimation.bind(this);
        this.goToAccountSettings = this.goToAccountSettings.bind(this);
        this.onChangeTab = this.onChangeTab.bind(this);
        this.onItemImageClick = this.onItemImageClick.bind(this);
        this.showProfile = this.showProfile.bind(this);
        this.willBlur = this.willBlur.bind(this);
        this.willFocus = this.willFocus.bind(this);

        let { images } = this.props;
        let primaryPhoto;

        if(images){
            images = images.slice();
            for(let i = 0; i < images.length; i++){
                const image = images[i];
                if(image && image.primary){
                    primaryPhoto = image;
                }
            }
        }


        const screenHeight = Math.round(Dimensions.get('window').height);
        const screenWidth = Math.round(Dimensions.get('window').width);

        const { spokenLanguage } = this.props;

        (this.props as any).navigation.setParams({
            loading: true,
            spokenLanguage
        });

        this.state = {
            screenWidth,
            screenHeight,
            primaryPhoto,
            connect: false,
            stopPulseAnimation: false,
            stopRingAnimation: false,
            profileItem: null
        }
    }

    static navigationOptions = {
        header: null,
        headerTintColor: 'white'
    };

    public componentWillMount(){
        this.focusListener = ((this.props as any).navigation).addListener('willFocus', this.willFocus);
        // this.blurListener = ((this.props as any).navigation).addListener('willBlur', this.willBlur)
    }

    public UNSAFE_componentWillMount() {
        this.focusListener.remove();
    }

    public componentWillReceiveProps({ onUpdateNavigationBarColor, forcedNavigationBarColor, spokenLanguage, tab, loading, images, acceptedUserAgreement, ...rest }: IChatBasicProps){
        if(this.props.spokenLanguage !== spokenLanguage){
            (this.props as any).navigation.setParams({
                spokenLanguage
            });
        }
        if(tab !== this.props.tab){
            setTimeout(() => {
                if(forcedNavigationBarColor !== undefined && forcedNavigationBarColor !== null){
                    changeNavigationBarColor(forcedNavigationBarColor, false, false);
                    onUpdateNavigationBarColor(null)
                }
                else if(tab == 0){
                    changeNavigationBarColor('#007aff', false, false);
                }
                else {
                    changeNavigationBarColor('white', true, false);
                }
            }, 0);
        }
        if(acceptedUserAgreement !== this.props.acceptedUserAgreement){
            if(forcedNavigationBarColor !== undefined && forcedNavigationBarColor !== null){
                changeNavigationBarColor(forcedNavigationBarColor, false, false);
                onUpdateNavigationBarColor(null);
            }
            else if(acceptedUserAgreement) {
                changeNavigationBarColor('#007aff', false, false);
            }
            else {
                changeNavigationBarColor('white', true, false);
            }
        }
        if(this.props.loading !== loading && !loading && this.state.connect) {
            this.setState({ connect: false }, () => {
                this.runButtonUpAnimation(500);
            })
        }
        if(this.props.images !== images) {
            let primaryPhoto;
            if(images){
                images = images.slice();
                for(let i = 0; i < images.length; i++){
                    const image = images[i];
                    if(image.primary){
                        primaryPhoto = image;
                    }
                }
            }
            this.setState({ primaryPhoto })
        }
        if((rest as any).navigation !== (this.props as any).navigation) {
            const startSearch = (rest as any).navigation.getParam('startSearch');
            setTimeout(() => {
                if(startSearch){
                    this.onConnectButtonPress();
                }
            }, 300);
        }
    }

    public componentDidMount(){
        setTimeout(() => {
            (this.props as any).navigation.setParams({ loading: false });
        }, 700);

        const { spokenLanguage } = this.props;
        
        messaging().subscribeToTopic('journal-' + spokenLanguage);
        messaging().subscribeToTopic('general-' + spokenLanguage);
        // messaging().subscribeToTopic('test-' + spokenLanguage);

        Geolocation.getCurrentPosition(geoMapLocation => {
            const { coords } = geoMapLocation;
            this.props.onUpdateCoordinates(coords);
        });

        (this.props as any).navigation.addListener('didFocus', this.componentDidFocus),
        this.runAnimation();


        PushNotification.configure({
            onNotification: (notification: any) => {
                console.log("NOTIFICATION:", notification);
                this.props.onOpenLocalNotification(notification, (this.props as any).navigation);
                notification.finish(PushNotificationIOS.FetchResult.NoData); 
            },
            popInitialNotification: true,
            requestPermissions: true,
            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
        });
    }

    public render() {
        const { containerStyle, loadingStyle } = styles;
        const { spokenLanguage, errorValue, tab, userAgreement, acceptUserAgreement, acceptedUserAgreement, banned } = this.props;
        let { chatList }: any = this.props;
        const params = (this.props as any).navigation.state.params;
        const { profileItem, connect, primaryPhoto, screenHeight, screenWidth } = this.state;

        if(chatList && chatList.length > 0){
            chatList = sortList(chatList, false, 'lastMessage');
        }

        const languageContent = chatBasicLanguages[spokenLanguage];

        return (
            <SafeAreaView style={{flex: 1}}>
            <Container style={containerStyle}>
                {(!acceptedUserAgreement || acceptedUserAgreement < userAgreement.version) &&
                    <UserPolicy onAccept={acceptUserAgreement} userAgreement={userAgreement.text} spokenLanguage={spokenLanguage} />
                }
                {(banned) &&
                    <UserBanned spokenLanguage={spokenLanguage} />
                }
                <StatusBar barStyle="dark-content" hidden={false} translucent={false} backgroundColor="white" />
                <Modal visible={profileItem !== null} transparent={true} animated={false}>
                    <MiniProfile
                        navigation={(this.props as any).navigation}
                        spokenLanguage={spokenLanguage}
                        profileItem={profileItem} 
                        onShowProfile={this.showProfile}
                        onDismiss={() => { this.setState({ profileItem: null }) }}
                    />
                </Modal>
                <ChatBasicHeader
                    spokenLanguage={spokenLanguage}
                    onChangeTab={this.onChangeTab}
                    tab={tab}
                    firstTabElement={
                        <Connect
                            screenHeight={screenHeight}
                            pulseAnim={this.pulseAnim}
                            ringFirstAnim={this.ringFirstAnim}
                            buttonDropAnim={this.buttonDropAnim}
                            opacityAnim={this.opacityAnim}
                            onConnectButtonPress={this.onConnectButtonPress}
                            onStopConnectButtonPress={this.onStopConnectButtonPress}
                            languageContent={languageContent}
                            errorValue={errorValue}
                            connect={connect}
                        />
                    }
                    secondTabElement={
                        <Chats
                            chatList={chatList}
                            languageContent={languageContent}
                            navigation={(this.props as any).navigation}
                            onChatBasicItemClick={this.props.onChatBasicItemClick}
                            onCreateMessage={this.props.onCreateMessage}
                            onItemImageClick={this.onItemImageClick}
                        />
                    }
                    // thirdTabElement={
                    //     <Journal 
                    //         primaryPhoto={primaryPhoto}
                    //     />
                    // }
                />
                <Button onPress={this.goToAccountSettings} transparent style={{ position: 'absolute', height: 50, width: 48, top: 0, left: 0, backgroundColor: 'white' }}>
                    <View style={{ marginLeft: 7, backgroundColor: '#82beff', height: 35, width: 35, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }}>
                        {primaryPhoto ? 
                            <Image
                                source={{ uri: primaryPhoto.path }}
                                style={{ width: 35, height: 35, borderRadius: 18 }}
                            />
                            :
                            <Icon name='ios-person' style={{ color: 'white', fontSize: 20 }} /> 
                        }
                    </View>
                </Button>
            </Container>
            </SafeAreaView>
        );
    }

    private willFocus(){
        const params = (this.props as any).navigation.state.params;
        if((params === undefined || params.loading)){
            setTimeout(() => {
                this.willFocus();
            }, 100);
        }
        else {
            if(this.props.forcedNavigationBarColor !== undefined && this.props.forcedNavigationBarColor !== null){
                changeNavigationBarColor(this.props.forcedNavigationBarColor, false, false);
            }
            else if(this.props.tab == 0 || this.props.tab === undefined || this.props.tab === null){
                changeNavigationBarColor('#007aff', false, false);
            }
            else {
                changeNavigationBarColor('white', true, false);
            }
        }
    }

    private willBlur(){
        changeNavigationBarColor('white', true, false);
        this.blurListener.remove();
    }

    private showProfile(profileItem: any){
        this.setState({ profileItem: null }, () => {
            (this.props as any).navigation.navigate('ProfileDetailed', { title: profileItem.name, about: profileItem.about, id: profileItem.id, otherUsersSettings: profileItem.otherUsersSettings });
        });
    }

    private onItemImageClick(item: any, profilePhoto: string){
        let profileItem = {
            ...item
        }
        if(profilePhoto){
            profileItem = { ...profileItem, profilePhoto };
        }
        
        this.setState({ profileItem });
    }

    private goToAccountSettings(){
        const { spokenLanguage } = this.props;
        (this.props as any).navigation.navigate('AccountSettings', { spokenLanguage });
    }

    private onChangeTab(event: any){
        const tab = event.i;
        this.props.onChangeTab(tab);
    }

    private onConnectButtonPress(){
        const { onFindChat } = this.props;
        this.setState({ connect: true }, () => {
            this.runButtonDropAnimation();
        });
        setTimeout(() => {
            if(this.state.connect){
                onFindChat((this.props as any).navigation);
            }
        }, 1500);
    }

    private onStopConnectButtonPress(){
        this.setState({ connect: false }, () => {
            this.runButtonUpAnimation(500);
        })
    }

    private runAnimation(){
        Animated.sequence([
            Animated.timing(this.pulseAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true, // <-- Add this
            }),
            Animated.timing(this.pulseAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true, // <-- Add this
            }),
        ]).start(() => {
            if(!this.state.stopPulseAnimation){
                this.runAnimation()
            }
        });
    }

    private runButtonDropAnimation(){
        this.setState({ stopPulseAnimation: true }, () => {
            Animated.sequence([
                Animated.timing(this.buttonDropAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true, // <-- Add this
                }),
                Animated.timing(this.opacityAnim, {
                    toValue: 1,
                    duration: 0,
                    useNativeDriver: true, // <-- Add this
                })
            ]).start(() => {
                this.setState({ stopPulseAnimation: false, stopRingAnimation: false }, () => {
                    this.runAnimation();
                    this.runRingAnimation();
                })
            });
        })
        
    }

    private runButtonUpAnimation(duration: number){
        this.setState({ stopPulseAnimation: true }, () => {
            Animated.timing(this.buttonDropAnim, {
                toValue: 0,
                duration,
                useNativeDriver: true, // <-- Add this
            }).start(() => {
                this.setState({ stopPulseAnimation: false, stopRingAnimation: true }, () => {
                    this.runAnimation();
                })
            });

            Animated.timing(this.opacityAnim, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true, // <-- Add this
            }).start();
        });
    }

    private runRingAnimation(){
        setTimeout(() => {
            Animated.sequence([
                Animated.timing(this.ringFirstAnim, {
                    toValue: 1,
                    duration: 1300,
                    useNativeDriver: true, // <-- Add this
                }),
                Animated.timing(this.ringFirstAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true, // <-- Add this
                })
            ]).start();
        }, 100);
        
        Animated.sequence([
            Animated.timing(this.opacityAnim, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: true, // <-- Add this
            }),
            Animated.timing(this.opacityAnim, {
                toValue: 1,
                duration: 0,
                useNativeDriver: true, // <-- Add this
            })
        ]).start(() => setTimeout(() => {
            if(!this.state.stopRingAnimation){
                this.runRingAnimation();
            }
        }, 1500));
    }

    private componentDidFocus(){
        this.props.onResetTexts();
    }
};

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
    },
    connectButtonTextStyle: {
        color: 'white',
        fontSize: 160
    },
    chatWrapperStyle : {
        flex: 1
    },
    createMessageStyle : {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 0,
        right: 0,
        width: 65, 
        height: 65
    },
    headerLeftStyle: {
        fontWeight: '600'
    },
    loadingStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        backgroundColor: 'white',
    }
});


const mapStateToProps = (state: any) => {
    const { chat, global, accountSettings } = state;
    const { chatList, tab } = chat;
    const { loading, errorValue, userAgreement, forcedNavigationBarColor } = global;
    const { spokenLanguage, images, acceptedUserAgreement, banned } = accountSettings;

    return {
        userAgreement,
        tab,
        images,
        chatList,
        loading,
        errorValue,
        acceptedUserAgreement,
        spokenLanguage,
        banned,
        forcedNavigationBarColor
    };
};
  
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        onChatBasicItemClick: bindActionCreators(
            chatActions.onChatBasicItemClick,
            dispatch
        ),
        onCreateMessage: bindActionCreators(
            chatActions.onCreateMessage,
            dispatch
        ),
        onResetTexts: bindActionCreators(
            chatActions.onResetTexts,
            dispatch
        ),
        onFindChat: bindActionCreators(
            chatActions.onFindChat,
            dispatch
        ),
        onChangeTab: bindActionCreators(
            chatActions.onChangeTab,
            dispatch
        ),
        onAddToNotificationQueue: bindActionCreators(
            authActions.onAddToNotificationQueue,
            dispatch
        ),
        onOpenLocalNotification: bindActionCreators(
            authActions.onOpenLocalNotification,
            dispatch
        ),
        acceptUserAgreement: bindActionCreators(
            accountSettingsActions.onAcceptUserAgreement,
            dispatch
        ),
        onUpdateNavigationBarColor: bindActionCreators(
            globalActions.onUpdateNavigationBarColor,
            dispatch
        ),
        onUpdateCoordinates: bindActionCreators(
            accountSettingsActions.onUpdateCoordinates,
            dispatch
        )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatBasic);
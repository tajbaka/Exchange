import React from 'react';

import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { chatActions, sortList, reverseFormatLanguages, globalActions, msToTime } from '../../../actions';

import { BackButton } from '../../../components';

import { ChatDetailedListItem, ChatDetailedPicker, ChatDetailedUserBlocked } from './components';

import { IChatBasicListItemProps } from '../chat-basic/components';

import { chatDetailedLanguages } from './languages';

import { StatusBar, StyleSheet, Keyboard, Platform, TextInput, ScrollView, KeyboardAvoidingView, Dimensions, Image, PermissionsAndroid, TouchableOpacity, Animated } from 'react-native';

import { ListItem, NativeBase, View,  Icon, Text, Button } from 'native-base';

import Mixpanel from 'react-native-mixpanel';

import changeNavigationBarColor from 'react-native-navigation-bar-color';

import AudioRecorderPlayer from 'react-native-audio-recorder-player';

export interface IChatDetailedProps extends NativeBase.Container {
    translationLoading?: boolean;
    phrases: Array<string>;
    translatedContent: string;
    spokenLanguage: string;
    blockedUsers: Array<any>;
    foundList: Array<any>;
    learningLanguage: string,
    tab: number;
    voiceMessageError: boolean;
    isSwitched: boolean;
    content: string;
    loading?: boolean;
    userUid: string;
    chatList: Array<IChatBasicListItemProps>;
    onSetLoading: (loading: boolean) => (dispatch: Dispatch<any>) => Promise<void>;
    onChangeChatText: (content: string, id: string, otherUsersSettings: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onChangeTranslationChatText: (value: string, id: string) => (dispatch: Dispatch<any>) => Promise<void>;
    onEditMessage: (chatItemId: string, chatDetailItemId: string) => (dispatch: Dispatch<any>) => Promise<void>;
    onStopEditMessage: () => (dispatch: Dispatch<any>) => Promise<void>;
    onSendMessage: (chatDetailItemid: string, otherUsersSettings: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onSendVoiceMessage: (chatDetailItemid: string, otherUsersSettings: any, voiceMessagePath: string) => (dispatch: Dispatch<any>) => Promise<void>;
    onFinishEditMessage: (chatItemId: string, chatDetailItemid: string, otherUsersSettings: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onChatDetailItemClick: (chatItemId: string, chatDetailItemId: string) => (dispatch: Dispatch<any>) => Promise<void>;
    onNextChat: (otherUserId: string, navigation: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onBackChat: (navigation: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onPlay: (chatItemId: string, chatDetailItemId: string, type: string) => (dispatch: Dispatch<any>) => Promise<void>;
    onStop: (chatItemId: string, chatDetailItemId: string) => (dispatch: Dispatch<any>) => Promise<void>;
    onChangeChatUserAppState:(nextAppState: string, id: string, otherUsersSettings: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onPressPhrase:(phrase: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onSwitchContent:() => (dispatch: Dispatch<any>) => Promise<void>;
    onGetPhrases:() => (dispatch: Dispatch<any>) => Promise<void>;
    onReportUser:(otherUsersSettings: any, id: string, reason?: string) => (dispatch: Dispatch<any>) => Promise<void>;
    onBlockUser:(otherUsersSettings: any) => (dispatch: Dispatch<any>) => Promise<void>;
}

interface IChatDetailedState {
    id: string;
    otherUsersSettings: any;
    showArrows?: boolean;
    isBottom?: boolean;
    isTop?: boolean;
    paginationNum: number;
    editingMessageId?: string; 
    currentY?: any;
    height?: any;
    recordToolTip?: string;
    alert?: string;
    phrases?: Array<string> | null;
    itemClickedId: any;
    screenHeight: number;
    screenWidth: number;
    recording: boolean;
    playing: boolean;
    startRecord: boolean;
    recordDuration: number;
    playDuration: number;
    voiceLoading: boolean;
    storagePermission: boolean;
    recordPermission: boolean;
    pickerValue?: string;
    reason?: string;
    showPicker: boolean;
    reasonError?: string;
    isUserBlocked: boolean;
    stopPulseAnimation: boolean;
}

class ChatDetailed extends React.Component<IChatDetailedProps, IChatDetailedState> {

    private scrollViewRef: any;
    private keyboardDidShowListener: any;
    private keyboardDidHideListener: any;
    private audioRecorderPlayer: any;
    private voiceMessagePath: any;
    private copyInterval: any;
    private pulseAnim = new Animated.Value(0);

    constructor(props: IChatDetailedProps){
        super(props);
        this.onSendMessage = this.onSendMessage.bind(this);
        this.onEditMessage = this.onEditMessage.bind(this);
        this.onStopEditMessage = this.onStopEditMessage.bind(this);
        this.onChangeChatText = this.onChangeChatText.bind(this);
        this.onChatDetailItemClick = this.onChatDetailItemClick.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.keyboardDidShow = this.keyboardDidShow.bind(this);
        this.keyboardDidHide = this.keyboardDidHide.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.isCloseToBottom = this.isCloseToBottom.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.renderMain = this.renderMain.bind(this);
        this.onLayout = this.onLayout.bind(this);
        this.onScrollViewLayout = this.onScrollViewLayout.bind(this);
        this.onNextClick = this.onNextClick.bind(this);
        this.onBackClick = this.onBackClick.bind(this);
        this.findDimensions = this.findDimensions.bind(this);
        this.onOptionsChanged = this.onOptionsChanged.bind(this);
        this.onSayHi = this.onSayHi.bind(this);

        this.onStop = this.onStop.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onCopy = this.onCopy.bind(this);
        this.removeAlert = this.removeAlert.bind(this);
        this.onReportUser = this.onReportUser.bind(this);

        this.onRecordMessage = this.onRecordMessage.bind(this);
        this.onStopRecordMessage = this.onStopRecordMessage.bind(this);
        this.onStopRecord = this.onStopRecord.bind(this);
        this.onPlayRecord = this.onPlayRecord.bind(this);
        this.onRemoveRecording = this.onRemoveRecording.bind(this);
        this.onFinishEditMessage = this.onFinishEditMessage.bind(this);
        this.onReasonChanged = this.onReasonChanged.bind(this);
        this.onBlockUser = this.onBlockUser.bind(this);
        this.onShowPicker = this.onShowPicker.bind(this);
        this.isUserBlocked = this.isUserBlocked.bind(this);
        this.onTogglePhrases = this.onTogglePhrases.bind(this);

        const navigationParams = (this.props as any).navigation.state.params;
        const { id, otherUsersSettings } = navigationParams;

        const { tab } = this.props;
        const screenHeight = Math.round(Dimensions.get('window').height);
        const screenWidth = Math.round(Dimensions.get('window').width);
        const showArrows = (this.props as any).navigation.getParam('showArrows');

        (this.props as any).navigation.setParams({
            onShowPicker: () => this.onShowPicker(),
            onTogglePhrases: () => this.onTogglePhrases(),
            tab
        });

        this.state = {
            isUserBlocked: false,
            showArrows,
            showPicker: false,
            id,
            paginationNum: 20,
            otherUsersSettings,
            recordDuration: 0,
            playDuration: 0,
            itemClickedId: null,
            screenWidth,
            screenHeight,
            recording: false,
            startRecord: false,
            playing: false,
            voiceLoading: false,
            recordPermission: false,
            storagePermission: false,
            stopPulseAnimation: false
        }

        this.scrollViewRef = React.createRef();
    }

    static navigationOptions = ({ navigation }: any) => {
        const navigationParams = navigation.state.params;
        const { id, otherUsersSettings, onTogglePhrases, onShowPicker, otherUserPrimaryPhoto, status } = navigationParams;

        return {
            title: null,
            headerRight: 
                <View style={{ position: 'relative', flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Button style={{ paddingRight: 0, paddingLeft: 0, width: 35, justifyContent: 'center', alignItems: 'center' }} transparent onPress={onTogglePhrases}>
                        <Icon name='create' style={{ fontSize: 20, color: 'white', width: 20 }} />
                    </Button>
                    <Button style={{ paddingRight: 0, paddingLeft: 0, width: 35, justifyContent: 'center', alignItems: 'center' }} transparent onPress={onShowPicker}>
                        <Icon style={{ fontSize: 20, color: 'white', width: 20 }} name='ios-menu' />
                    </Button>
                </View>
            ,
            headerLeft: 
                <BackButton 
                    showImage={true} 
                    onContentPress={() => navigation.navigate('ProfileDetailed', { title: otherUsersSettings.name, about: otherUsersSettings.about, otherUsersSettings })}  
                    onPress={() => {
                        navigation.navigate('ChatBasic');
                    }}
                    rightItem={true}
                    image={otherUserPrimaryPhoto} subtitle={navigation.state.params.typing && '...'} 
                    title={navigation.state.params.title} 
                />,
            headerStyle: {
                backgroundColor: '#007aff'
            },
            headerTintColor: 'white'
        };
    };

    public componentDidMount() {
        this.props.onGetPhrases();

        if(this.state.showArrows){
            this.runAnimation();
        }

        changeNavigationBarColor('white', true, false);

        this.keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          this.keyboardDidShow,
        );

        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this.keyboardDidHide,
        );

        setTimeout(() => {
            this.scrollToBottom();
        }, 0);

        const loading = (this.props as any).navigation.getParam('setLoading');

        if(loading !== undefined && loading !== null){
            setTimeout(() => {
                this.props.onSetLoading(loading);
            }, 500);
        }

        const isUserBlocked = this.isUserBlocked();

        this.setState({ isUserBlocked })

        this.getPermission('storage').then((res: any) => {  
            const storagePermission = res;
            this.setState({ storagePermission });
        });

        this.getPermission('record').then((res: any) => {  
            const recordPermission = res;
            this.setState({ recordPermission });
        });
    }

    public componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        // AppState.removeEventListener('change', this.onHandleAppStateChange);
    }


    public componentWillReceiveProps({ chatList, phrases, translatedContent, voiceMessageError, blockedUsers, ...rest }: IChatDetailedProps){
        if(chatList !== this.props.chatList) {
            let chatItem = chatList.find((o: any) => o.id === this.state.id);
            let oldChatItem = this.props.chatList.find((o: any) => o.id === this.state.id);
            if(oldChatItem && chatItem && oldChatItem.detailedChatList && chatItem.detailedChatList && chatItem.detailedChatList[chatItem.detailedChatList.length - 1].id != oldChatItem.detailedChatList[oldChatItem.detailedChatList.length - 1].id){
                setTimeout(() => {
                    this.scrollToBottom();
                }, 0);
            }
            if(oldChatItem && chatItem && chatItem.typing !== oldChatItem.typing){
                (this.props as any).navigation.setParams({ typing: chatItem.typing });
            }
        }
        if(translatedContent !== this.props.translatedContent && translatedContent && translatedContent.length > 0) {
            if(this.state.isBottom){
                this.scrollToBottom();
            }
        }
        if(voiceMessageError !== this.props.voiceMessageError && voiceMessageError){
            const languageContent = chatDetailedLanguages[this.props.spokenLanguage];
            let recordToolTip: any = languageContent.voiceNotClear;
            this.setState({ recordToolTip }, () => {
                setTimeout(() => {
                    recordToolTip = undefined;
                    this.setState({ recordToolTip });
                }, 5000);
            });
        }
        if(blockedUsers.slice() !== this.props.blockedUsers.slice()){
            const isUserBlocked = this.isUserBlocked();
            this.setState({ isUserBlocked });
        }
        if(this.props.phrases !== phrases && this.state.phrases !== undefined){
            this.setState({ phrases });
        }
    }

    public render() {
        const { viewStyle } = styles;
        const { translationLoading } = this.props;

        return (
            Platform.OS === 'ios' ? 
                <KeyboardAvoidingView keyboardVerticalOffset={65} behavior='padding' style={viewStyle} pointerEvents={translationLoading ? 'none' : 'auto'}>
                    { this.renderMain() }
                </KeyboardAvoidingView> 
                : 
                <View style={viewStyle} pointerEvents={translationLoading ? 'none' : 'auto'}>
                    { this.renderMain() }
                </View>
        );
    }

    private renderMain(){
        const { viewLoadingStyle, chatWrapperStyle, chatLastDetailItemStyle, translatedTextWrapperStyle, translatedTextStyle, footerWrapperStyle, chatDetailItemStyle, iconStyle, textInputWrapperStyle, buttonStyle, textInputStyle } = styles;
        const { translationLoading, chatList, userUid, content, translatedContent, foundList, loading, isSwitched, learningLanguage, spokenLanguage, voiceMessageError } = this.props;
        const { isUserBlocked, showPicker, pickerValue, phrases, editingMessageId, id, otherUsersSettings, paginationNum, itemClickedId, voiceLoading, screenHeight, showArrows, recordToolTip, recording, playing, recordDuration, playDuration, startRecord, alert, screenWidth, reasonError } = this.state;

        const otherUserPrimaryPhoto = (this.props as any).navigation.getParam('otherUserPrimaryPhoto')
        const primaryPhoto = (this.props as any).navigation.getParam('primaryPhoto')
        let chatItem = chatList.find((o: any) => o.id === id);

        let chatDetailList = chatItem ? chatItem.detailedChatList : [];
        chatDetailList = sortList(chatDetailList, true, 'date');
        chatDetailList = chatDetailList.slice(Math.max(chatDetailList.length - paginationNum, 0));
        const languageContent = chatDetailedLanguages[spokenLanguage];

        return (
            <React.Fragment>
                <StatusBar barStyle="light-content" hidden={false} translucent={false} backgroundColor="#007aff" />
                {isUserBlocked && !showPicker &&
                    <ChatDetailedUserBlocked 
                        languageContent={languageContent}
                        onBlockUser={this.onBlockUser}
                    />
                }
                <ChatDetailedPicker 
                    languageContent={languageContent}
                    pickerValue={pickerValue}
                    isUserBlocked={isUserBlocked} 
                    onOptionsChanged={this.onOptionsChanged} 
                    onHidePicker={() => this.setState({ showPicker: false, pickerValue: undefined, reasonError: undefined })} 
                    onReasonChanged={this.onReasonChanged}
                    error={reasonError}
                    onReportUser={this.onReportUser}
                    showPicker={showPicker}
                    onBlockUser={this.onBlockUser}
                />
                {chatDetailList.length > 0 ?
                    <Button activeOpacity={1} style={{ position: 'relative', flex: 1, alignItems: 'stretch', justifyContent: 'center', flexDirection: 'column'}} transparent={true}>
                        <View style={(translationLoading) && viewLoadingStyle} />
                        <ScrollView
                            style={chatWrapperStyle}
                            scrollEventThrottle={0}
                            onScroll={this.onScroll}
                            ref={(view) => { this.scrollViewRef = view }} 
                            onContentSizeChange={(width, height) => { this.findDimensions(width, height) }}
                            keyboardShouldPersistTaps={true}
                        >
                            {chatDetailList.map((item: any, index: number) => (
                                <ChatDetailedListItem 
                                    {...item}
                                    right={item.userUid == userUid} 
                                    style={index === (chatDetailList && chatDetailList.length - 1) ? [chatLastDetailItemStyle] : [chatDetailItemStyle]} 
                                    onPress={() => this.onChatDetailItemClick(id, item.id, item.translatedContent)}
                                    onLayout={e => itemClickedId === item.id && this.onLayout(e, item.translatedContent)}
                                    onOverlayPress={Keyboard.dismiss}
                                    learningLanguage={learningLanguage}
                                    spokenLanguage={spokenLanguage}
                                    otherUserPrimaryPhoto={otherUserPrimaryPhoto}
                                    primaryPhoto={primaryPhoto}
                                    onPlay={(type: string) => this.onPlay(id, item.id, type)}
                                    onStop={() => this.onStop(id, item.id)}
                                    onEdit={() => this.onEditMessage(id, item.id)}
                                    onStopEdit={this.onStopEditMessage}
                                    onCopy={this.onCopy}
                                    screenWidth={screenWidth}
                                    editingMessage={editingMessageId === item.id}
                                />
                            ))}
                            {phrases &&
                                <View style={{ flex: 1, flexDirection: 'column', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowColor: 'black', elevation: 3, backgroundColor: 'white', borderRadius: 10, paddingTop: 5, margin: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: '#007aff', minHeight: 25, fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 15, textAlign: 'center', paddingHorizontal: 10  }}>
                                            { languageContent.phraseTitle + otherUsersSettings.name }
                                        </Text>
                                        <Button style={{ flexDirection: 'column', position: 'absolute', right: 0, top: 0 }} transparent onPress={this.onTogglePhrases}>
                                            <Icon name='ios-close' style={{ color: '#007aff' }} />
                                        </Button>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end', padding: 0, margin: 0 }}>
                                        <ScrollView showsVerticalScrollIndicator  keyboardShouldPersistTaps={'always'} style={{ flexDirection: 'column', padding: 0, margin: 0 }}>
                                            {phrases.map((phrase: any, index: number) => (
                                                <ListItem onPress={() => this.onPressPhrase(phrase)} style={{ borderBottomWidth: 1, marginLeft: 0, marginRight: 0, paddingBottom: 12, paddingTop: 15 }}>
                                                    <Text style={{ fontSize: 12, color: 'black', textAlign: 'center', flex: 1, paddingHorizontal: 10 }}>
                                                        { phrase[spokenLanguage] }
                                                    </Text>
                                                </ListItem>
                                            ))}
                                            <ListItem onPress={() => this.props.onGetPhrases()} style={{ marginLeft: 0, marginRight: 0, paddingBottom: 12, paddingTop: 15 }}>
                                                <Text style={{ fontSize: 12, color: '#007aff', textAlign: 'center', flex: 1, paddingHorizontal: 10 }}>
                                                    { languageContent.more }...
                                                </Text>
                                            </ListItem>
                                        </ScrollView>
                                    </View>
                                </View>
                            }
                        </ScrollView>
                    </Button>
                :
                <React.Fragment>
                    {phrases ?
                        <View style={{ flex: 1, flexDirection: 'column', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowColor: 'black', elevation: 3, backgroundColor: 'white', borderRadius: 10, paddingTop: 5, margin: 10 }}>
                            <Text style={{ color: '#007aff', minHeight: 25, fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 15, textAlign: 'center', paddingHorizontal: 10  }}>
                                { languageContent.phraseTitle + otherUsersSettings.name }
                            </Text>
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end', padding: 0, margin: 0 }}>
                                <ScrollView showsVerticalScrollIndicator  keyboardShouldPersistTaps={'always'} style={{ flexDirection: 'column', padding: 0, margin: 0 }}>
                                        {phrases.map((phrase: any, index: number) => (
                                            <ListItem onPress={() => this.onPressPhrase(phrase)} style={{ borderBottomWidth: (index === phrases.length - 1) ? 0 : 1, marginLeft: 0, marginRight: 0, paddingBottom: 12, paddingTop: 15 }}>
                                                <Text style={{ fontSize: 12, color: 'black', textAlign: 'center', flex: 1, paddingHorizontal: 10 }}>
                                                    { phrase[spokenLanguage] }
                                                </Text>
                                            </ListItem>
                                        ))}
                                </ScrollView>
                            </View>
                        </View>
                    :
                        <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ height: screenHeight && (screenHeight - 150), justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ height: 70, marginHorizontal: 30, justifyContent: 'flex-end' }}> 
                                        <Text style={{ fontSize: 17, textAlign: 'center' }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>
                                                { otherUsersSettings.name } 
                                            </Text>
                                            {languageContent.speaks}
                                            <Text style={{ color: '#007aff', fontStyle: 'italic', fontSize: 17 }}>
                                                {reverseFormatLanguages(otherUsersSettings.spokenLanguage, spokenLanguage)}
                                            </Text>
                                            {languageContent.wantsToLearn}
                                            <Text style={{ color: '#007aff', fontStyle: 'italic', fontSize: 17 }}>
                                                {reverseFormatLanguages(otherUsersSettings.learningLanguage, spokenLanguage)}
                                            </Text>
                                        </Text>
                                        </View>
                                            <View style={{ height: screenHeight/3, width: screenHeight/3, borderRadius: screenHeight/6, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                                {otherUserPrimaryPhoto ?
                                                    <Button onPress={() => (this.props as any).navigation.navigate('ProfileDetailed', { title: otherUsersSettings.name, about: otherUsersSettings.about, id, otherUsersSettings })} transparent style={{ shadowColor: '#000', 
                                                    shadowOffset: { width: 0, height: 2 }, 
                                                    shadowOpacity: 0.2, elevation: 3, height: '100%', width: '100%' }}>
                                                        <View style={{ position: 'absolute', zIndex: 0, backgroundColor: '#bbbbbb', width: screenHeight/3, height: screenHeight/3, borderRadius: screenHeight/6 }} />
                                                        <Image
                                                            source={{ uri: otherUserPrimaryPhoto.path }}
                                                            style={{ width: screenHeight/3, height: screenHeight/3, borderRadius: screenHeight/6 }}
                                                        />
                                                    </Button> 
                                                    :
                                                    <Icon name='ios-happy' style={{ color: 'white', fontSize: screenHeight/3 }} />
                                                }
                                            </View>
                                        <View style={{ flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center', marginTop: 20 }}>
                                            {foundList && foundList[0] && foundList[0].userUid !== otherUsersSettings.userUid && showArrows ?
                                                <Animated.View
                                                    style={{ 
                                                        transform: [
                                                            {
                                                                scaleX: this.pulseAnim.interpolate({
                                                                    inputRange: [0, 1],
                                                                    outputRange: [1, 1.07]
                                                                })
                                                            },
                                                            {
                                                                scaleY: this.pulseAnim.interpolate({
                                                                    inputRange: [0, 1],
                                                                    outputRange: [1, 1.07]
                                                                })
                                                            }
                                                        ]
                                                    }}
                                                >
                                                    <Button onPress={this.onBackClick} transparent style={{ height: 70, width: 70, justifyContent: 'center', alignItems: 'center' }}>
                                                        <View style={{ backgroundColor: '#007aff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 4, height: 60, width: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                                                            <Icon name='ios-arrow-back' style={[{ color: 'white', fontSize: 35 }, Platform.OS === 'ios' ? { marginRight: 3, marginTop: 3 }: { marginRight: 5 }]} />
                                                        </View>
                                                    </Button>
                                                </Animated.View>
                                                :
                                            showArrows && 
                                                <View style={{ height: 70, width: 70 }} />
                                            }
                                            <Button transparent style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.onSayHi(languageContent.hello, id, otherUsersSettings)}>
                                                <Text style={{ color: '#007aff', textAlign: 'center', fontStyle: 'italic', fontSize: 17 }}>
                                                    { languageContent.sayHi }
                                                </Text>
                                            </Button>
                                            {foundList && foundList[0] && foundList[foundList.length - 1].userUid !== otherUsersSettings.userUid && showArrows ?
                                                <Animated.View 
                                                    style={{ 
                                                        transform: [
                                                            {
                                                                scaleX: this.pulseAnim.interpolate({
                                                                    inputRange: [0, 1],
                                                                    outputRange: [1, 1.07]
                                                                })
                                                            },
                                                            {
                                                                scaleY: this.pulseAnim.interpolate({
                                                                    inputRange: [0, 1],
                                                                    outputRange: [1, 1.07]
                                                                })
                                                            }
                                                        ]
                                                    }}
                                                >
                                                    <Button onPress={this.onNextClick} transparent style={{ height: 70, width: 70, justifyContent: 'center', alignItems: 'center' }}>
                                                        <View style={{ backgroundColor: '#007aff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2,  elevation: 4, height: 60, width: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                                                            <Icon name='ios-arrow-forward' style={[{ color: 'white', fontSize: 35 }, Platform.OS === 'ios' ? { marginLeft: 3, marginTop: 3 } : { marginLeft: 5 }]} />
                                                        </View>
                                                    </Button>
                                                </Animated.View>
                                                :
                                            showArrows &&
                                                <Animated.View
                                                    style={{ 
                                                        transform: [
                                                            {
                                                                scaleX: this.pulseAnim.interpolate({
                                                                    inputRange: [0, 1],
                                                                    outputRange: [1, 1.07]
                                                                })
                                                            },
                                                            {
                                                                scaleY: this.pulseAnim.interpolate({
                                                                    inputRange: [0, 1],
                                                                    outputRange: [1, 1.07]
                                                                })
                                                            }
                                                        ]
                                                    }}
                                                >
                                                    <Button onPress={this.onNextClick} transparent style={{ height: 70, width: 70, justifyContent: 'center', alignItems: 'center' }}>
                                                        <View style={{ backgroundColor: '#007aff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 4, height: 60, width: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                                                            <Image 
                                                                source={require('./globe-white.png')}
                                                                style={{ height: 25, width: 25 }}
                                                            />
                                                        </View>
                                                    </Button>
                                                </Animated.View>
                                            }
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    }
                </React.Fragment>
                }
                {alert &&
                    <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center',  }}>
                        <View style={{ backgroundColor: 'rgba(255,255,255, 1)', borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: 'black'  }}>
                            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,.85)', fontWeight: '500', padding: 20 }}>
                                { alert }
                            </Text>
                        </View>
                    </View>
                }
                {!isUserBlocked && pickerValue !== 'report' &&
                    <View style={[footerWrapperStyle]}>
                    {learningLanguage !== 'none' && (translatedContent && translatedContent.length > 0) && (content !== null && content.length > 0) &&
                        <View style={{ marginRight: 50, marginLeft: 0 }}>
                            <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator style={{ maxHeight: screenHeight/4, overflow: 'hidden'}}>
                                <TouchableOpacity onPress={this.props.onSwitchContent} style={[translatedTextWrapperStyle]}>
                                    <Text uppercase={false} style={[ translatedTextStyle ]}>
                                        { loading ? '' : translatedContent }
                                    </Text>
                                    <Text style={{ position: 'absolute', fontSize: 13, right: 10.5, fontWeight: "400", color: 'grey', textTransform: 'uppercase' }}> 
                                        {(isSwitched ? spokenLanguage : learningLanguage)}
                                    </Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    }
                    {recordToolTip &&
                        <View style={{ position: 'absolute', top: -45, right: 5, backgroundColor: 'white', borderRadius: 12 }}>
                            <View style={{ position: 'absolute', backgroundColor: 'white', width: 25, height: 25, right: 6, bottom: -5, transform: [{ rotate: '45deg'}] }} />
                            <Text style={{ padding: 10, textAlign: 'center', fontSize: 12 }}> { recordToolTip } </Text>
                        </View>
                    }
                    <View style={textInputWrapperStyle}> 
                        <TextInput
                            onChangeText={e => this.onChangeChatText(e, id, otherUsersSettings)} 
                            value={content}
                            editable={true}
                            autoCorrect={false}
                            onKeyPress={e => this.onKeyPress(e, id, content)} 
                            multiline={true} 
                            textAlignVertical={'center'}
                            placeholderTextColor='rgba(0,0,0,.35)'
                            placeholder={((languageContent && languageContent.typeMessage)) + ' ' +  (reverseFormatLanguages(spokenLanguage, spokenLanguage) + ' ' + languageContent.or + ' ' + reverseFormatLanguages(learningLanguage, spokenLanguage)) + '...'}
                            style={[textInputStyle, { maxHeight: screenHeight/4 }, editingMessageId !== undefined && { borderColor: 'teal', shadowColor: 'transparent' } ]}
                        />
                        {(translatedContent && translatedContent.length > 0 && content !== null && content.length > 0) && 
                            <Text style={{ position: 'absolute', right: 55, elevation: 2, fontSize: 13, color: 'rgba(0,0,0,.35)', textTransform: 'uppercase'}}> 
                                {(!isSwitched ? spokenLanguage : learningLanguage )} 
                            </Text>
                        }
                        {startRecord &&
                            <View style={{ position: 'absolute', elevation: 2, flexDirection: 'row', alignItems: 'center', top: 0, bottom: 0, right: 45, left: 0, backgroundColor: 'white', borderRadius: 25, maxHeight: 80, paddingHorizontal: 10 }}>
                                {!recording && !playing &&
                                    <Button onPress={this.onPlayRecord} transparent style={{ alignItems: 'center', width: 40, justifyContent: 'center', height: '100%' }}>
                                        <Icon name='ios-play' style={{ color: '#007aff', textAlign: 'center', width: 40, marginRight: 5, marginLeft: 0, fontSize: 30 }} />
                                    </Button>
                                }
                                {!recording && playing &&
                                    <Button transparent onPress={this.onStopRecord} style={{ alignItems: 'center', width: 40, justifyContent: 'center', height: '100%' }}>
                                        <Icon name='ios-square' style={{ color: '#007aff', textAlign: 'center', width: 40, marginRight: 5, marginLeft: 0, fontSize: 30 }} />
                                    </Button>
                                }
                                {!recording &&
                                    <View style={{ flex: 1, height: 3, marginRight: 0, position: 'relative', overflow: 'hidden' }}>
                                        <View style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0,  backgroundColor: 'rgba(0,0,0,.2)' }} />
                                        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: ((playDuration / recordDuration) * 100) + '%', backgroundColor: '#007aff' }} />
                                    </View>
                                }
                                {recording &&
                                    <View style={{ flex: 1 }} />
                                }
                                {!recording &&
                                    <Button onPress={this.onRemoveRecording} transparent style={{ alignItems: 'center', width: 40, justifyContent: 'center', height: '100%' }}>
                                        <Icon name='ios-close' style={{ color: '#007aff', textAlign: 'center', width: 40, marginRight: 0, marginLeft: 3, fontSize: 35 }} />
                                    </Button>
                                }
                                {recording ?
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={{ fontSize: 12, marginLeft: 0 }}> { msToTime(recordDuration) } </Text>
                                    </View>
                                    :
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={{ fontSize: 12, marginLeft: 0 }}> { msToTime(playDuration) } </Text>
                                    </View>
                                }
                            </View>
                        }
                        {content !== null && content.length > 0 && editingMessageId === undefined ?
                            <Button disabled={loading} style={buttonStyle} onPress={() => !loading && this.onSendMessage(id, otherUsersSettings)}>
                                <Icon name='ios-arrow-forward' style={iconStyle}/>
                            </Button>
                            :
                        content !== null && content.length > 0 && editingMessageId !== undefined ?
                            <Button disabled={voiceLoading || loading} style={buttonStyle} onPressIn={this.onFinishEditMessage} onPressOut={() => this.onStopRecordMessage()}>
                                <Icon name='ios-checkmark' style={[iconStyle, { fontSize: 30 }]}/>
                            </Button>
                        :
                        (!startRecord && !recording) ?
                            <Button disabled={voiceLoading || loading} style={buttonStyle} onPress={() => this.onRecordMessage()}>
                                <Icon name='ios-mic' style={iconStyle}/>
                            </Button>
                            :
                        (startRecord && recording) ?
                            <Button style={buttonStyle} onPress={() => this.onStopRecordMessage()}>
                                <Icon name='ios-square' style={iconStyle}/>
                            </Button>
                            :
                            <Button disabled={loading} style={buttonStyle} onPress={() => !loading && this.onSendMessage(id, otherUsersSettings, true)}>
                                <Icon name='ios-arrow-forward' style={iconStyle}/>
                            </Button>
                        }
                    </View>
                </View>
                }
            </React.Fragment>
        )
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

    private isUserBlocked(){
        const { blockedUsers } = this.props;
        const { otherUsersSettings } = this.state;
        let index = -1;

        if(blockedUsers !== undefined){
            index = blockedUsers.findIndex(element => {
                if(element){
                    return element === otherUsersSettings.userUid;
                }
                else { 
                    return false;
                }
            });
        }

        if(index === -1) {
            return false;
        }
        else {
            return true;
        }
    }

    private onTogglePhrases(){
        const { phrases } = this.state;
        if(phrases === undefined){
            this.setState({ phrases: this.props.phrases }, () => {
                this.scrollToBottom();
            });
        }
        else {
            this.setState({ phrases: undefined })
        }
    }

    private onShowPicker(){
        this.setState({ showPicker: true, reasonError: undefined });
    }

    private onOptionsChanged(pickerValue: any){
        this.setState({ pickerValue, showPicker: false });
    }

    private onReasonChanged(reason: any){
        this.setState({ reason });
    }
    
    private onReportUser() {
        const { id, otherUsersSettings, reason  } = this.state;
        const languageContent = chatDetailedLanguages[this.props.spokenLanguage];
        if(reason && reason.length > 0){
            this.props.onReportUser(otherUsersSettings, id, reason);
            this.setState({ pickerValue: undefined, reason: undefined, reasonError: undefined });
        }
        else {
            this.setState({ reasonError: languageContent.reportingDescription })
        }
    }

    private onBlockUser() {
        const { otherUsersSettings } = this.state;
        this.props.onBlockUser(otherUsersSettings);
        this.setState({ pickerValue: undefined, reason: undefined });
    }

    private onPressPhrase(phrase: any){
        this.props.onPressPhrase(phrase);
    }

    private onFinishEditMessage(){
        const otherUsersSettings = this.state.otherUsersSettings;
        const chatItemId = this.state.id;
        const chatDetailItemid = this.state.editingMessageId;
        if(chatDetailItemid){
            this.props.onFinishEditMessage(chatItemId, chatDetailItemid, otherUsersSettings);
            this.setState({ editingMessageId: undefined })
        }
    }

    private onEditMessage(id: string, itemId: string) {
        this.setState({ editingMessageId: itemId }, () => {
            this.props.onEditMessage(id, itemId);
        });
    }

    private onStopEditMessage() {
        this.setState({ editingMessageId: undefined }, () => {
            this.props.onStopEditMessage();
        });
    }

    private onCopy(type: string){
        const languageContent = chatDetailedLanguages[this.props.spokenLanguage];

        let alert = '';

        if(type === 'translation'){
            alert = languageContent.translationCopied;
        }
        else if(type === 'message'){
            alert = languageContent.messageCopied;
        }

        if(this.copyInterval !== undefined){
            clearInterval(this.copyInterval);
        }
        this.copyInterval =  setInterval(this.removeAlert, 4000);
        this.setState({ alert });
    }

    private removeAlert(){
        this.setState({ alert: undefined });
    }

    private onRecordMessage(){
        this.voiceMessagePath = null;
        this.audioRecorderPlayer = new AudioRecorderPlayer();

        (async () => {
            const languageContent = chatDetailedLanguages[this.props.spokenLanguage];
            let stopped = false;
            if(Platform.OS || this.state.recordPermission && this.state.storagePermission) {
                this.setState({ recording: true, startRecord: true, recordDuration: 0, voiceLoading: true }, () => {
                    (async () => {
                        await this.audioRecorderPlayer.stopRecorder();
                        this.voiceMessagePath = await this.audioRecorderPlayer.startRecorder();
                        this.audioRecorderPlayer.addRecordBackListener((e: any) => {
                            if(this.state.recording){
                                const recordDuration = Math.floor(e.current_position/1000);
                                if (recordDuration === 15 && !stopped) {
                                    stopped = true;
                                    this.onStopRecordMessage();
                                }

                                if(this.state.recording && recordDuration !== this.state.recordDuration){
                                    this.setState({ recordDuration });
                                }
                            }
                        });
                    })();
                });
            }
            else {
                let recordToolTip: any = languageContent.noPermissions;
                this.setState({ recordToolTip, recordDuration: 0, startRecord: false }, () => {
                    this.getPermission('storage').then((res: any) => {  
                        const storagePermission = res;
                        this.setState({ storagePermission });
                    });
        
                    this.getPermission('record').then((res: any) => {  
                        const recordPermission = res;
                        this.setState({ recordPermission });
                    });
                    
                    setTimeout(() => {
                        recordToolTip = undefined;
                        this.setState({ recordToolTip });
                    }, 3000);
                });
            }
        })();
    }

    private getPermission(type: string) {
        return new Promise((resolve) => {
            (async () => {
                if(type === 'storage'){
                    try {
                        if (Platform.OS === 'android') {
                            const granted = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                            {
                                title: 'Permissions for write access',
                                message: 'Give permission to your storage to write a file',
                                buttonPositive: 'ok',
                            },
                            );
                            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                console.log('You can use the storage');
                                resolve(true);
                            } else {
                                console.log('permission denied');
                                resolve(false);
                            }
                        }
                    } catch (err) {
                        console.warn(err);
                        resolve(false);
                    }
                }
                else if(type === 'record'){
                    try {
                        if (Platform.OS === 'android') {
                            const granted = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                            {
                                title: 'Permissions for write access',
                                message: 'Give permission to your storage to write a file',
                                buttonPositive: 'ok',
                            },
                            );
                            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                console.log('You can use the camera');
                                resolve(true);
                            } else {
                                console.log('permission denied');
                                resolve(false);
                            }
                        }
                    } catch (err) {
                        console.warn(err);
                        resolve(false);
                    }
                }
                else {
                    resolve(false);
                }
            })();
        });
    }

    private onStopRecordMessage(){
        this.setState({ recording: false }, () => {
            setTimeout(() => {
                if(this.voiceMessagePath !== null) {
                    (async () => {
                        this.voiceMessagePath = await this.audioRecorderPlayer.stopRecorder();
                        this.audioRecorderPlayer.removeRecordBackListener();
                        Mixpanel.trackWithProperties("Recorded Journal Voice Message", { userUid: this.props.userUid });
                        this.setState({ voiceLoading: false });
                    })();
                }
            }, 300);
        });
    }

    private onRemoveRecording(){
        this.setState({ startRecord: false });
        this.voiceMessagePath = null;
    }

    private onPlayRecord(){
        this.setState({ playing: true }, () => {
            (async () => {
                const msg = await this.audioRecorderPlayer.startPlayer(this.voiceMessagePath);
                this.audioRecorderPlayer.addPlayBackListener((e: any) => {
                    const playDuration = Math.floor(e.current_position/1000);
                    if(this.state.playing && playDuration !== this.state.playDuration && playDuration <= this.state.recordDuration){
                        this.setState({ playDuration });
                    }
                    if (e.current_position === e.duration) {
                        this.onStopRecord();
                    }
                    return;
                });
            })();
        })
    }

    private onStopRecord(){
        this.setState({ playing: false, playDuration: 0 }, () => {
            this.audioRecorderPlayer.stopPlayer();
            this.audioRecorderPlayer.removePlayBackListener();
        });
    }
    
    private onStop(id: string, itemId: string) {
        this.props.onStop(id, itemId);
    }

    private onPlay(id: string, itemId: string, type: string){
        this.props.onPlay(id, itemId, type)
    }

    private onNextClick(){
        this.props.onNextChat(this.state.otherUsersSettings.userUid, (this.props as any).navigation);
    }

    private onBackClick(){
        this.props.onBackChat((this.props as any).navigation);
    }

    private onScrollViewLayout(){
        this.scrollToBottom();
    }

    private onLayout(event: any, translatedContent: string) {
        const { height } = event.nativeEvent.layout;
        if(translatedContent && translatedContent.length > 0 && !this.state.isTop && this.state.isBottom){
            this.setState({ height, itemClickedId: null }, () => {
                this.scrollViewRef.scrollTo({x: 0, y: this.state.currentY + height, animated: true }); 
            });
        }
    }

    private findDimensions(width: any, height: any) {
        const deviceHeight = Dimensions.get("window").height;
        if(deviceHeight > height) {
            this.setState({ isBottom: true })
        }
    }

    private scrollToBottom(){
        if(this.scrollViewRef && this.scrollViewRef.scrollToEnd){
            setTimeout(() => {
                if(this.scrollViewRef && this.scrollViewRef.scrollToEnd){
                    this.scrollViewRef.scrollToEnd({ animated: false });
                } 
            }, 0);
        }
    }

    private keyboardDidShow() {
        let chatItem = this.props.chatList.find((o: any) => o.id === this.state.id);
        if(chatItem === undefined){
            this.setState({ phrases: this.props.phrases });
        }

        if(this.props.content === null || this.props.content.length === 0){
            this.scrollToBottom();
        }
    }

    private keyboardDidHide() {
        if(this.state.phrases !== null){
            this.setState({ phrases: null });
        }
    }

    private onScroll(e: any){
        const { nativeEvent } = e;
        const currentY = nativeEvent.contentOffset.y;
        if (this.isCloseToBottom(nativeEvent)) {
            this.setState({ isBottom: true, isTop: false, currentY })
        }
        else if (this.isCloseToTop(nativeEvent)) {
            this.setState({ isTop: true, isBottom: false, currentY })
        }
        else {
            this.setState({ isBottom: false, isTop: false, currentY })
        }
    }

    private isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize } : any ) => {
        const paddingToBottom = 90;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };

    private isCloseToTop = ({ contentOffset } : any ) => {
        const paddingToTop = 90;
        return contentOffset.y <= paddingToTop;
    };

    private onChatDetailItemClick(userUid: string, itemId: string, translatedContent: string){
        if(this.scrollViewRef && this.scrollViewRef.scrollToEnd){
            this.setState({ itemClickedId: itemId }, () => {
                this.props.onChatDetailItemClick(userUid, itemId);
            })
        }
    }

    private onKeyPress(e: any, id: string, value?: string | null){
        if(value !== undefined && value !== null){
            const secondLastChar = value[value.length - 2];
            const lastChar = value[value.length - 1];

            if((!(/\s/.test(secondLastChar))) && (/\s/.test(e.nativeEvent.key)) || ((/\s/.test(lastChar)) && e.nativeEvent.key === 'Backspace') || (lastChar === undefined && e.nativeEvent.key === 'Backspace')){
                this.props.onChangeTranslationChatText(value, id);
            }
        }
    }

    private onSendMessage(id: string, otherUsersSettings: any, voice?: boolean){
        if(voice){
                this.setState({ startRecord: false, itemClickedId: id, phrases: undefined }, () => {
                    this.props.onSendVoiceMessage(id, otherUsersSettings, this.voiceMessagePath);
                });
        }
        else {
            this.setState({ itemClickedId: id, phrases: undefined }, () => {
                this.props.onSendMessage(id, otherUsersSettings);
            });
        }
    }


    private onSayHi(content: string, id: string, otherUsersSettings: any){
        this.props.onChangeChatText(content, id, otherUsersSettings);
        this.props.onChangeTranslationChatText(content, id);
    }

    private onChangeChatText(content: string, id: string, otherUsersSettings: any){
        this.props.onChangeChatText(content, id, otherUsersSettings);
    }

};

const styles = StyleSheet.create({
    chatDetailItemStyle: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingHorizontal: 7,
        borderWidth: 0
    },
    chatLastDetailItemStyle: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingHorizontal: 7,
    },
    viewStyle: {
        backgroundColor: '#eff0f1',
        flex: 1
    },
    viewLoadingStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1,
        opacity: 0.4,
        backgroundColor: '#eff0f1',
        flex: 1,
    },
    chatWrapperStyle : {
        flexDirection: 'column',
        flex: 1,
        marginTop: -6,
        marginBottom: -6
    },
    textInputStyle: {
        backgroundColor: 'white',
        borderWidth: 1, 
        borderColor: 'transparent',
        paddingLeft: 15,
        paddingRight: 35,
        minHeight: 50,
        borderRadius: 25,
        flex: 1,
        shadowOffset: { width: 2, height: 2 }, 
        shadowOpacity: 0.2,
        shadowColor: 'black',
        elevation: 1,
    },
    textInputWrapperStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 5,
        marginHorizontal: 5
    },
    translatedTextWrapperStyle: {
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative',
        paddingRight: 0,
        marginRight: 0, 
        marginLeft: 0
    },
    footerWrapperStyle: {
        flexDirection: 'column',
        position: 'relative'
    },
    translatedTextStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: "bold",
        color: 'black',
        paddingLeft: 13,
        paddingRight: 35,
        paddingBottom: 10,
        textAlign: 'center'
    },
    buttonStyle: {
        backgroundColor: '#007aff',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 40,
        borderRadius: 20,
        marginLeft: 5,
        padding: 0,
        flex: 0,
        shadowOffset: { width: 2, height: 2 }, 
        shadowOpacity: 0.2,
        shadowColor: 'black'
    },
    iconStyle: {
        fontSize: 20, 
        width: 15,
        textAlign: 'center'
    }
});


const mapStateToProps = (state: any) => {
    const { chat, auth, global, accountSettings } = state;
    const { userUid } = auth;
    const { loading } = global;
    const { chatList, translationLoading, content, voiceMessageError, translatedContent, isSwitched, tab, foundList, phrases } = chat;
    const { spokenLanguage, learningLanguage, blockedUsers } = accountSettings;
    
    return {
        phrases,
        content,
        foundList,
        translatedContent,
        isSwitched,
        chatList,
        tab,
        userUid,
        loading,
        translationLoading,
        spokenLanguage,
        learningLanguage,
        blockedUsers,
        voiceMessageError
    };
};
  
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        onChangeChatText: bindActionCreators(
            chatActions.onChangeChatText,
            dispatch
        ),
        onChangeTranslationChatText: bindActionCreators(
            chatActions.onChangeTranslationChatText,
            dispatch
        ),
        onSendMessage: bindActionCreators(
            chatActions.onSendMessage,
            dispatch
        ),
        onPressPhrase: bindActionCreators(
            chatActions.onPressPhrase,
            dispatch
        ),
        onEditMessage: bindActionCreators(
            chatActions.onEditMessage,
            dispatch
        ),
        onStopEditMessage: bindActionCreators(
            chatActions.onStopEditMessage,
            dispatch
        ),
        onSendVoiceMessage: bindActionCreators(
            chatActions.onSendVoiceMessage,
            dispatch
        ),
        onChatDetailItemClick: bindActionCreators(
            chatActions.onChatDetailItemClick,
            dispatch,
        ),
        onNextChat: bindActionCreators(
            chatActions.onNextChat,
            dispatch,
        ),
        onPlay: bindActionCreators(
            chatActions.onPlay,
            dispatch,
        ),
        onChangeChatUserAppState: bindActionCreators(
            chatActions.onChangeChatUserAppState,
            dispatch,
        ),
        onStop: bindActionCreators(
            chatActions.onStop,
            dispatch,
        ),
        onBackChat: bindActionCreators(
            chatActions.onBackChat,
            dispatch,
        ),
        onSetLoading: bindActionCreators(
            globalActions.onSetLoading,
            dispatch,
        ),
        onFinishEditMessage: bindActionCreators(
            chatActions.onFinishEditMessage,
            dispatch,
        ),
        onSwitchContent: bindActionCreators(
            chatActions.onSwitchContent,
            dispatch,
        ),
        onGetPhrases: bindActionCreators(
            chatActions.onGetPhrases,
            dispatch
        ),
        onReportUser: bindActionCreators(
            chatActions.onReportUser,
            dispatch
        ),
        onBlockUser: bindActionCreators(
            chatActions.onBlockUser,
            dispatch
        )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatDetailed);
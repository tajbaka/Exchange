import React from 'react';

import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { journalActions, sortList, reverseFormatLanguages, globalActions, sameDay, msToTime } from '../../../../../actions';

import { JournalListItem } from './components';

import { journalLanguages } from './languages';

import { StatusBar, StyleSheet, Keyboard, Platform, TextInput, ScrollView, KeyboardAvoidingView, Dimensions, PermissionsAndroid, TouchableOpacity } from 'react-native';

import { NativeBase, View,  Icon, Text, Button } from 'native-base';

import changeNavigationBarColor from 'react-native-navigation-bar-color';

import AudioRecorderPlayer from 'react-native-audio-recorder-player';

import CalendarPicker from 'react-native-calendar-picker';

import moment from 'moment'; 

import Mixpanel from 'react-native-mixpanel';

export interface IJournalProps extends NativeBase.Container {
    translationLoading?: boolean;
    translatedContent: string;
    spokenLanguage: string;
    learningLanguage: string,
    voiceMessageError: boolean;
    isSwitched: boolean;
    journalEntryStatement: string;
    primaryPhoto: string;
    content: string;
    loading?: boolean;
    selectedStartDate: any;
    selectedStartDateNotified: Date;
    userUid: string;
    journalList: Array<any>;
    onSetLoading: (loading: boolean) => (dispatch: Dispatch<any>) => Promise<void>;
    onChangeText: (content: string) => (dispatch: Dispatch<any>) => Promise<void>;
    onChangeTranslationText: (value: string) => (dispatch: Dispatch<any>) => Promise<void>;
    onSendMessage: (selectedStartDate: Date) => (dispatch: Dispatch<any>) => Promise<void>;
    onSendVoiceMessage: (selectedStartDate: Date, voiceMessagePath: string) => (dispatch: Dispatch<any>) => Promise<void>;
    onItemClick: (selectedStartDate: string, chatDetailItemId: string) => (dispatch: Dispatch<any>) => Promise<void>;
    onPlay: (selectedStartDate: string, chatDetailItemId: string, type: string) => (dispatch: Dispatch<any>) => Promise<void>;
    onStop: (selectedStartDate: string, chatDetailItemId: string) => (dispatch: Dispatch<any>) => Promise<void>;
    onSwitchContent:() => (dispatch: Dispatch<any>) => Promise<void>;
    onDateChange:(selectedStartDate: any) => (dispatch: Dispatch<any>) => Promise<void>;
    onUpdateSelectedStartDateNotified:(selectedStartDateNotified: Date | null) => (dispatch: Dispatch<any>) => Promise<void>;
}

interface IJournalState {
    selectedStartDate: any;
    selectedStartDateFormated: any;
    isBottom?: boolean;
    isTop?: boolean;
    paginationNum: number;
    editingMessageId?: string; 
    currentY?: any;
    height?: any;
    recordToolTip?: string;
    alert?: string;
    itemClickedId: any;
    screenHeight: number;
    screenWidth: number;
    recording: boolean;
    autoSend: boolean;
    playing: boolean;
    startRecord: boolean;
    recordDuration: number;
    playDuration: number;
    voiceLoading: boolean;
    storagePermission: boolean;
    recordPermission: boolean;
    months: Array<string>;
    weeks: Array<string>;
    previousTitle: string;
    nextTitle: string;
    toggleShowCalendar: boolean;
}

class Journal extends React.Component<IJournalProps, IJournalState> {

    private scrollViewRef: any;
    private keyboardDidShowListener: any;
    private keyboardDidHideListener: any;
    private audioRecorderPlayer: any;
    private voiceMessagePath: any;
    private copyInterval: any;

    constructor(props: IJournalProps){
        super(props);
        this.onSendMessage = this.onSendMessage.bind(this);
        this.onEditMessage = this.onEditMessage.bind(this);
        this.onStopEditMessage = this.onStopEditMessage.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.keyboardDidShow = this.keyboardDidShow.bind(this);
        this.keyboardDidHide = this.keyboardDidHide.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.isCloseToBottom = this.isCloseToBottom.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.renderMain = this.renderMain.bind(this);
        this.onLayout = this.onLayout.bind(this);
        this.onScrollViewLayout = this.onScrollViewLayout.bind(this);
        this.findDimensions = this.findDimensions.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.showCalendar = this.showCalendar.bind(this);

        this.onStop = this.onStop.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onCopy = this.onCopy.bind(this);
        this.removeAlert = this.removeAlert.bind(this);

        this.onRecordMessage = this.onRecordMessage.bind(this);
        this.onStopRecordMessage = this.onStopRecordMessage.bind(this);
        this.onStopRecord = this.onStopRecord.bind(this);
        this.onPlayRecord = this.onPlayRecord.bind(this);
        this.onRemoveRecording = this.onRemoveRecording.bind(this);
        this.onFinishEditMessage = this.onFinishEditMessage.bind(this);

        const screenHeight = Math.round(Dimensions.get('window').height);
        const screenWidth = Math.round(Dimensions.get('window').width);

        const { spokenLanguage, selectedStartDateNotified } = this.props;
        let { selectedStartDate } = this.props;

        let weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let previousTitle = 'Previous'
        let nextTitle="Next"

        if(spokenLanguage === 'es'){
            weeks = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
            months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            previousTitle="Anterior";
            nextTitle="Próximo"
        }

        if(selectedStartDate === undefined){
            selectedStartDate = moment().unix();
        }

        const selectedStartDateFormated = new Date(globalActions.timeConverter(selectedStartDateNotified ? selectedStartDateNotified : selectedStartDate));

        this.state = {
            selectedStartDate: selectedStartDateNotified ? selectedStartDateNotified : selectedStartDate,
            selectedStartDateFormated,
            toggleShowCalendar: false,
            previousTitle,
            nextTitle,
            weeks, 
            months,
            paginationNum: 20,
            recordDuration: 0,
            playDuration: 0,
            itemClickedId: null,
            screenHeight,
            screenWidth,
            recording: false,
            startRecord: false,
            playing: false,
            voiceLoading: false,
            recordPermission: false,
            storagePermission: false,
            autoSend: false
        }

        this.scrollViewRef = React.createRef();
    }

    static navigationOptions = {
        header: null,
        headerTintColor: 'white'
    };

    public componentDidMount() {
        changeNavigationBarColor('white', true, false);

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

        this.props.onDateChange(this.state.selectedStartDate);

        setTimeout(() => {
            this.scrollToBottom();
        }, 100);

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
    }

    public componentWillReceiveProps({ journalList, translatedContent, selectedStartDateNotified, selectedStartDate, voiceMessageError }: IJournalProps){
        if(journalList !== this.props.journalList) {
            let journalEntry = journalList.find((o: any) => sameDay(o.selectedStartDate, this.state.selectedStartDate));
            let oldJournalEntry = this.props.journalList.find((o: any) => sameDay(o.selectedStartDate, this.state.selectedStartDate));
            if(oldJournalEntry && journalEntry && journalEntry.list && oldJournalEntry.list && journalEntry.list[journalEntry.list.length - 1].id !== oldJournalEntry.list[oldJournalEntry.list.length - 1].id){
                setTimeout(() => {
                    this.scrollToBottom();
                }, 0);
                const lastJournalItem  = journalEntry.list[journalEntry.list.length - 1];
                const { id } = lastJournalItem;
                this.onPlay(selectedStartDate, id, 'recording');
                
            }
        }
        if(selectedStartDate !== this.props.selectedStartDate && selectedStartDateNotified === null && selectedStartDate !== undefined){
            const selectedStartDateFormated = new Date(globalActions.timeConverter(selectedStartDate));
            this.setState({ selectedStartDate, toggleShowCalendar: false, selectedStartDateFormated });
        }
        if(translatedContent !== this.props.translatedContent && translatedContent && translatedContent.length > 0 && (!this.props.translatedContent || this.props.translatedContent.length === 0)) {
            if(this.state.isBottom){
                this.scrollToBottom();
            }
        }
        if(voiceMessageError !== this.props.voiceMessageError && voiceMessageError){
            const languageContent = journalLanguages[this.props.spokenLanguage];
            let recordToolTip: any = languageContent.voiceNotClear;
            this.setState({ recordToolTip }, () => {
                setTimeout(() => {
                    recordToolTip = undefined;
                    this.setState({ recordToolTip });
                }, 5000);
            });
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
        const { translationLoading, journalList, journalEntryStatement, content, translatedContent, loading, isSwitched, learningLanguage, spokenLanguage, voiceMessageError, primaryPhoto } = this.props;
        const { selectedStartDateFormated, selectedStartDate, toggleShowCalendar, previousTitle, nextTitle, weeks, months, editingMessageId, itemClickedId, voiceLoading, screenWidth, screenHeight, recordToolTip, recording, playing, recordDuration, playDuration, startRecord, alert, autoSend } = this.state;

        let journalEntry = journalList.find((o: any) => sameDay(o.selectedStartDate, selectedStartDate));
        let journalItemList = journalEntry ? journalEntry.list : [];
        journalItemList = sortList(journalItemList, true, 'date');
        const languageContent = journalLanguages[spokenLanguage];

        return (
            <React.Fragment>
                <StatusBar barStyle="dark-content" hidden={false} translucent={false} backgroundColor="white" />
                    <Button activeOpacity={1} style={{ flex: 1, alignItems: 'stretch', flexDirection: 'column' }} transparent={true} onPress={Keyboard.dismiss}>
                        <View style={(translationLoading || voiceLoading) && viewLoadingStyle} />
                        <ScrollView
                            style={chatWrapperStyle}
                            scrollEventThrottle={0}
                            onScroll={this.onScroll}
                            ref={(view) => { this.scrollViewRef = view }} 
                            onContentSizeChange={(width, height) => { this.findDimensions(width, height) }}
                            keyboardShouldPersistTaps={true}
                        >
                            <View style={{ alignItems: 'flex-start', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0, .15)', paddingTop: 10, paddingBottom: 0, paddingHorizontal: 5 }}>
                                <Button onPress={this.showCalendar}  transparent bordered style={{ borderRadius: 10, borderColor: '#007aff', flexDirection: 'row', marginBottom: 10, alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 10 }}> 
                                    <Text style={{ color: '#007aff', fontWeight: '700', paddingLeft: 0, paddingRight: 0 }}>
                                        { selectedStartDateFormated.getDate() }
                                    </Text>
                                    <Text style={{ color: 'grey', fontWeight: 'bold', textTransform: 'uppercase', paddingLeft: 0, paddingRight: 0 }}>
                                        {/* { selectedStartDateFormated.toLocaleString('en-GB', { month: 'long' }).slice(0,3) } */}
                                        {months[selectedStartDateFormated.getMonth()].slice(0,3)}
                                    </Text>
                                    <Icon style={{ opacity: 0.7, color: '#007aff', marginRight: 0, paddingRight: 0 }} name="ios-arrow-down" />
                                </Button>
                                <Text style={{ display: journalEntryStatement && journalEntryStatement.length > 0 ? 'flex' : 'none', color: 'rgba(0,0,0,0.60)', paddingBottom: 10 }}> 
                                    { journalEntryStatement }
                                </Text>
                            </View>
                            {journalItemList.length > 0 && journalItemList.map((item: any, index: number) => (
                                <JournalListItem 
                                    {...item}
                                    style={index === (journalItemList && journalItemList.length - 1) ? [chatLastDetailItemStyle] : [chatDetailItemStyle]} 
                                    onPress={() => this.onItemClick(selectedStartDate, item.id, item.translatedContent)}
                                    onLayout={(e: any) => itemClickedId === item.id && this.onLayout(e, item.translatedContent)}
                                    onOverlayPress={Keyboard.dismiss}
                                    learningLanguage={learningLanguage}
                                    spokenLanguage={spokenLanguage}
                                    onPlay={(type: string) => this.onPlay(selectedStartDate, item.id, type)}
                                    onStop={() => this.onStop(selectedStartDate, item.id)}
                                    screenWidth={screenWidth}
                                    onCopy={this.onCopy}
                                    primaryPhoto={primaryPhoto}
                                />
                            ))}
                        </ScrollView>
                    </Button>
                {alert &&
                    <View style={{ position: 'absolute', zIndex: -1, top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center'  }}>
                        <View style={{ backgroundColor: 'rgba(255,255,255, 1)', borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: 'black' }}>
                            <Text style={{ fontSize: 14, color: 'rgba(0,0,0,.85)', fontWeight: '500', padding: 20 }}>
                                { alert }
                            </Text>
                        </View>
                    </View>
                }
                {toggleShowCalendar &&
                    <Button onPress={() => this.setState({ toggleShowCalendar: false })} transparent style={{ width: 'auto', height: 'auto', backgroundColor: 'rgba(255,255,255,0.8)', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 1000, justifyContent: 'center', alignItems: 'center' }}>
                        <View onStartShouldSetResponder={() => true} style={{ backgroundColor: 'white', elevation: 3, borderRadius: 20, paddingVertical: 20, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.2, shadowColor: 'black', }}>
                            <CalendarPicker
                                startFromMonday={true}
                                allowRangeSelection={false}
                                maxDate={new Date()}
                                weekdays={weeks}
                                months={months}
                                previousTitle={previousTitle}
                                nextTitle={nextTitle}
                                todayBackgroundColor="rgba(0,0,0,0.5)"
                                selectedDayColor="#007aff"
                                selectedDayTextColor="white"
                                selectedStartDate={new Date(selectedStartDate * 1000)}
                                scaleFactor={375}
                                textStyle={{
                                    color: '#000000',
                                }}
                                onDateChange={this.onDateChange}
                            />
                        </View>
                    </Button>
                }
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
                            onChangeText={e => this.onChangeText(e)} 
                            value={content}
                            editable={true}
                            autoCorrect={false}
                            onKeyPress={e => this.onKeyPress(e, content)} 
                            multiline={true} 
                            textAlignVertical={'center'}
                            placeholderTextColor='rgba(0,0,0,.4)'
                            placeholder={((languageContent && languageContent.typeMessage)) + ' ' +  (reverseFormatLanguages(spokenLanguage, spokenLanguage) + ' ' + languageContent.or + ' ' + reverseFormatLanguages(learningLanguage, spokenLanguage)) + '...'}
                            style={[textInputStyle, { maxHeight: screenHeight/4 }, editingMessageId !== undefined && { borderColor: 'teal', shadowColor: 'transparent' } ]}
                        />
                        {(translatedContent && translatedContent.length > 0 && content !== null && content.length > 0) && 
                            <Text style={{ position: 'absolute', right: 55, elevation: 2, fontSize: 13, color: 'rgba(0,0,0,.35)', textTransform: 'uppercase'}}> 
                                {(!isSwitched ? spokenLanguage : learningLanguage )} 
                            </Text>
                        }
                        {startRecord && !autoSend &&
                            <View style={{ position: 'absolute', elevation: 2, flexDirection: 'row', top: 0, bottom: 0, right: 45, left: 0, backgroundColor: 'white', borderRadius: 25, maxHeight: 80, paddingHorizontal: 10, alignItems: 'center' }}>
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
                                {(recording)  ?
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
                            <Button disabled={loading} style={buttonStyle} onPress={() => !loading && this.onSendMessage()}>
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
                            <Button disabled={loading} style={buttonStyle} onPress={() => !loading && this.onSendMessage(true)}>
                                <Icon name='ios-arrow-forward' style={iconStyle}/>
                            </Button>
                        }
                    </View>
                </View>
            </React.Fragment>
        )
    }

    private showCalendar(){
        Keyboard.dismiss();
        this.setState({ toggleShowCalendar: true });
    }

    private onDateChange(selectedStartDate: any){
        const format = selectedStartDate.format().split(':')[0];
        selectedStartDate = moment(format);
        selectedStartDate = selectedStartDate.unix();
        this.props.onDateChange(selectedStartDate);
    }

    private onFinishEditMessage(){
        // const otherUsersSettings = this.state.otherUsersSettings;
        // const chatItemId = this.state.id;
        // const chatDetailItemid = this.state.editingMessageId;
        // if(chatDetailItemid){
        //     this.props.onFinishEditMessage(chatItemId, chatDetailItemid, otherUsersSettings);
        //     this.setState({ editingMessageId: undefined })
        // }
    }

    private onEditMessage(itemId: string) {
        // this.setState({ editingMessageId: itemId }, () => {
        //     this.props.onEditMessage(itemId);
        // });
    }

    private onStopEditMessage() {
        // this.setState({ editingMessageId: undefined }, () => {
        //     this.props.onStopEditMessage();
        // });
    }

    private onCopy(type: string){
        const languageContent = journalLanguages[this.props.spokenLanguage];

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
            const languageContent = journalLanguages[this.props.spokenLanguage];
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
                                    this.onStopRecordMessage(true);
                                }
                                else if(this.state.recording && recordDuration !== this.state.recordDuration){
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
                    } catch (err) {
                        console.warn(err);
                        resolve(false);
                    }
                }
                else if(type === 'record'){
                    try {
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

    private onStopRecordMessage(send?: boolean){
        setTimeout(() => {
            if(this.voiceMessagePath !== null) {
                if(send){
                    this.setState({ recording: false, autoSend: true }, () => {
                        (async () => {
                            this.voiceMessagePath = await this.audioRecorderPlayer.stopRecorder();
                            this.audioRecorderPlayer.removeRecordBackListener();
                            Mixpanel.trackWithProperties("Recorded Journal Voice Message", { userUid: this.props.userUid });
                            this.onSendMessage(true);
                            this.setState({ voiceLoading: false });
                        })();
                    });
                }
                else {
                    this.setState({ recording: false }, () => {
                        (async () => {
                            this.voiceMessagePath = await this.audioRecorderPlayer.stopRecorder();
                            this.audioRecorderPlayer.removeRecordBackListener();
                            Mixpanel.trackWithProperties("Recorded Journal Voice Message", { userUid: this.props.userUid });
                            this.setState({ voiceLoading: false });
                        })();
                    });
                }
            }
        }, 300);
    }

    private onRemoveRecording(){
        this.setState({ startRecord: false });
        this.voiceMessagePath = null;
    }

    private onPlayRecord(){
        this.setState({ playing: true }, () => {
            (async () => {
                await this.audioRecorderPlayer.startPlayer(this.voiceMessagePath);
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
    
    private onStop(selectedStartDate: string, itemId: string) {
        this.props.onStop(selectedStartDate, itemId);
    }

    private onPlay(selectedStartDate: string, itemId: string, type: string){
        this.props.onPlay(selectedStartDate, itemId, type)
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
        if(this.props.content === null || this.props.content.length === 0){
            this.scrollToBottom();
        }
    }

    private keyboardDidHide() {

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

    private onItemClick(userUid: string, selectedStartDate: string, translatedContent: string){
        if(this.scrollViewRef && this.scrollViewRef.scrollToEnd){
            // this.setState({ itemClickedId: itemId }, () => {
                this.props.onItemClick(userUid, selectedStartDate);
            // })
        }
    }

    private onKeyPress(e: any, value?: string | null){
        if(value !== undefined && value !== null){
            const secondLastChar = value[value.length - 2];
            const lastChar = value[value.length - 1];

            if((!(/\s/.test(secondLastChar))) && (/\s/.test(e.nativeEvent.key)) || ((/\s/.test(lastChar)) && e.nativeEvent.key === 'Backspace') || (lastChar === undefined && e.nativeEvent.key === 'Backspace')){
                this.props.onChangeTranslationText(value);
            }
        }
    }

    private onSendMessage(voice?: boolean){
        const { selectedStartDate } = this.state;
        if(voice){
            this.setState({ startRecord: false }, () => {
                this.props.onSendVoiceMessage(selectedStartDate, this.voiceMessagePath);
            });
        }
        else {
            this.props.onSendMessage(selectedStartDate);
        }
    }

    private onChangeText(content: string){
        this.props.onChangeText(content);
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
        backgroundColor: 'white',
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
        backgroundColor: '#eff0f1',
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
        marginHorizontal: 5,
        backgroundColor: 'white'
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
    const { journal, auth, global, accountSettings } = state;
    const { userUid } = auth;
    const { loading } = global;
    const { journalList, translationLoading, content, voiceMessageError, translatedContent, isSwitched, journalEntryStatement, selectedStartDateNotified } = journal;
    const { spokenLanguage, learningLanguage, selectedStartDate } = accountSettings;

    return {
        content,
        selectedStartDateNotified,
        selectedStartDate,
        translatedContent,
        isSwitched,
        journalList,
        userUid,
        loading,
        translationLoading,
        spokenLanguage,
        learningLanguage,
        voiceMessageError,
        journalEntryStatement,
    };
};
  
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        onChangeText: bindActionCreators(
            journalActions.onChangeText,
            dispatch
        ),
        onChangeTranslationText: bindActionCreators(
            journalActions.onChangeTranslationText,
            dispatch
        ),
        onSendMessage: bindActionCreators(
            journalActions.onSendMessage,
            dispatch
        ),
        onSendVoiceMessage: bindActionCreators(
            journalActions.onSendVoiceMessage,
            dispatch
        ),
        onItemClick: bindActionCreators(
            journalActions.onItemClick,
            dispatch,
        ),
        onPlay: bindActionCreators(
            journalActions.onPlay,
            dispatch,
        ),
        onStop: bindActionCreators(
            journalActions.onStop,
            dispatch,
        ),
        onSetLoading: bindActionCreators(
            globalActions.onSetLoading,
            dispatch,
        ),
        onSwitchContent: bindActionCreators(
            journalActions.onSwitchContent,
            dispatch,
        ),
        onDateChange: bindActionCreators(
            journalActions.onDateChange,
            dispatch,
        ),
        onUpdateSelectedStartDateNotified: bindActionCreators(
            journalActions.onUpdateSelectedStartDateNotified,
            dispatch,
        ),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Journal);
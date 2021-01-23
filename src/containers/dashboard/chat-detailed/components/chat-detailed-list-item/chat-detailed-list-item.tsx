import React from 'react';

import {
    StyleSheet,
    Image,
    Clipboard,
    TouchableOpacity
} from 'react-native';

import { NativeBase, View, Button, Text, Icon } from 'native-base';

import { StopButton, PlayButton, EditIcon, VoiceButton, EditButtons } from './components';

import { convertUTCToFormattedText } from '../../../../../actions';

import { ChatDetailedListItemType } from './types';

export interface IChatDetailedListItemProps extends NativeBase.Container, ChatDetailedListItemType {
    right: boolean;
    style?: any;
    learningLanguage?: string;
    spokenLanguage?: string;
    primaryPhoto?: any;
    otherUserPrimaryPhoto: any;
    editingMessage: boolean;
    screenWidth: any;
    onLayout?: (event: any) => void;
    onPlay: (type: string) => void;
    onStop: () => void;
    onCopy: (type: string) => void;
    onEdit: () => void;
    onStopEdit: () => void;
}

interface IChatDetailedListItemState {
    focused: boolean;
    focusedTranslate: boolean;
}

export class ChatDetailedListItem extends React.Component<IChatDetailedListItemProps, IChatDetailedListItemState> {

    private textRef: any;
    private translateRef: any;

    constructor(props: IChatDetailedListItemProps){
        super(props);
        this.textRef = React.createRef();
        this.translateRef = React.createRef();
        this.onLongPress = this.onLongPress.bind(this);
        this.onTranslateLongPress = this.onTranslateLongPress.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onStop = this.onStop.bind(this);
        this.renderRightItem = this.renderRightItem.bind(this);
        this.renderLeftItem = this.renderLeftItem.bind(this);
        this.getMaxWidth = this.getMaxWidth.bind(this);

        this.state = {
            focused: false,
            focusedTranslate: false,
        }
    }

    public render(){
        const { right } = this.props;

        if(right){
            return this.renderRightItem();
        }
        else {
            return this.renderLeftItem();
        }
    }

    private renderRightItem(){
        const { innerViewStyle, editedContentWrapperStyle, translatedButtonStyle } = styles;
        const { wrapperButtonRightStyle, buttonRightStyle, bottomRightArrowStyle, translatedContentRightStyle, wrapperTranslatedButtonRightStyle, arrowRightStyle, rightViewStyle, contentRightStyle, dateRightStyle } = rightStyles;
        const { screenWidth, editingMessage, content, date, style, onPress, primaryPhoto, voiceMessage, language, spokenLanguage, playingVoice, playingRecording, translatedContent, showTranslatedContent, learningLanguage, onLayout, onOverlayPress, editedContent, editedTranslatedContent } = this.props;
        const { focused, focusedTranslate } = this.state;
        
        return (
            <Button style={[rightViewStyle, editingMessage && { backgroundColor: 'rgba(0,0,0,0.15)' }, style]} transparent={true} activeOpacity={1} onPress={onOverlayPress} onLayout={translatedContent ? onLayout: undefined}>
                <View style={[innerViewStyle, { width: screenWidth, paddingRight: 5 }]}>
                    {translatedContent && translatedContent.length > 0 && showTranslatedContent && learningLanguage !== 'none' &&
                        <View style={wrapperTranslatedButtonRightStyle}>
                            <Button style={[translatedButtonStyle, (focusedTranslate) && { backgroundColor: 'rgba(0, 128, 128, 0.8)' }]} onLongPress={this.onTranslateLongPress} onPressOut={() => this.setState({ focusedTranslate: false })} onPressIn={() => this.setState({ focusedTranslate: true })} transparent>
                                <View style={[bottomRightArrowStyle, (focusedTranslate) && { borderBottomColor: 'rgba(0, 128, 128, 0.8)' }]} />
                                {this.showPlayRecording(spokenLanguage, language, learningLanguage) && 
                                    <React.Fragment>
                                        {!playingRecording ?
                                            <PlayButton onPlay={this.onPlay} iconStyle={{ marginTop: 5 }} />
                                            :
                                            <StopButton onStop={this.onStop} iconStyle={{ marginLeft: 10, marginTop: 5 }} />
                                        }
                                    </React.Fragment>
                                }
                                {(voiceMessage !== undefined && language === learningLanguage) &&
                                    <React.Fragment>
                                        {!playingVoice ?
                                            <VoiceButton onPress={() => this.onPlay('voice')} iconStyle={{ marginLeft: 15 }} iconName='ios-play' uri={primaryPhoto ? primaryPhoto.path: undefined}  />
                                            :
                                            <VoiceButton iconStyle={{ marginLeft: 8 }} onPress={this.onStop} iconName='ios-square' uri={primaryPhoto ? primaryPhoto.path: undefined}  />
                                        }
                                    </React.Fragment>
                                }
                                <View style={[{ flexDirection: 'column',  maxWidth: this.getMaxWidth({ voiceMessage, language, editedMessage: editedTranslatedContent && editedTranslatedContent.length > 0, learningLanguage, spokenLanguage })} ]}>
                                    <View style={editedContentWrapperStyle}>
                                        {editedTranslatedContent && <EditIcon name='ios-close' iconStyle={{ color: 'red' }} /> }
                                        <Text ref={this.translateRef} uppercase={false} style={translatedContentRightStyle}>
                                            { translatedContent[0].toUpperCase() + translatedContent.slice(1) }
                                        </Text>
                                    </View>
                                    {editedTranslatedContent &&
                                        <View style={[editedContentWrapperStyle, { marginTop: 2 }]}>
                                            <EditIcon name='ios-checkmark' iconStyle={{ color: 'green' }} />
                                            <Text ref={this.textRef} uppercase={false} style={translatedContentRightStyle}>
                                                { editedTranslatedContent[0].toUpperCase() + editedTranslatedContent.slice(1) }
                                            </Text>
                                        </View>
                                    }
                                </View>
                            </Button>
                        </View>
                    }
                    {content && content.length > 0 &&
                        <View style={wrapperButtonRightStyle}>
                            <Button onPressOut={() => this.setState({ focused: false })} onPressIn={() => this.setState({ focused: true })} disabled={playingRecording || playingVoice} onPress={onPress} onLongPress={this.onLongPress} transparent style={[buttonRightStyle, (focused) && { backgroundColor: 'rgba(0, 122, 255, 0.8)' }]}>
                                <View style={[arrowRightStyle, (focused) && { borderBottomColor: 'rgba(0, 122, 255, 0.8)' }]} />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {(voiceMessage !== undefined && language === spokenLanguage) &&
                                        <React.Fragment>
                                            {!playingVoice ?
                                                <VoiceButton onPress={() => this.onPlay('voice')} iconStyle={{ marginLeft: 15 }} iconName='ios-play' uri={primaryPhoto ? primaryPhoto.path: undefined}  />
                                                :
                                                <VoiceButton iconStyle={{ marginLeft: 8 }} onPress={this.onStop} iconName='ios-square' uri={primaryPhoto ? primaryPhoto.path: undefined}  />
                                            }
                                        </React.Fragment>
                                    }
                                    {this.showPlayRecording(learningLanguage, language, learningLanguage) && voiceMessage === undefined &&
                                        <React.Fragment>
                                            {!playingRecording ?
                                                <PlayButton onPlay={this.onPlay} iconStyle={{ marginTop: 5 }} />
                                                :
                                                <StopButton onStop={this.onStop} iconStyle={{ marginLeft: 10, marginTop: 5 }} />
                                            }
                                        </React.Fragment>
                                    }
                                    <View style={{ maxWidth: this.getMaxWidth({ voiceMessage, language, editedMessage: editedContent && editedContent.length > 0, learningLanguage, spokenLanguage: learningLanguage }) }}>
                                        <View style={editedContentWrapperStyle}>
                                            {editedContent && <EditIcon name='ios-close' iconStyle={{ color: 'red' }} /> }
                                            <Text ref={this.textRef} style={[contentRightStyle]} uppercase={false}>
                                                { content[0].toUpperCase() + content.slice(1) }
                                            </Text>
                                        </View>
                                        {editedContent &&
                                            <View style={[editedContentWrapperStyle,  { marginTop: 5 }]}>
                                                <EditIcon name='ios-checkmark'  iconStyle={{ color: 'green' }} /> 
                                                <Text ref={this.textRef} style={[contentRightStyle]} uppercase={false}>
                                                    { editedContent[0].toUpperCase() + editedContent.slice(1) }
                                                </Text>
                                            </View>
                                        }
                                    </View>
                                </View>
                                <Text style={dateRightStyle}>
                                    { convertUTCToFormattedText(date, spokenLanguage) }
                                </Text>
                                </Button>
                        </View>
                    }
                </View>
            </Button>
        )
    }

    private renderLeftItem(){
        const { innerViewStyle, editedContentWrapperStyle, translatedButtonStyle } = styles;
        const { dateLeftStyle, leftViewStyle, wrapperTranslatedButtonLeftStyle, buttonLeftStyle, bottomLeftArrowStyle, translatedContentLeftStyle, wrapperButtonLeftStyle, arrowLeftStyle, contentLeftStyle } = leftStyles;
        const { screenWidth, editingMessage, onStopEdit, content, date, style, onPress, primaryPhoto, voiceMessage, otherUserPrimaryPhoto, language, spokenLanguage, playingVoice, playingRecording, translatedContent, showTranslatedContent, learningLanguage, onLayout, onOverlayPress, onEdit, editedContent, editedTranslatedContent } = this.props;
        const { focused, focusedTranslate } = this.state;

        return (
            <Button style={[leftViewStyle, editingMessage && { backgroundColor: 'rgba(0,0,0,0.15)' }, style]} transparent={true} activeOpacity={1} onPress={onOverlayPress} onLayout={translatedContent ? onLayout: undefined}>
                <View style={[innerViewStyle, { width: screenWidth,  paddingLeft: 5 }]}>
                    {translatedContent && translatedContent.length > 0 && showTranslatedContent && learningLanguage !== 'none' &&
                        <View style={wrapperTranslatedButtonLeftStyle}>
                            <Button style={[translatedButtonStyle, (focusedTranslate) && { backgroundColor: 'rgba(0, 128, 128, 0.8)' }]} onLongPress={this.onTranslateLongPress} onPressOut={() => this.setState({ focusedTranslate: false })} onPressIn={() => this.setState({ focusedTranslate: true })} transparent>
                                <View style={[bottomLeftArrowStyle, (focusedTranslate) && { borderBottomColor: 'rgba(0, 128, 128, 0.8)' }]} />
                                {this.showPlayRecording(spokenLanguage, language, learningLanguage) && 
                                    <React.Fragment>
                                        {!playingRecording ?
                                            <PlayButton onPlay={this.onPlay} iconStyle={{ marginTop: 5 }} />
                                            :
                                            <StopButton onStop={this.onStop} iconStyle={{ marginLeft: 10, marginTop: 5 }} />
                                        }
                                    </React.Fragment>
                                }
                                {(voiceMessage !== undefined && language === learningLanguage) &&
                                    <React.Fragment>
                                        {!playingVoice ?
                                            <VoiceButton onPress={() => this.onPlay('voice')} iconStyle={{ marginLeft: 15 }} iconName='ios-play' uri={primaryPhoto ? primaryPhoto.path: undefined}  />
                                            :
                                            <VoiceButton iconStyle={{ marginLeft: 8 }} onPress={this.onStop} iconName='ios-square' uri={primaryPhoto ? primaryPhoto.path: undefined}  />
                                        }
                                    </React.Fragment>
                                }
                                <View style={[{ flexDirection: 'column',  maxWidth: this.getMaxWidth({ voiceMessage, language, editedMessage: editedTranslatedContent && editedTranslatedContent.length > 0, learningLanguage, spokenLanguage })} ]}>
                                    <View style={editedContentWrapperStyle}>
                                        {editedTranslatedContent && <EditIcon name='ios-close' iconStyle={{ color: 'red' }} /> }
                                        <Text ref={this.translateRef} uppercase={false} style={translatedContentLeftStyle}>
                                            { translatedContent[0].toUpperCase() + translatedContent.slice(1) }
                                        </Text>
                                    </View>
                                    {editedTranslatedContent &&
                                        <View style={[editedContentWrapperStyle, { marginTop: 2 }]}>
                                            <EditIcon name='ios-checkmark' iconStyle={{ color: 'green' }} />
                                            <Text ref={this.textRef} uppercase={false} style={translatedContentLeftStyle}>
                                                { editedTranslatedContent[0].toUpperCase() + editedTranslatedContent.slice(1) }
                                            </Text>
                                        </View>
                                    }
                                </View>
                            </Button>
                        </View>
                    }
                    {content && content.length > 0 &&
                        <View style={wrapperButtonLeftStyle}>
                            <Button onPressOut={() => this.setState({ focused: false })} onPressIn={() => this.setState({ focused: true })} disabled={playingRecording || playingVoice} onPress={onPress} onLongPress={this.onLongPress} transparent style={[buttonLeftStyle, (focused) && { backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}>
                                <View style={[arrowLeftStyle, (focused) && { borderBottomColor: 'rgba(255, 255, 255, 0.8)' }]} />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {(voiceMessage !== undefined && language === spokenLanguage) &&
                                        <React.Fragment>
                                            {!playingVoice ?
                                                <VoiceButton onPress={() => this.onPlay('voice')} iconStyle={{ marginLeft: 15 }} iconName='ios-play' uri={primaryPhoto ? primaryPhoto.path: undefined}  />
                                                :
                                                <VoiceButton iconStyle={{ marginLeft: 8 }} onPress={this.onStop} iconName='ios-square' uri={primaryPhoto ? primaryPhoto.path: undefined}  />
                                            }
                                        </React.Fragment>
                                    }
                                    {this.showPlayRecording(learningLanguage, language, learningLanguage) && voiceMessage === undefined &&
                                        <React.Fragment>
                                            {!playingRecording ?
                                                <PlayButton onPlay={this.onPlay} iconStyle={{ color: '#007aff', marginTop: 5 }} />
                                                :
                                                <StopButton onStop={this.onStop} iconStyle={{ marginLeft: 10, color: '#007aff', marginTop: 5 }} />
                                            }
                                        </React.Fragment>
                                    }
                                    <View style={{ flexDirection: 'column', maxWidth: this.getMaxWidth({ voiceMessage, language, editedMessage: editedContent && editedContent.length > 0, learningLanguage, spokenLanguage: learningLanguage }) }}>
                                        <View style={[editedContentWrapperStyle]}>
                                            {editedContent && <EditIcon name='ios-close' iconStyle={{ color: 'red' }} /> }
                                            <Text ref={this.textRef} style={[contentLeftStyle]} uppercase={false}>
                                                { content[0].toUpperCase() + content.slice(1) }
                                            </Text>
                                        </View>
                                        {editedContent &&
                                            <View style={[editedContentWrapperStyle, { marginTop: 5 }]}>
                                                <EditIcon name='ios-checkmark'  iconStyle={{ color: 'green' }} /> 
                                                <Text ref={this.textRef} style={[contentLeftStyle]} uppercase={false}>
                                                    { editedContent[0].toUpperCase() + editedContent.slice(1) }
                                                </Text>
                                            </View>
                                        }
                                    </View>
                                </View>
                                <Text style={dateLeftStyle}>
                                    { convertUTCToFormattedText(date, spokenLanguage) }
                                </Text>
                                </Button>
                                <EditButtons viewStyle={{ marginLeft: 10 }} editingMessage={editingMessage} onEdit={onEdit} onStopEdit={onStopEdit} />
                        </View>
                    }
                </View>
            </Button>
        )
    }

    private showPlayRecording(languageType?: string, language?: string, learningLanguage?: string){
        if(languageType === language && learningLanguage !== 'none'){
            return true
        }
        return false
    }

    private getMaxWidth(ref: any){
        const  { voiceMessage, language, learningLanguage, editedMessage, spokenLanguage } = ref;
        const { screenWidth } = this.props;
        
        if(voiceMessage !== undefined && language === learningLanguage){
            if(editedMessage){
                return (screenWidth * 0.8) - 95;
            }
            else {
                return (screenWidth * 0.8) - 80;
            }
        }
        else if(this.showPlayRecording(spokenLanguage, language, learningLanguage)){
            if(editedMessage) {
                return (screenWidth * 0.80) - 80;
            }
            else {
                return (screenWidth * 0.80) - 65;
            }
        }
        else {
            if(editedMessage) {
                return (screenWidth * 0.80) - 15;
            }
            else {
                return (screenWidth * 0.80);
            }
        }
    }

    private onPlay(type: string){
        const { onPlay } = this.props;
        onPlay(type);
    }

    private onStop(){
        const { onStop } = this.props;
        onStop();
    }

    private async onTranslateLongPress(){
        if(this.translateRef){
            const value = this.translateRef.current.props.children;
            await Clipboard.setString(value);
            this.props.onCopy('translation');
            
        }
    }

    private async onLongPress(){
        if(this.textRef){
            const value = this.textRef.current.props.children;
            await Clipboard.setString(value);
            this.props.onCopy('message');
        }
    }
};

const styles = StyleSheet.create({
    innerViewStyle: {
        flexDirection: 'column'
    },
    editedContentWrapperStyle: {
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    translatedButtonStyle : {
        backgroundColor: 'teal',
        flexDirection: 'row',
        borderRadius: 15,
        paddingHorizontal: 10,
        marginBottom: 15,
        height: 'auto',
        alignItems: 'center'
    },
    // outerViewStyle: {
    //     flexDirection: 'row',
    //     flex: 1
    // },
    // overlayStyle: {
    //     flexDirection: 'column',
    //     flex: 1,
    //     height: '100%'
    // }
});

const leftStyles = StyleSheet.create({
    leftViewStyle: {
        flexDirection: 'row',
        height: 'auto',
        justifyContent:  'flex-start',
        backgroundColor: 'transparent',
        paddingLeft: 0
    },
    wrapperTranslatedButtonLeftStyle : {
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    arrowLeftStyle: {
        position: 'absolute',
        left: -12,
        top: '55%',
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'white',
        transform: [{ rotate: '-90deg'}]
    },
    translatedContentLeftStyle: {
        color: 'white',
        fontSize: 16,
        textAlign: 'left',
        paddingHorizontal: 2,
        paddingBottom: 2,
        flexShrink: 1,
        flexWrap: 'wrap'
    },
    bottomLeftArrowStyle: {
        position: 'absolute',
        left: 10,
        bottom: -6.5,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'teal',
        transform: [{ rotate: '-45deg'}]
    },
    wrapperButtonLeftStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    contentLeftStyle: {
        color: 'black',
        fontSize: 16,
        textAlign: 'left',
        flexWrap: 'wrap',
        flexShrink: 1
    },
    dateLeftStyle: {
        alignSelf: 'flex-start',
        color: 'black',
        textAlign: 'left',
        fontSize: 10,
        opacity: 0.6,
        paddingLeft: 4,
        paddingRight: 4,
        marginTop: 5,
        marginBottom: 5
    },
    buttonLeftStyle: {
        backgroundColor: 'white',
        borderRadius: 20,
        flexDirection: 'column',
        height: 'auto',
        marginRight: 0,
        marginLeft: 5,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
});

const rightStyles = StyleSheet.create({
    arrowRightStyle: {
        position: 'absolute',
        right: -12,
        top: '55%',
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#007aff',
        transform: [{ rotate: '90deg'}]
    },
    buttonRightStyle: {
        backgroundColor: '#007aff',
        borderRadius: 20,
        flexDirection: 'column',
        height: 'auto',
        marginRight: 5,
        marginLeft: 0,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    wrapperButtonRightStyle: {
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    contentRightStyle: {
        color: 'white',
        fontSize: 16,
        textAlign: 'right',
        flexShrink: 1,
        flexWrap: 'wrap',
        
    },
    dateRightStyle: {
        alignSelf: 'flex-end',
        color: 'white',
        textAlign: 'right',
        fontSize: 10,
        opacity: 0.6,
        paddingLeft: 4,
        paddingRight: 4,
        marginTop: 5,
        marginBottom: 5
    },
    rightViewStyle: {
        flexDirection: 'row',
        height: 'auto',
        justifyContent:  'flex-end',
        backgroundColor: 'transparent',
        paddingRight: 0
    },
    translatedContentRightStyle: {
        color: 'white',
        fontSize: 16,
        textAlign: 'left',
        paddingHorizontal: 2,
        paddingBottom: 2,
        // borderWidth: 1,
        flexShrink: 1,
        flexWrap: 'wrap'
    },
    bottomRightArrowStyle: {
        position: 'absolute',
        right: 10,
        bottom: -6.5,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'teal',
        transform: [{ rotate: '45deg'}]
    },
    wrapperTranslatedButtonRightStyle: {
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
});




import React from 'react';

import {
    StyleSheet,
    Image,
    Clipboard,
    TouchableOpacity
} from 'react-native';

import { NativeBase, View, Button, Text } from 'native-base';

import { StopButton, PlayButton, EditIcon, VoiceButton, ChatDetailedListItemType } from '../../../../../chat-detailed/components';

import { convertUTCToFormattedText } from '../../../../../../../actions';

export interface IJournalListItemProps extends NativeBase.Container, ChatDetailedListItemType {
    style?: any;
    learningLanguage?: string;
    spokenLanguage?: string;
    primaryPhoto?: any;
    editingMessage: boolean;
    screenWidth: any;
    onLayout: (event: any) => void;
    onPlay: (type: string) => void;
    onStop: () => void;
    onCopy: (type: string) => void;
    onEdit?: () => void;
    onStopEdit?: () => void;
}

interface IJournalListItemState {
    focused: boolean;
    focusedTranslate: boolean;
}

export class JournalListItem extends React.Component<IJournalListItemProps, IJournalListItemState> {

    private textRef: any;
    private translateRef: any;

    constructor(props: IJournalListItemProps){
        super(props);
        this.textRef = React.createRef();
        this.translateRef = React.createRef();
        this.onLongPress = this.onLongPress.bind(this);
        this.onTranslateLongPress = this.onTranslateLongPress.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onStop = this.onStop.bind(this);

        this.state = {
            focused: false,
            focusedTranslate: false
        }
    }

    public render(){
        const { innerViewStyle, editedContentWrapperStyle, translatedButtonStyle } = styles;
        const { dateLeftStyle, leftViewStyle, wrapperTranslatedButtonLeftStyle, buttonLeftStyle, bottomLeftArrowStyle, translatedContentLeftStyle, wrapperButtonLeftStyle, arrowLeftStyle, contentLeftStyle } = leftStyles;
        const { screenWidth, editingMessage, content, style, onPress, primaryPhoto, voiceMessage, language, spokenLanguage, playingVoice, playingRecording, translatedContent, showTranslatedContent, learningLanguage, onLayout, onOverlayPress, editedContent, editedTranslatedContent, date } = this.props;
        const { focused, focusedTranslate } = this.state;

        return (
            <Button activeOpacity={1} style={[leftViewStyle, editingMessage && { backgroundColor: 'rgba(0,0,0,0.15)' }, style]} transparent={true} onPress={onOverlayPress} onLayout={translatedContent ? onLayout: undefined}>
                <View style={[innerViewStyle, { width: screenWidth * 0.80,  paddingLeft: 5 }]}>
                    {translatedContent && translatedContent.length > 0 && showTranslatedContent && learningLanguage !== 'none' &&
                        <View style={wrapperTranslatedButtonLeftStyle}>
                            <Button style={[translatedButtonStyle, (focusedTranslate) && { backgroundColor: 'rgba(0, 128, 128, 0.8)' }]} onLongPress={this.onTranslateLongPress} onPressOut={() => this.setState({ focusedTranslate: false })} onPressIn={() => this.setState({ focusedTranslate: true })} transparent>
                                <View style={[bottomLeftArrowStyle, (focusedTranslate) && { borderBottomColor: 'rgba(0, 128, 128, 0.8)' }]} />
                                {this.showPlayRecording(spokenLanguage, language, learningLanguage) && 
                                    <React.Fragment>
                                        {!playingRecording ?
                                            <PlayButton onPlay={this.onPlay} />
                                            :
                                            <StopButton onStop={this.onStop} iconStyle={{ marginLeft: 10 }} />
                                        }
                                    </React.Fragment>
                                }
                                <View style={[{ flexDirection: 'column',  maxWidth: this.showPlayRecording(spokenLanguage, language, learningLanguage) ? (screenWidth * 0.80) - 65 : (screenWidth * 0.80) } ]}>
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
                            <Button onPressOut={() => this.setState({ focused: false })} onPressIn={() => this.setState({ focused: true })} disabled={playingRecording || playingVoice} onPress={onPress} onLongPress={this.onLongPress} transparent style={[buttonLeftStyle, (focused) && { backgroundColor: 'rgba(0, 122, 255, 0.8)' }]}>
                                <View style={[arrowLeftStyle, (focused) && { borderBottomColor: 'rgba(0, 122, 255, 0.8)' }]} />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {voiceMessage !== undefined &&
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
                                                <PlayButton onPlay={this.onPlay} iconStyle={{ color: 'white' }} />
                                                :
                                                <StopButton onStop={this.onStop} iconStyle={{ marginLeft: 10, color: 'white' }} />
                                            }
                                        </React.Fragment>
                                    }
                                    <View style={[ voiceMessage !== undefined ? { maxWidth: (screenWidth * 0.8) - 70 } : this.showPlayRecording(learningLanguage, language, learningLanguage) ? { maxWidth: (screenWidth * 0.8) - 65 } : { maxWidth: (screenWidth * 0.8) } ]}>
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
                        </View>
                    }
                </View>
            </Button>
        );
    }

    private showPlayRecording(spokenLanguage?: string, language?: string, learningLanguage?: string){
        if(spokenLanguage === language && learningLanguage !== 'none'){
            return true
        }
        return false
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
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    translatedButtonStyle : {
        backgroundColor: 'teal',
        flexDirection: 'row',
        borderRadius: 15,
        paddingHorizontal: 10,
        marginBottom: 15,
        height: 'auto',
        alignItems: 'center',
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
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#007aff',
        transform: [{ rotate: '-90deg'}]
    },
    translatedContentLeftStyle: {
        color: 'white',
        fontSize: 16,
        textAlign: 'left',
        paddingHorizontal: 2,
        paddingBottom: 2
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
        flexDirection: 'row'
    },
    contentLeftStyle: {
        color: 'white',
        fontSize: 16,
        textAlign: 'left',
    },
    dateLeftStyle: {
        alignSelf: 'flex-start',
        color: 'white',
        textAlign: 'left',
        fontSize: 10,
        opacity: 0.6,
        paddingLeft: 4,
        paddingRight: 4,
        marginTop: 5,
        marginBottom: 5
    },
    buttonLeftStyle: {
        backgroundColor: '#007aff',
        borderRadius: 20,
        flexDirection: 'column',
        height: 'auto',
        marginRight: 0,
        marginLeft: 5,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'flex-start',
        justifyContent: 'center'
    }
});
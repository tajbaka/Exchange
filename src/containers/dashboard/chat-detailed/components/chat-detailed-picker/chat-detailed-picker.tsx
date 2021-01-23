import React from 'react';

import {
    StyleSheet,
    Text
  } from 'react-native';

import { Button, View, Icon, Textarea } from 'native-base';

interface IChatDetailedPickerProps {
    languageContent: any;
    isUserBlocked?: boolean;
    pickerValue?: string;
    showPicker: boolean;
    error?: string;
    onReasonChanged: (reason: any) => void;
    onReportUser: () => void;
    onBlockUser: () => void;
    onHidePicker: () => void;
    onOptionsChanged: (type: string) => void;
}

export const ChatDetailedPicker: React.SFC<IChatDetailedPickerProps> = props => {
    const { error, languageContent, onBlockUser, showPicker, pickerValue, isUserBlocked, onOptionsChanged, onHidePicker, onReasonChanged, onReportUser } = props;

    if(pickerValue === 'report'){
        return (
            <View style={{ position: 'absolute', zIndex: 1000, borderRadius: 20, left: 10, right: 10, padding: 10, top: 10, bottom: 10, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 3, }}>
                <Button onPress={onHidePicker} transparent style={{ position: 'absolute', right: 0 }}> 
                    <Icon name='ios-close' style={{ fontSize: 30, color: '#007aff' }} />
                </Button>
                <Textarea onChangeText={onReasonChanged} style={{ flex: 1, marginTop: 20 }} bordered={false} underline={false} rowSpan={5} placeholder={error ? error : languageContent.reportingDescription} placeholderTextColor={error && 'red'} />
                <Button transparent bordered style={{ alignSelf: 'flex-end', paddingHorizontal: 20, borderColor: '#007aff', borderRadius: 10 }} onPress={onReportUser}>
                    <Text style={{ color: '#007aff' }}>
                        { languageContent.send }
                    </Text>
                </Button>
            </View>
        );
    }
    else if(pickerValue === 'block') {
        return (
            <Button transparent activeOpacity={1} onPress={onHidePicker} style={{ position: 'absolute', top: 0, height: '100%', width: '100%', backgroundColor: 'transparent', zIndex: 1000 }}>
                <View style={{ position: 'absolute', justifyContent: 'space-between', borderRadius: 20, left: 10, right: 10, padding: 10, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 3, }}>
                    {isUserBlocked ? 
                        <Text style={{ textAlign: 'center' }}> { languageContent.areYouSureUnblock } </Text>
                        :
                        <Text style={{ textAlign: 'center' }}> { languageContent.areYouSureBlock } </Text>
                    }
                    <Button transparent style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                        <Button style={{ borderWidth: 1, borderColor: '#007aff', borderRadius: 10, width: 70, justifyContent: 'center' }} transparent onPress={onBlockUser}>
                            <Text style={{ textAlign: 'center', color: '#007aff' }}>
                                { languageContent.yes }
                            </Text>
                        </Button>
                        <Button style={{ borderWidth: 1, borderColor: '#007aff', borderRadius: 10, marginLeft: 5, width: 70, justifyContent: 'center' }} transparent onPress={onHidePicker}>
                            <Text style={{ textAlign: 'center', color: '#007aff' }}>
                                { languageContent.no }
                            </Text>
                        </Button>
                    </Button>
                </View>
            </Button>
        );
    }
    else if(showPicker){
        return (
            <Button 
                transparent 
                activeOpacity={1} 
                style={{ position: 'absolute', top: 0, backgroundColor: 'transparent', width: '100%', height: '100%', zIndex: 1000 }} 
                onPress={onHidePicker} 
            >
                <View style={{ flexDirection: 'column', backgroundColor: 'white', position: 'absolute', paddingHorizontal: 10, top: 0, right: 0, elevation: 3, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowColor: 'black',  borderBottomRightRadius: 15, borderBottomLeftRadius: 15 }}>
                    <Button transparent style={{ justifyContent: 'center', paddingHorizontal: 20 }} onPress={() => onOptionsChanged('report')}>
                        <Text style={{ color: 'black', textAlign: 'center' }}>
                            { languageContent.reportUser }
                        </Text>
                    </Button>
                    <Button transparent style={{ justifyContent: 'center', paddingHorizontal: 20 }} onPress={() => onOptionsChanged('block')}>
                        {isUserBlocked ? 
                            <Text style={{ color: 'black', textAlign: 'center' }}>
                                { languageContent.unblockUser }
                            </Text>
                            :
                            <Text style={{ color: 'black', textAlign: 'center' }}>
                                { languageContent.blockUser }
                            </Text>
                        }
                    </Button>
                </View>
            </Button>
        );
    }

    return null;
    
};

const styles = StyleSheet.create({
    
});
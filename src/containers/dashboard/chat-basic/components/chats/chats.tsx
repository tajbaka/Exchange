import React from 'react';

import {
    StyleSheet,
    FlatList
  } from 'react-native';

import { Button, Icon, Text, View } from 'native-base';

import { ChatBasicListItem, IChatBasicListItemProps } from '../';

interface IChatsProps {
    chatList: Array<IChatBasicListItemProps>;
    languageContent: any;
    navigation: any;
    onChatBasicItemClick: (id: string, navigation: any) => void;
    onItemImageClick: (item: any, profilePhoto: any) => void;
    onCreateMessage: (navigation: any) => void;
}

export const Chats: React.SFC<IChatsProps> = props => {
    const { chatWrapperStyle, createMessageStyle } = styles;
    const { chatList, onCreateMessage, languageContent, onItemImageClick, onChatBasicItemClick, navigation } = props;

    return (
        <React.Fragment>
            {chatList.length > 0 ?
                <FlatList
                    style={chatWrapperStyle}
                    keyExtractor={(item: any) => item.id}
                    data={chatList}
                    renderItem={({ item }: any) => 
                        <React.Fragment>
                            {
                                (item && item.id) === chatList[chatList.length - 1].id ?
                                <React.Fragment>
                                    <ChatBasicListItem {...item} onImagePress={(profilePhoto: string) => onItemImageClick(item, profilePhoto)} onPress={() => onChatBasicItemClick(item.id, navigation)} />
                                    <View style={{ height: 80 }} />
                                </React.Fragment>
                                :
                                <ChatBasicListItem {...item} onImagePress={(profilePhoto: string) => onItemImageClick(item, profilePhoto)} onPress={() => onChatBasicItemClick(item.id, navigation)} />
                            }
                        </React.Fragment>
                    }
                />
            :
                <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ alignSelf: 'center', color: '#007aff', fontSize: 22 }}>
                        { languageContent.noActiveChats }
                    </Text>
                </View>
                
            }
            <Button style={createMessageStyle} transparent onPress={() => onCreateMessage(navigation)}> 
                <View style={{ backgroundColor: 'white', marginBottom: 10, marginRight: 10, width: 33, height: 24 }}>
                    <Icon name='ios-mail-unread' style={{ color: '#007aff', fontSize: 40, width: 33, height: 33, marginTop: -9 }} /> 
                </View>
            </Button>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    createMessageStyle : {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 0,
        right: 0,
        width: 65, 
        height: 65
    },
    chatWrapperStyle : {
        flex: 1
    },
});
import React from 'react';

import { StyleSheet, Image, Platform } from 'react-native';

import { NativeBase, View, Text, ListItem, Button, Icon } from 'native-base';

import { ChatBasicListItemType } from './types';

export interface IChatBasicListItemProps extends NativeBase.Container, ChatBasicListItemType {}

interface IChatBasicListItemState {
    profilePhoto?: any;
}

export class ChatBasicListItem extends React.Component<IChatBasicListItemProps, IChatBasicListItemState> {

    constructor(props: IChatBasicListItemProps){
        super(props);
        let profilePhoto;
        const images = this.props.otherUsersSettings.images;

        if(images){
            for(let i = 0; i < images.length; i++){
                const image = images[i];
                if(image.primary){
                    profilePhoto = image;
                }
            }
        }

        this.state = {
            profilePhoto
        }
    }

    public render(){
        const { viewStyle, itemStyle, srcWrapperStyle, viewInnerStyle, viewInnerWrapperStyle, notificationWrapperStyle, notificationStyle, nameStyle, contentStyle } = styles;
        const { name, detailedChatList, unRead, onPress, onLongPress, onImagePress, style } = this.props;
        const { profilePhoto } = this.state;
        
        return (
            <ListItem style={[itemStyle, style]} noBorder onLongPress={onLongPress} onPress={onPress}>
                <View style={viewStyle}>
                    <Button transparent style={srcWrapperStyle} onPress={() => onImagePress && onImagePress(profilePhoto ? profilePhoto.path : undefined)}>
                        {profilePhoto && profilePhoto.path ?
                            <Image
                                source={{ uri: profilePhoto.path }}
                                style={{ width: 45, height: 45, borderRadius: 22 }}
                            />
                            :
                            <View style={{ width: 45, height: 45, backgroundColor: '#007aff', borderRadius: 23, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name='ios-person' style={{ color: 'white', marginLeft: 0, marginRight: 0, fontSize: 25, borderRadius: 20 }} />
                            </View>
                        }
                    </Button>
                    <View style={viewInnerWrapperStyle}>
                        <View style={[viewInnerStyle, { flex: 1 }]}>
                            <Text style={nameStyle}>
                                { name }
                            </Text>
                            <Text numberOfLines={1} style={contentStyle}>
                                { detailedChatList ? detailedChatList[detailedChatList.length - 1].content : '' }
                            </Text>
                        </View>
                        <View style={[viewInnerStyle]}>
                            {unRead !== null && unRead !== undefined && parseInt(unRead, 10) > 0 &&
                                <View style={notificationWrapperStyle}>
                                    <Text style={notificationStyle}>
                                        { unRead }
                                    </Text>
                                </View>
                            }
                        </View>
                    </View>
                </View>
            </ListItem>
        );
    }
};

const styles = StyleSheet.create({
    itemStyle: {
        height: 'auto',
        width: 'auto',
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: 0
    },
    viewStyle: {
        flex: 1,
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    srcStyle: {
        fontSize: 16,
        color: 'white'
    },
    srcWrapperStyle: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: 45,
        height: 45,
        padding: 0,
        backgroundColor: '#007aff',
        borderRadius: 22,
        marginRight: 10
    },
    viewInnerStyle: {
        flexDirection: 'column',
        borderColor: 'rgba(0,0,0,.15)'
    },
    viewInnerWrapperStyle: {
        borderColor: 'rgba(0,0,0,.15)', 
        paddingVertical: 12, 
        flex: 1, 
        alignItems: 'center', 
        flexDirection: 'row', 
        borderBottomWidth: 1
    },
    contentStyle: {
        fontSize: 16
    },
    notificationWrapperStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        backgroundColor: '#007aff',
        borderRadius: 10
    },
    notificationStyle: {
        color: 'white',
        fontSize: 12,
        marginLeft: 0.5,
        marginBottom: 1.2
    },
    nameStyle: {
        fontSize: 20
    }
});
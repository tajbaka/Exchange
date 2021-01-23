import React from 'react';

import { Image, StyleSheet } from 'react-native';

import { CreateMessageListItemType } from './types';

import { NativeBase, View, Text, ListItem, Button, Icon } from 'native-base';

export interface ICreateMessageListItemProps extends NativeBase.Container, CreateMessageListItemType {}

interface ICreateMessageListItemState {
    profilePhoto?: any;
}

export class CreateMessageListItem extends React.Component<ICreateMessageListItemProps, ICreateMessageListItemState> {
    constructor(props: ICreateMessageListItemProps){
        super(props);
        let profilePhoto;
        const images = this.props.images;

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
        const { viewStyle, buttonStyle, srcWrapperStyle, nameStyle, spokenLanguageStyle, spokenLanguageWrapperStyle } = styles;
        const { name, spokenLanguage, onLongPress, onPress, style, onImagePress, status } = this.props;
        const { profilePhoto } = this.state;

        return (
            <ListItem style={[buttonStyle, style]} noBorder onLongPress={onLongPress} onPress={onPress}>
                <View style={viewStyle}>
                    <Button transparent style={srcWrapperStyle} onPress={() => onImagePress && onImagePress(profilePhoto ? profilePhoto.path : undefined)}>
                        {/* <View style={{ position: 'absolute', right: 0, bottom: 2, zIndex: 100, width: 12, height: 12, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)', backgroundColor: status ? '#00d200' : 'white' }} /> */}
                        {profilePhoto ?
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
                    <Text style={nameStyle}>
                        { name }
                    </Text>
                    <View style={spokenLanguageWrapperStyle}>
                        <Text style={spokenLanguageStyle}>
                            { spokenLanguage }
                        </Text>
                    </View>
                </View>
            </ListItem>
        );
    }
};

const styles = StyleSheet.create({
    buttonStyle: {
        height: 'auto',
        width: 'auto',
        borderRadius: 0,
        marginTop: -10
    },
    viewStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    srcTextStyle: {
        fontSize: 16,
        color: 'white'
    },
    srcWrapperStyle: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: 45,
        height: 45,
        backgroundColor: '#007aff',
        borderRadius: 22.5,
        marginRight: 10
    },
    nameStyle: {
        fontSize: 20,
        marginRight: 10
    },
    spokenLanguageStyle: {
        fontSize: 14,
        marginBottom: 2,
        color: 'white'
    },
    spokenLanguageWrapperStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 20,
        backgroundColor: '#00AEEF',
        borderRadius: 25
    }
});
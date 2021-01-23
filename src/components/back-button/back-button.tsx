import React from 'react';

import {
    Image,
    Platform
  } from 'react-native';

import { Button, Icon, Text,  NativeBase, View } from 'native-base';

interface IBackButtonProps extends NativeBase.Button {
    title?: string;
    leftButtonTitle?: string;
    themeColor?: string;
    subtitle?: string;
    image?: any;
    rightItem?: boolean;
    showImage?: boolean;
    onContentPress?: () => void;
}

export const BackButton: React.SFC<IBackButtonProps> = props => {
    const { onPress, title, leftButtonTitle, subtitle, rightItem, image, themeColor, onContentPress, showImage } = props;

    return (
        <React.Fragment>
            {Platform.OS === 'ios' ? 
                <View style={{ flexDirection: 'row', alignItems: 'center', overflow: 'hidden' }}>
                 <Button
                    style={{ 
                        backgroundColor: 'transparent',
                        width: leftButtonTitle ? 'auto' : 30,
                        height: leftButtonTitle ? 'auto' : 30,
                    }}
                    transparent
                    onPress={onPress}
                >
                    <Icon name='ios-arrow-back' style={[{ color: themeColor ? themeColor : 'white', fontSize: 30, width: 30, height: 30 }, leftButtonTitle && { width: 'auto' }]} />
                    {leftButtonTitle &&
                        <Text style={{ color: themeColor ? themeColor : 'white', fontSize: 20, paddingLeft: 0 }}>
                            {(leftButtonTitle.length > 17 && rightItem) ?
                                (((leftButtonTitle).substring(0,17-3)) + '...')
                                :
                                leftButtonTitle
                            }
                        </Text>
                    }
                </Button>
                <Button transparent style={{ marginLeft: 20 }} onPress={onContentPress}>
                    {image ?
                        <Image
                            source={{ uri: image.path }}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                        :
                    showImage &&
                        <View style={{ width: 40, height: 40, backgroundColor: '#82beff', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name='ios-person' style={{ color: 'white', marginLeft: 0, marginRight: 0, fontSize: 25, borderRadius: 20 }} />
                        </View>
                    }
                    <View style={{ marginLeft: 10 }}>
                        {title && 
                            <Text style={{ color: themeColor ? themeColor : 'white', fontSize: 20 }}>
                                {(title.length > 17 && rightItem) ? 
                                    (((title).substring(0,17-3)) + '...')
                                    :
                                    title
                                }
                            </Text>
                        }
                        {subtitle && 
                            <Text style={{ fontSize: 12, color: themeColor ? themeColor : 'white', marginLeft: 2 }}>
                                { subtitle }
                            </Text>
                        }
                    </View>
                </Button> 
                </View>
                :
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Button
                        style={{
                            backgroundColor: 'transparent',
                            width: leftButtonTitle ? 'auto' : 45,
                            height: leftButtonTitle ? 'auto' : 45,
                            overflow: 'hidden'
                        }}
                        transparent
                        onPress={onPress}
                    >
                        <Icon name='ios-arrow-round-back' style={[{ color: themeColor ? themeColor : 'white', fontSize: 35,  width: 35, height: 35 }, leftButtonTitle && { width: 'auto' }]} />
                        {leftButtonTitle &&
                            <Text uppercase={false} style={{ color: themeColor ? themeColor : 'white', fontSize: 20, paddingLeft: 0 }}>
                                {(leftButtonTitle.length > 17 && rightItem) ?
                                    (((leftButtonTitle).substring(0,17-3)) + '...')
                                    :
                                    leftButtonTitle
                                }
                            </Text>
                        }
                    </Button>
                    <Button transparent style={{ marginLeft: 10 }} onPress={onContentPress}>
                        {image ?
                            <Image
                                source={{ uri: image.path }}
                                style={{ width: 40, height: 40, borderRadius: 20 }}
                            />
                            :
                        showImage &&
                            <View style={{ width: 40, height: 40, backgroundColor: '#82beff', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name='ios-person' style={{ color: 'white', marginLeft: 0, marginRight: 0, fontSize: 25, borderRadius: 20 }} />
                            </View>
                        }
                        <View style={{ marginLeft: 10 }}>
                            {title && 
                                <Text style={{ color: themeColor ? themeColor : 'white', fontSize: 20 }}>
                                    {(title.length > 17 && rightItem) ? 
                                        (((title).substring(0,17-3)) + '...')
                                        :
                                        title
                                    }
                                </Text>
                            }
                            {subtitle && 
                                <Text style={{ fontSize: 12, color: themeColor ? themeColor : 'white', marginLeft: 2 }}>
                                    { subtitle }
                                </Text>
                            }
                        </View>
                    </Button> 
                </View>
            }
        </React.Fragment>
    );
};
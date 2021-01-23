import React from 'react';

import { StyleSheet, Image, Text, Platform } from 'react-native';

import { View, Button, Icon } from 'native-base';

import { setPhotoLanguage } from '../languages';

interface IPhotoProps {
    style?: any;
    url?: string;
    placeholderText?: string;
    primary?: boolean;
    spokenLanguage: string | null;
    onPress?: () => void;
    onClosePress?: () => void;
}

export class Photo extends React.Component<IPhotoProps> {

    constructor(props: IPhotoProps) {
        super(props);
    }

    static navigationOptions = {
        header: null,
    };

    public render() {
        const { viewStyle, primaryImageStyle, buttonStyle, primaryImageTextStyle, placeholderStyle, placeholderTextStyle, closeButtonStyle, closeButtonIconStyle, imageStyle } = styles;
        const { url, style, onPress, onClosePress, primary, placeholderText, spokenLanguage } = this.props;

        const languageContent = setPhotoLanguage[spokenLanguage as any];
 
        return (
            <View style={[ viewStyle,  style ]}>
                {url ? 
                    <React.Fragment>
                        {primary &&
                            <View style={primaryImageStyle}>
                                <Text style={primaryImageTextStyle}> { languageContent.primaryPhoto }  </Text>
                            </View>
                        }
                        <Image
                            source={{ uri: url }}
                            style={imageStyle}
                        />
                    </React.Fragment>
                :
                    <View style={placeholderStyle} > 
                        <Text style={placeholderTextStyle}> 
                            { placeholderText ? placeholderText : 'image' } 
                        </Text> 
                    </View>
                }
                <Button 
                    onPress={onPress} 
                    transparent 
                    style={buttonStyle} 
                />
                {onClosePress &&
                    <Button onPress={onClosePress} transparent style={closeButtonStyle}>
                        <Icon style={[closeButtonIconStyle, Platform.OS === 'android' ? { fontSize: 15 }: { fontSize: 22, marginTop: 2 }]} name='close' />
                    </Button>
                }
            </View>
        );
    }
};

const styles = StyleSheet.create({ 
    viewStyle: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 50,
        shadowOffset: { width: 10, height: 10 },  
        shadowColor: 'black',  
        shadowOpacity: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,  
        zIndex: 1,
    },
    placeholderTextStyle: {
        color: 'white', 
        fontSize: 16, 
        padding: 10,
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    placeholderStyle: {
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0, 
        bottom: 0, 
        right: 0, 
        left: 0,
        zIndex: 1,
        backgroundColor: '#E5E5E5'
    },
    imageStyle: {
        position: 'absolute', 
        top: 0, 
        bottom: 0, 
        right: 0, 
        left: 0,
        zIndex: 1
    },
    primaryImageStyle : {
        zIndex: 2,
        marginTop: -10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryImageTextStyle: {
        textAlign: 'center',
        color: 'white',
        paddingHorizontal: 10,
        paddingVertical: 2,
        backgroundColor: 'grey',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white'
    },
    closeButtonIconStyle: {
        color: 'black', 
        opacity: 0.6, 
        fontSize: 15, 
        width: 22, 
        textAlign: 'center'
    },
    closeButtonStyle: {
        width: 30, 
        height: 30, 
        borderRadius: 15, 
        backgroundColor: 'white', 
        position: 'absolute', 
        justifyContent: 'center',
        alignItems: 'center',
        top: 15, 
        right: 15,
        zIndex: 3,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0
    },
    buttonStyle: {
        position: 'absolute', 
        right: 0, 
        left: 0, 
        height: '100%',
        opacity: 0,
        maxHeight: 1000,
        maxWidth: 1000,
        zIndex: 2
    }
});
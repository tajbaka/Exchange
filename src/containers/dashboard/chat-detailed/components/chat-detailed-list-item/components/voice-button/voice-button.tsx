import React from 'react';

import { StyleSheet, Image } from 'react-native';

import { Button, Icon, View } from 'native-base';

interface IVoiceButtonProps {
    buttonStyle?: any;
    imageStyle?: any;
    imageOverlayStyle?: any;
    iconStyle?: any;
    iconName: string;
    uri?: string;
    onPress: () => void;
}

export const VoiceButton: React.SFC<IVoiceButtonProps> = props => {
    const { defaultButtonStyle, defaultImageStyle, defaultIconStyle, defaultImageOverlayStyle } = styles;
    const { onPress, buttonStyle, iconName, imageStyle, imageOverlayStyle, iconStyle, uri } = props;

    return (
        <Button 
            onPress={onPress} 
            style={[defaultButtonStyle, buttonStyle]}
            transparent
        >
            {uri && <Image source={{ uri }} style={[defaultImageStyle, imageStyle]} /> }
            <View style={[defaultImageOverlayStyle, imageOverlayStyle]} />
            <Icon name={iconName} style={[defaultIconStyle, iconStyle]}/>
        </Button>
    );
};

const styles = StyleSheet.create({
    defaultButtonStyle: {
        position: 'relative', 
        elevation: 3, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.2, 
        marginRight: 5, 
        borderRadius: 20, 
        height: 42, 
        width: 42, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    defaultImageStyle: {
        width: 38, 
        height: 38, 
        opacity: 1, 
        borderRadius: 20, 
        position: 'absolute'
    },
    defaultImageOverlayStyle: {
        backgroundColor: 'rgba(0,0,0,0.25)',
        position: 'absolute',
        borderRadius: 20,
        width: 38, 
        height: 38
    },
    defaultIconStyle: {
        width: 25, 
        height: 25, 
        fontSize: 25, 
        color: 'white', 
        marginRight: 0, 
        marginLeft: 0, 
        marginTop: -2
    }
});
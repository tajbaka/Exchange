import React from 'react';

import { StyleSheet } from 'react-native';

import { Button, Icon } from 'native-base';

interface IPlayButtonProps {
    buttonStyle?: any;
    iconStyle?: any;
    onPlay: (type: string) => void;
}

export const PlayButton: React.SFC<IPlayButtonProps> = props => {
    const { defaultButtonStyle, defaultIconStyle } = styles;
    const { onPlay, buttonStyle, iconStyle } = props;

    return (
        <Button onPress={() => onPlay('recording')} transparent style={[defaultButtonStyle, buttonStyle]}>
            <Icon name='md-play-circle' style={[defaultIconStyle, iconStyle]}/>
        </Button>
    );
};

const styles = StyleSheet.create({
    defaultButtonStyle: {
        width: 40, 
        height: 35,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    defaultIconStyle: {
        width: 35, 
        height: 35, 
        fontSize: 30, 
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
        color: 'white'
    }
});
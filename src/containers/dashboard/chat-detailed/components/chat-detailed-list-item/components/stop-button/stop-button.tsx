import React from 'react';

import { StyleSheet } from 'react-native';

import { Button, Icon } from 'native-base';

interface IStopButtonProps {
    buttonStyle?: any;
    iconStyle?: any;
    onStop: () => void;
}

export const StopButton: React.SFC<IStopButtonProps> = props => {
    const { defaultButtonStyle, defaultIconStyle } = styles;
    const { onStop, buttonStyle, iconStyle } = props;

    return (
        <Button onPress={onStop} transparent style={[defaultButtonStyle, buttonStyle]}>
            <Icon name='ios-square' style={[defaultIconStyle, iconStyle]}/>
        </Button>
    );
};

const styles = StyleSheet.create({
    defaultButtonStyle: {
        width: 40, 
        height: 35,
        justifyContent: 'center', 
        alignItems: 'center'
    },
    defaultIconStyle: {
        width: 35, 
        height: 35, 
        fontSize: 30, 
        marginRight: 0, 
        marginLeft: 0,
        marginTop: 0,
        marginBottom: 0,
        color: 'white' 
    }
});
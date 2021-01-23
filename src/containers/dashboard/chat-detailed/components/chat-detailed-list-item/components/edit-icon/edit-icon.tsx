import React from 'react';

import { StyleSheet } from 'react-native';

import { View, Icon } from 'native-base';

interface IEditIconProps {
    viewStyle?: any;
    iconStyle?: any;
    name: string
}

export const EditIcon: React.SFC<IEditIconProps> = props => {
    const { defaultViewStyle, defaultIconStyle } = styles;
    const { name, viewStyle, iconStyle } = props;

    return (
        <View style={[defaultViewStyle, viewStyle]}>
            <Icon name={name} style={[defaultIconStyle, iconStyle]} />
        </View>
    );
};

const styles = StyleSheet.create({
    defaultViewStyle: {
        marginRight: 5, 
        backgroundColor: 'white', 
        width: 20, 
        height: 20, 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    defaultIconStyle: {
        fontSize: 22
    }
});
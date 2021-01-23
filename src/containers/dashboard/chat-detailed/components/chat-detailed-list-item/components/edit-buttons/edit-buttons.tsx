import React from 'react';

import { StyleSheet, TouchableOpacity } from 'react-native';

import { View, Icon,  } from 'native-base';

interface IEditButtonsProps {
    viewStyle?: any;
    editingMessage: boolean;
    onEdit: () => void;
    onStopEdit: () => void;
}

export const EditButtons: React.SFC<IEditButtonsProps> = props => {
    const { closeButtonStyle, editButtonStyle, editButtonIconStyle, closeButtonIconStyle } = styles;
    const { editingMessage, onEdit, onStopEdit, viewStyle } = props;

    return (
        <View style={viewStyle}>
            {editingMessage ?
                <TouchableOpacity style={closeButtonStyle} onPress={onStopEdit}>
                    <Icon name='ios-close-circle' style={closeButtonIconStyle} />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={onEdit}>
                    <View style={editButtonStyle}>
                        <Icon name='md-create' style={editButtonIconStyle} />
                    </View>
                </TouchableOpacity>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    closeButtonStyle: {
        height: 35, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    closeButtonIconStyle: {
        color: '#007aff', 
        fontSize: 35, 
        marginTop: -2
    },
    editButtonStyle: {
        width: 30, 
        height: 30, 
        backgroundColor: '#007aff', 
        borderRadius: 15, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    editButtonIconStyle: {
        transform: [{ rotate: '-90deg'}],
        marginLeft: 0, 
        marginRight: 0, 
        color: 'white', 
        fontSize: 18 
    }
});
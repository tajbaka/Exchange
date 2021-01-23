import React from 'react';

import {
    StyleSheet,
    Text
  } from 'react-native';

import { Button, View } from 'native-base';

interface IChatDetailedUserBlockedProps {
    languageContent: any;
    onBlockUser?: () => void;
}

export const ChatDetailedUserBlocked: React.SFC<IChatDetailedUserBlockedProps> = props => {
    // const { tabStyle, textStyle, activeTextStyle, activeTabStyle } = styles;
    const { languageContent, onBlockUser } = props;

    return (
        <Button transparent activeOpacity={1} style={{ position: 'absolute', top: 0, height: '100%', width: '100%', backgroundColor: 'transparent', zIndex: 999 }}>
            <View style={{ backgroundColor: 'white', position: 'absolute', top: 0, height: '100%', width: '100%', opacity: 0.5 }} />
            <View style={{ position: 'absolute', justifyContent: 'space-between', borderRadius: 20, left: 10, right: 10, padding: 10, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 3, }}>
                <Text style={{ textAlign: 'center', fontSize: 15 }}> { languageContent.userIsBlocked } </Text>
                <Button transparent style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                    <Button style={{ borderWidth: 1, paddingHorizontal: 10, borderRadius: 10, borderColor: '#007aff', justifyContent: 'center' }} transparent onPress={onBlockUser}>
                        <Text style={{ textAlign: 'center', color: '#007aff' }}>
                            { languageContent.unblockUser }
                        </Text>
                    </Button>
                </Button>
            </View>
        </Button>
    );
};

const styles = StyleSheet.create({
    tabStyle: {
        backgroundColor: 'white', 
        flex: 1,
        borderColor: 'red'
    },
    activeTabStyle: {
        backgroundColor: 'white', 
        borderColor: '#007aff',
        flex: 1, 
        borderBottomWidth: 3, 
        marginBottom: 0,
        marginTop: 3,
        zIndex: 1,
    },
    tabUnderlineStyle: {
        backgroundColor: '#007aff'
    },
    textStyle: {
        fontSize: 12, 
        color: '#007aff', 
        opacity: 0.7
    },
    activeTextStyle : {
        fontSize: 12, 
        color: '#007aff', 
        opacity: 1
    }
});
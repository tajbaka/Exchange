import React from 'react';

import {
    StyleSheet,
    View
} from 'react-native';

import { userBannedLanguages } from './languages';

import { Text } from 'native-base';

interface IUserBannedProps {
    spokenLanguage: string;
}

export const UserBanned: React.SFC<IUserBannedProps> = props => {
    const { spokenLanguage } = props;
    const languageContent = userBannedLanguages[spokenLanguage];

    return (
        <View style={{ position: 'absolute', backgroundColor: 'white', top: 0, alignItems: 'center', paddingHorizontal: 10, justifyContent: 'center', zIndex: 1000, height: '100%', width: '100%' }}>
            <Text style={{ paddingVertical: 10, textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>
                { languageContent.title }
            </Text>
            <View style={{ justifyContent: 'center' }}>
                <Text style={{ paddingVertical: 10, textAlign: 'center', fontSize: 14 }}>
                    { languageContent.description }
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    
});
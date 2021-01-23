import React from 'react';

import {
    StyleSheet,
    ScrollView,
    View
} from 'react-native';

import { userPolicyLanguages } from './languages';

import { Button, Text } from 'native-base';

interface IUserPolicyProps {
    userAgreement: string;
    spokenLanguage: string;
    onAccept: () => void;
}

export const UserPolicy: React.SFC<IUserPolicyProps> = props => {
    const { userAgreement, onAccept, spokenLanguage } = props;
    const languageContent = userPolicyLanguages[spokenLanguage];

    return (
        <View style={{ position: 'absolute', backgroundColor: 'white', top: 0, zIndex: 1000, height: '100%', width: '100%' }}>
            <Text style={{ paddingVertical: 10, alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>
                { languageContent.userAgreement }
            </Text>
            <ScrollView>
                <View style={{ paddingHorizontal: 10, paddingBottom: 100 }}>
                    <Text style={{ fontSize: 12 }}>
                        { userAgreement }
                    </Text>
                </View>
            </ScrollView>
            <Button activeOpacity={0.8} onPress={onAccept} transparent style={{ backgroundColor: '#007aff', borderRadius: 10, alignSelf: 'center', position: 'absolute', bottom : 20, paddingHorizontal: 10 }}>
                <Text style={{ color: 'white' }}>
                    { languageContent.accept }
                </Text>
            </Button>
        </View>
        
    );

};

const styles = StyleSheet.create({
    
});
import React from 'react';


import { Image, Modal } from 'react-native';

import { Button, Icon, Text, NativeBase, View } from 'native-base';

import { miniProfileLanguages } from './languages';

interface IMiniProfileProps extends NativeBase.Container {
    profileItem?: any;
    navigation: any;
    spokenLanguage: string;
    onDismiss: () => void;
    onShowProfile: (profileItem: any) => void;
}

export class MiniProfile extends React.Component<IMiniProfileProps> {

    constructor(props: IMiniProfileProps){
        super(props);

        this.state = {
            showModal: false
        }
    }

    render() {
        const { profileItem, spokenLanguage, onShowProfile, onDismiss } = this.props;
        const languageContent = miniProfileLanguages[spokenLanguage];

        return (
            <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                <View style={{ zIndex: 2, height: 250, width: 200, borderRadius: 10, overflow: 'hidden', flexDirection: 'column', borderWidth: 1, borderColor: 'rgba(0,0,0,.15)' }}>
                <View style={{ zIndex: 10, position: 'absolute', top: 0, right: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.3)', height: 30, justifyContent: 'center' }}>
                    {profileItem && 
                        <Text style={{ fontSize: 14, color: 'white', textAlign: 'center' }}>
                            { profileItem.name }
                        </Text>
                    }
                    </View>
                    <Button transparent onPress={() => onShowProfile(profileItem)} style={{ height: 250, backgroundColor: '#82beff', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        <View style={{ position: 'absolute', top: 30, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name='ios-happy' style={{ color: 'white', fontSize: 100, marginBottom: 40 }} />
                        </View>
                        {profileItem && profileItem.profilePhoto &&
                            <Image
                                source={{ uri: profileItem.profilePhoto }}
                                style={{ height: 250, width: 200 }}
                            />
                        }
                        <Text style={{ position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)', textAlign: 'center', borderBottomRightRadius: 10, borderBottomLeftRadius: 10, padding: 10, height: 40, bottom: 0, left: 0, right: 0, fontSize: 14, color: 'white' }}>
                            { languageContent.showProfile }
                        </Text>
                    </Button>
                </View>
                <Button transparent style={{ position: 'absolute', zIndex: 1, height: '100%', width: '100%' }} onPress={onDismiss} />
            </View>
        );
    }
};
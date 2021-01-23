import React from 'react';

import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { chatActions } from '../../../actions';

import { StyleSheet, FlatList, Modal, View, Text, StatusBar } from 'react-native';

import { BackButton, MiniProfile } from '../../../components';

import { CreateMessageListItem } from './components';

import { Container, NativeBase } from 'native-base';

import { createMessageLanguages } from './languages';

export interface ICreateMessageProps extends NativeBase.Container {
    users: Array<any>;
    tab: number;
    status: boolean;
    spokenLanguage: string;
    onCreateMessageItemClick: (navigation: any, otherUsersSettings: any) => (dispatch: Dispatch<any>) => Promise<void>;
}

interface ICreateMessageState {
    firstTimeLoad?: boolean;
    profileItem: any;
}

class CreateMessage extends React.Component<ICreateMessageProps, ICreateMessageState> {

    constructor(props: ICreateMessageProps){
        super(props);

        this.showProfile = this.showProfile.bind(this);
        this.onItemImageClick = this.onItemImageClick.bind(this);

        const { spokenLanguage } = this.props;

        (this.props as any).navigation.setParams({
            spokenLanguage
        })

        this.state = {
            profileItem: null
        }
    }

    static navigationOptions = ({ navigation }: any) => {
        const navigationParams = navigation.state.params;
        const { spokenLanguage } = navigationParams;
        const languageContent = createMessageLanguages[spokenLanguage];

        return {
            headerBackTitle: null,
            headerLeft: 
                <BackButton 
                    onPress={() => {
                        navigation.pop()
                    }}
                    leftButtonTitle={languageContent.selectContact} 
                />
            ,
            headerStyle: {
                backgroundColor: '#007aff'
            },
            headerTintColor: 'white'
        }
    };

    public render() {
        const { containerStyle, listStyle } = styles;
        const { users, onCreateMessageItemClick, spokenLanguage } = this.props;
        const { profileItem } = this.state;

        const languageContent = createMessageLanguages[spokenLanguage];

        return (
            <Container style={containerStyle}>
                <StatusBar barStyle="light-content" hidden={false} translucent={false} backgroundColor="#007aff" />
                <Modal visible={profileItem !== null} transparent={true} animated={false}>
                    <MiniProfile
                        navigation={(this.props as any).navigation}
                        spokenLanguage={spokenLanguage}
                        profileItem={profileItem} 
                        onShowProfile={this.showProfile}
                        onDismiss={() => { this.setState({ profileItem: null }) }}
                    />
                </Modal>
                {users.length > 0 ? 
                <FlatList
                    style={listStyle}
                    onEndReached={() => (this.props as any).navigation.setParams({ loading: false })}
                    keyExtractor={item => item.userUid}
                    data={users}
                    renderItem={({ item }) => 
                        <React.Fragment>
                            {
                                (item.userUid == users[users.length - 1].userUid) ?
                                <React.Fragment>
                                    <CreateMessageListItem {...item} onPress={() => onCreateMessageItemClick((this.props as any).navigation, item)} onImagePress={(profilePhoto: string) => this.onItemImageClick(item, profilePhoto)} />
                                    <View style={{ height: 30 }} />
                                </React.Fragment>
                                :
                                <CreateMessageListItem style={(item.userUid == users[users.length - 1].userUid) && { marginBottom: 30 }} {...item} onPress={() => onCreateMessageItemClick((this.props as any).navigation, item)} onImagePress={(profilePhoto: string) => this.onItemImageClick(item, profilePhoto)} />
                            }
                        </React.Fragment>
                    }
                />
                :
                <View style={{ position: 'absolute', right: 0, left: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{alignSelf: 'center', color: '#007aff', fontSize: 22 }}>
                        { languageContent.noUsers }
                    </Text>
                </View>
                }
            </Container>
        );
    }

    private showProfile(profileItem: any){
        this.setState({ profileItem: null }, () => {
            (this.props as any).navigation.navigate('ProfileDetailed', { title: profileItem.name, about: profileItem.about, otherUsersSettings: {...profileItem} });
        });
    }

    private onItemImageClick(item: any, profilePhoto: string){
        let profileItem = {
            ...item
        }
        if(profilePhoto){
            profileItem = { ...profileItem, profilePhoto };
        }
        this.setState({ profileItem });
    }
};

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        backgroundColor: 'white',
    },
    listStyle: {

    }
});


const mapStateToProps = (state: any) => {
    const { chat, auth, accountSettings } = state;
    const { spokenLanguage, status } = accountSettings;
    const { tab } = chat;
    const { userUid } = auth;
    const { users } = chat;

    return {
      users,
      userUid,
      status,
      spokenLanguage,
      tab
    };
};
  
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
      onChangeTranslationChatText: bindActionCreators(
        chatActions.onChangeTranslationChatText,
        dispatch
      ),
      onSendMessage: bindActionCreators(
        chatActions.onSendMessage,
        dispatch
      ),
      onChatDetailItemClick: bindActionCreators(
        chatActions.onChatDetailItemClick,
        dispatch
      ),
      onCreateMessageItemClick: bindActionCreators(
        chatActions.onCreateMessageItemClick,
        dispatch
      )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateMessage);
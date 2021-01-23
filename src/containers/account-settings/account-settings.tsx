import React from 'react';

import { ScrollView, StyleSheet, Image, Linking, StatusBar, Dimensions, Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';

import { connect } from "react-redux";

import { authActions, accountSettingsActions } from '../../actions';

import { accountSettingsLanguages } from './languages';

import { IAccountSettingsProps } from "./types";

import { BackButton } from '../../components';

import changeNavigationBarColor from 'react-native-navigation-bar-color';

import { bindActionCreators, Dispatch } from "redux";
import { Icon, Picker, Text, View, Input, Item, Button, Textarea } from 'native-base';

interface IAccountSettingState {
    name: string;
    about: string;
    learningOptions: any;
    spokenOptions: any;
    primaryPhoto: any;
    url: string;
    screenWidth: any;
}

class AccountSettings extends React.Component<IAccountSettingsProps, IAccountSettingState> {
    
    static navigationOptions = ({ navigation }: any) => {
        const navigationParams = navigation.state.params;
        const { spokenLanguage, onLogoutUser } = navigationParams;
        const languageContent = accountSettingsLanguages[spokenLanguage];

        return {
            headerStyle: {
                backgroundColor: '#007aff'
            },
            headerRight:
                <Button style={{ height: '100%' }} transparent onPress={() => onLogoutUser && onLogoutUser()}>
                    <Text style={{ color: 'white', textTransform: 'capitalize' }}>
                        { languageContent && languageContent.logout }
                    </Text>
                </Button>,
            headerLeft: 
            <BackButton 
                onPress={() => {
                    navigation.navigate('ChatBasic') 
                }}
                leftButtonTitle={languageContent.basicHeading} 
            />,
            headerTintColor: 'white'
        };
    };

    constructor(props: IAccountSettingsProps) {
        super(props);

        const { spokenLanguage, name, images, tab, about } = this.props;
        this.onEditPhotos = this.onEditPhotos.bind(this);
        this.onLogoutUser = this.onLogoutUser.bind(this);

        const languageContent = accountSettingsLanguages[spokenLanguage as any];

        const learningOptions = [
            { 
                title : languageContent && languageContent.spanish,
                translate: 'es'
            },
            { 
                title : languageContent && languageContent.english,
                translate: 'en'
            },
            { 
                title : languageContent && languageContent.none,
                translate: 'none'
            }
        ];

        const spokenOptions = [
            { 
                title : languageContent && languageContent.spanish,
                translate: 'es'
            },
            { 
                title : languageContent && languageContent.english,
                translate: 'en'
            }
        ];

        for(let i = 0; i < learningOptions.length; i++){
            if(spokenLanguage === learningOptions[i].translate){
                learningOptions.splice(i, 1);
            }
        }

        (this.props as any).navigation.setParams({
            onLogoutUser: () => this.onLogoutUser(),
            spokenLanguage,
            tab
        });

        let primaryPhoto;

        const screenWidth = Math.round(Dimensions.get('window').width);

        if(images){
            for(let i = 0; i < images.length; i++){
                const image = images[i];
                if(image.primary){
                    primaryPhoto = image;
                }
            }
        }
        
        const url = 'https://exchangemessenger.com/privacy';

        this.state = {
            screenWidth,
            url,
            name,
            about,
            spokenOptions,
            learningOptions,
            primaryPhoto 
        }
    }
    
    public componentDidMount(){
        changeNavigationBarColor('white', true, false);
    }

    public componentWillReceiveProps({ spokenLanguage, onUpdateLearningLanguage, images }: IAccountSettingsProps){
        if(spokenLanguage !== this.props.spokenLanguage){
            const languageContent = accountSettingsLanguages[spokenLanguage as any]
            const learningOptions = [
                { 
                    title : languageContent && languageContent.spanish,
                    translate: 'es'
                },
                { 
                    title : languageContent && languageContent.english,
                    translate: 'en'
                },
                { 
                    title : languageContent && languageContent.none,
                    translate: 'none'
                }
            ];
    
            const spokenOptions = [
                { 
                    title : languageContent && languageContent.spanish,
                    translate: 'es'
                },
                { 
                    title : languageContent && languageContent.english,
                    translate: 'en'
                }
            ];

            for(let i = 0; i < learningOptions.length; i++){
                if(spokenLanguage === learningOptions[i].translate){
                    learningOptions.splice(i, 1);
                    if(onUpdateLearningLanguage){  
                        onUpdateLearningLanguage('none');
                    }
                }
            }
            this.setState({ learningOptions, spokenOptions});
            (this.props as any).navigation.setParams({
                spokenLanguage
            });
        }
        if(this.props.images && images && this.props.images.slice() !== images.slice()){
            let primaryPhoto;
            if(images !== undefined) {
                images = images.slice();
                for(let i = 0; i < images.length; i++){
                    const image = images[i];
                    if(image.primary){
                        primaryPhoto = image;
                    }
                }
            }
            this.setState({ primaryPhoto });
        }
       
    }

    public render() {
        const { viewStyle, viewLoadingStyle, pickerStyle, textStyle } = styles;
        const { learningOptions, spokenOptions, name, primaryPhoto, screenWidth, about } = this.state;
        const { onUpdateAbout, onUpdateLearningLanguage, onUpdateSpokenLanguage, learningLanguage, spokenLanguage, loading, onUpdateName } = this.props;
        const languageContent = accountSettingsLanguages[spokenLanguage as any];
        
        return (
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : undefined} style={{ flex: 1 }}>
                <ScrollView style={loading ? viewLoadingStyle : viewStyle} pointerEvents={loading ? 'none' : 'auto'}>
                    <StatusBar barStyle="light-content" hidden={false} translucent={false} backgroundColor="#007aff" />
                    <Button transparent onPress={this.onEditPhotos} style={{ marginTop: 35, marginBottom: 10, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'flex-start' }}>
                        {primaryPhoto ? 
                            <Image
                                source={{ uri: primaryPhoto.path }}
                                style={{ width: 60, height: 60, borderRadius: 30 }}
                            />
                            :
                            <View style={{ width: 60, height: 60, backgroundColor: '#82beff', borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name='ios-person' style={{ color: 'white', marginLeft: 0, marginRight: 0, fontSize: 30, borderRadius: 20 }} />
                            </View>
                        }
                        <Text style={{ color: '#007aff', textTransform: 'uppercase', fontSize: 14 }}>
                            { languageContent.editPhotos }
                        </Text>
                    </Button>
                    <Text style={textStyle}>
                        { languageContent && languageContent.name }
                    </Text>
                    <Item>
                        <Input placeholder='Obrian Johnson...' style={{  }} onChangeText={name => this.setState({ name }) } value={name} />
                        {name !== this.props.name &&
                            <Button transparent onPress={() => onUpdateName && onUpdateName(name)}>
                                <Text style={{ color: '#007aff' }}>
                                    Save
                                </Text>
                            </Button>
                        }
                    </Item>
                    <Text style={textStyle}>
                        { languageContent && languageContent.tellUsAboutYou }
                    </Text>
                    <Item style={{ marginTop: 17, borderRadius: 10, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1 }}>
                        <Textarea onChangeText={about => this.setState({ about }) } value={about} placeholder={languageContent.myInterest +  '...'} placeholderTextColor={'rgba(0,0,0,.6)'} style={{ flex: 1, borderRadius: 10 }} rowSpan={5} bordered={false} underline={false} />
                        {about !== this.props.about &&
                            <Button style={{  }} transparent onPress={() => onUpdateAbout && onUpdateAbout(about)}>
                                <Text style={{ color: '#007aff' }}>
                                    Save
                                </Text>
                            </Button>
                        }
                    </Item>
                    <Text style={textStyle}>
                        { languageContent && languageContent.speak }
                    </Text>
                    <Item picker>
                        <Picker
                            style={[pickerStyle, { width: screenWidth - 33 }, Platform.OS === 'android' ? { marginTop: 0 }: { marginTop: 5, marginLeft: -7 }]}
                            mode="dropdown"
                            iosIcon={<Icon style={{ color: 'rgba(0,0,0,.5)' }} name="arrow-down" />}
                            selectedValue={spokenLanguage}
                            onValueChange={(itemValue: any) => onUpdateSpokenLanguage && onUpdateSpokenLanguage(itemValue)}
                        >   
                            {spokenOptions.map((option: any) => (
                                <Picker.Item label={option.title} value={option.translate} />
                            ))}
                        </Picker>
                    </Item>
                    <Text style={textStyle}>
                        { languageContent && languageContent.learn }
                    </Text>
                    <Item picker>
                        <Picker
                            style={[pickerStyle, { width: screenWidth - 33 }, Platform.OS === 'android' ? { marginTop: 0 }: { marginTop: 5, marginLeft: -7 }]}
                            mode="dropdown"
                            iosIcon={<Icon style={{ color: 'rgba(0,0,0,.5)' }} name="arrow-down" />}
                            selectedValue={learningLanguage}
                            onValueChange={(itemValue: any) => onUpdateLearningLanguage && onUpdateLearningLanguage(itemValue)}
                        >   
                            {learningOptions.map((option: any) => (
                                <Picker.Item label={option.title} value={option.translate} />
                            ))}
                        </Picker>
                    </Item>
                    <Button transparent style={{ marginVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <Icon name='md-list-box' style={{ fontSize: 25, marginLeft: 0, color: '#007aff', marginRight: 0 }} />
                        <Text style={{ fontSize: 14, color: '#007aff' }} onPress={() => Linking.openURL('https://exchangemessenger.com/privacy')}> { languageContent.ourPrivacyPolicy } </Text>
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    };

    private onEditPhotos = () => {
        (this.props as any).navigation.navigate('SetPhotos', { firstTimeLogin: false });
    }

    private onLogoutUser = () => {
        const { onLogoutUser } = this.props;
        if(onLogoutUser){
            onLogoutUser((this.props as any).navigation);
        }
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
        paddingHorizontal: 20
    },
    viewLoadingStyle: {
        opacity: 0.5,
        flex: 1,
        paddingHorizontal: 20
    },
    buttonWrapperStyle: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 20
    },
    buttonStyle: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: 125
    },
    pickerStyle: {
        marginTop: 20,
        // color: 'rgba(0,0,0,.70)'
    },
    textStyle: {
        marginTop: 20,
    }
});

const mapStateToProps = (state: any) => {
    const { accountSettings, global, chat } = state;
    const { tab } = chat;
    const { loading } = global;
    const { spokenLanguage, learningLanguage, name, about, images } = accountSettings;

    return {
        loading,
        images,
        learningLanguage,
        spokenLanguage,
        about,
        name,
        tab
    };
  };
  
  const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        onUpdateLearningLanguage: bindActionCreators(
            accountSettingsActions.onUpdateLearningLanguage,
            dispatch
        ),
        onUpdateSpokenLanguage: bindActionCreators(
            accountSettingsActions.onUpdateSpokenLanguage,
            dispatch
        ),
        onUpdateName: bindActionCreators(
            accountSettingsActions.onUpdateName,
            dispatch
        ),
        onUpdateAbout: bindActionCreators(
            accountSettingsActions.onUpdateAbout,
            dispatch
        ),
        onLogoutUser: bindActionCreators(
            authActions.onLogoutUser,
            dispatch
        )
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
import React from 'react';

import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import ImagePicker from 'react-native-image-crop-picker';

import { Container, View, Text, Button, Spinner, Icon } from 'native-base';

import { Dimensions, StyleSheet, ScrollView } from 'react-native';

import { IAccountSettingsProps } from "../../account-settings";

import { accountSettingsActions, arraysMatch } from '../../../actions';

import { Photo } from './photo';

import { setPhotoLanguage } from './languages';

import { BackButton } from '../../../components';

interface ISetPhotoState {
    url?: string;
    error?: string;
    images: Array<any>;
    newImages: Array<any>;
    selectedPhotoIndex?: number;
    showPrimary?: boolean;
    screenHeight: number;
    firstTimeLogin: boolean;
}

class SetPhoto extends React.Component<IAccountSettingsProps, ISetPhotoState> {

    constructor(props: IAccountSettingsProps) {
        super(props);
        this.onHandleChoosePhoto = this.onHandleChoosePhoto.bind(this);
        this.onRemovePhoto = this.onRemovePhoto.bind(this);
        this.onFinishClick = this.onFinishClick.bind(this);
        this.setPrimaryPhoto = this.setPrimaryPhoto.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onPageScroll = this.onPageScroll.bind(this);
        this.renderEmptyPhotos = this.renderEmptyPhotos.bind(this);

        const { spokenLanguage } = this.props; 

        let images = [];
        let newImages= [];

        if(this.props.images){
            images = this.props.images.slice();
            for(let i = 0; i < images.length; i++){
                const image = images[i];
                newImages.push({ uri: image.path })
            }
        }

        (this.props as any).navigation.setParams({
            spokenLanguage,
            onFinishClick: this.onFinishClick
        });

        const screenHeight = Math.round(Dimensions.get('window').height);
        const firstTimeLogin = (this.props as any).navigation.getParam('firstTimeLogin');

        this.state = {
            screenHeight,
            firstTimeLogin,
            images,
            newImages,
            url: undefined,
        }
    }

    static navigationOptions = ({ navigation }: any) => {
        const navigationParams = navigation.state.params;
        const { spokenLanguage, onFinishClick, firstTimeLogin } = navigationParams;
        const languageContent = setPhotoLanguage[spokenLanguage as any];

        if(!firstTimeLogin) {
            return {
                headerStyle: {
                    backgroundColor: '#007aff'
                },
                headerRight: 
                    <Button style={{ height: '100%' }} transparent onPress={onFinishClick}>
                        <Text style={{ color: 'white' }}>
                            { languageContent.save }
                        </Text>
                    </Button>,
                headerLeft: 
                    <BackButton 
                        onPress={() => {
                            navigation.pop()
                        }}
                        title={languageContent.uploadPhotos} 
                    />,
                headerTintColor: 'white'
            };
        }

        return {
            header: null
        };
    }

    public componentWillReceiveProps(nextProps: IAccountSettingsProps){
        if(!arraysMatch(nextProps.images, this.props.images, 'path')) {
            let images = [];
            let newImages= [];
    
            if(this.props.images){
                images = nextProps.images.slice();
                for(let i = 0; i < images.length; i++){
                    const image = images[i];
                    newImages.push({ uri: image.path })
                }
            }
            this.setState({ newImages, images });
        }
    }

    public render() {
        const { containerStyle, viewStyleLoading, errorStyle, titleStyle } = styles;
        const { loading, spokenLanguage } = this.props;
        const { images, error, screenHeight, firstTimeLogin } = this.state;
        const languageContent = setPhotoLanguage[spokenLanguage as any];

        return (
            <Container style={containerStyle}>
                {loading &&
                    <View style={viewStyleLoading} >
                        <Spinner size={50} color='#007aff'/>
                    </View>
                }
                {firstTimeLogin &&
                    <View style={{ paddingTop: 40 }}>
                        <Text style={titleStyle}> Set Photos </Text>
                    </View>
                }
                <ScrollView style={{ flexDirection: 'column', alignSelf: 'center' }}>
                    <View style={{ width: '100%', paddingHorizontal: 15, paddingVertical: 50, height: screenHeight/1.0 - 50, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ position: 'absolute', height: 50, zIndex: 1, paddingTop: 10 }}>
                            <Text style={errorStyle}> 
                                { error }
                            </Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', flex: 1, overflow: 'hidden', flexWrap: 'wrap' }}>
                            {images.map((image: any, index: number) => (
                                <React.Fragment>
                                    <Photo
                                        style={
                                            index % 2 === 0 ? 
                                            { display: 'flex', width: '48%', height: '31%', marginRight: '4%', marginBottom: 10 }:
                                            { display: 'flex', width: '48%', height: '31%', marginBottom: 10 }
                                        }
                                        primary={image.primary}
                                        spokenLanguage={spokenLanguage}
                                        url={image.path}
                                        onPress={() => this.onSelectPhoto(index)}
                                        onClosePress={() => this.onRemovePhoto(index)}
                                    />
                                </React.Fragment>
                            ))}
                            {this.renderEmptyPhotos(images.length)}
                        </View>
                    </View>
                </ScrollView>
                {firstTimeLogin &&
                    <View style={{ flexDirection: 'row', width: '100%', marginVertical: 20, paddingHorizontal: 15, alignItems: 'flex-end', justifyContent: 'space-between' }}>
                        <Button 
                            transparent 
                            onPress={() => {
                                (this.props as any).navigation.pop()
                            }}
                        >
                            <Icon style={{ color: '#007aff', marginLeft: 0 }} name={'ios-arrow-back'} />
                            <Text style={{ color: '#007aff', marginLeft: -15 }}> {languageContent.back} </Text>
                        </Button>
                        <Button 
                            style={{ 
                                backgroundColor: '#007aff',
                                borderRadius: 5,
                            }}
                            onPress={this.onFinishClick}
                        >
                            <Text>
                                Finish
                            </Text>
                        </Button>
                    </View>
                }
            </Container>
        );
    }

    private renderEmptyPhotos(length: number){
        const { spokenLanguage } = this.props;
        const languageContent = setPhotoLanguage[spokenLanguage as any];
        const size = 6 - length;
        const arr = []

        for(let i = 0; i < size; i++){
            arr.push({})
        }

        return (
            <React.Fragment>
                {arr.map((element: any, index: any) => (
                    <Photo
                        style={
                            (index + length) % 2 === 0 ? 
                            { display: 'flex', width: '48%', height: '31%', marginRight: '4%', marginBottom: 10 }:
                            { display: 'flex', width: '48%', height: '31%', marginBottom: 10 }
                        }
                        placeholderText={languageContent.uploadPhoto}
                        spokenLanguage={spokenLanguage}
                        primary={false}
                        onPress={this.onHandleChoosePhoto}
                    />
                ))}
            </React.Fragment>
        );
    }

    private onPageScroll(event: any){
        const { position } = event;
        const { images } = this.state;
        if(images[position].primary){
            this.setState({ showPrimary: true, selectedPhotoIndex: position });
        }
        else {
            this.setState({ showPrimary: false, selectedPhotoIndex: position });
        }
    }

    private closeModal(){
        this.setState({ selectedPhotoIndex: undefined, showPrimary: false });
    }

    private setPrimaryPhoto(){
        const { images, selectedPhotoIndex } = this.state;
        if(selectedPhotoIndex !== undefined){
            for(let i = 0; i < images.length; i++){
                const image = images[i];
                if(selectedPhotoIndex === i){
                    image.primary = true;
                }
                else {
                    image.primary = false;
                }
            }
            this.setState({ images, selectedPhotoIndex: undefined, showPrimary: false });
        }
    }

    private onSelectPhoto(index: number){
        const { images, showPrimary } = this.state;
        (this.props as any).navigation.navigate('ViewPhotos', { images, showPrimary, selectedPhotoIndex: index, setPrimaryPhoto: this.setPrimaryPhoto() })
    }

    private onRemovePhoto(index: number){
        let { images, newImages } = this.state;
        images = images.slice();
        if(images && newImages){
            if(images[index].primary && images[index - 1]){
                images[index - 1].primary = true;
            }
            else if(images[index].primary && images[index + 1]){
                images[index + 1].primary = true;
            }
            images.splice(index, 1);
            newImages.splice(index, 1);
            this.setState({ images: images.slice(), newImages: newImages.slice() });
        }
    }

    private onHandleChoosePhoto(){
        const languageContent = setPhotoLanguage[this.props.spokenLanguage as any];
        ImagePicker.openPicker({ 
            mediaType: 'photo',
            width: 400,
            height: 600,
            cropping: true
        }).then((value: any) => {
            let images = this.state.images.slice();
            if(this.state.images.length === 0){
                value.primary = true;
            }
            else {
                value.primary = false;
            }
            images.push(value);
            if(images.length >= 6){
                const error = languageContent.maxPhotos;
                this.setState({ error });
            }
            else {
                let newImages= [];
                if(images){
                    for(let i = 0; i < images.length; i++){
                        const image = images[i];
                        newImages.push({ uri: image.path })
                    }
                }
                this.setState({ images, newImages, error: undefined });
            }
        });
    }

    private onFinishClick(){
        const { onUpdateImages, spokenLanguage } = this.props;
        const { images } = this.state;
        const languageContent = setPhotoLanguage[spokenLanguage as any];
        
        if(images.length > 0){
            if(onUpdateImages){
                onUpdateImages(images, (this.props as any).navigation, this.state.firstTimeLogin );
            }
        }
        else {
            const error = languageContent.minPhotos;
            this.setState({ error });
        }
    }
};

const styles = StyleSheet.create({
    viewStyleLoading: {
        flex: 1,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    primaryImageTextStyle: {
        textAlign: 'center',
        color: 'white',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderColor: 'white'
    },
    transparentButtonStyle: {
        color: '#007aff'
    },
    errorStyle: {
        color: '#007aff',
        fontSize: 18,
        textAlign: 'center'
    },
    buttonStyle: {
        backgroundColor: '#007aff',
        borderRadius: 5
    },
    containerStyle: {
        flex: 1,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 20
    },
    titleWrapperStyle: {
        marginTop: 20
    },
    titleStyle: {
        textAlign: 'center',
        fontSize: 24,
        color: '#007aff',
        fontWeight: '700'
    },
    flatListWrapperStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    flatListStyle: {
        width: '100%',
        flex: 0
    },
    itemActiveStyle: {
        borderRadius: 5,
        textAlign: 'center',
        padding: 5,
        borderWidth: 1,
        borderColor: '#007aff',
        color: '#007aff'
    },
    itemStyle: {
        borderWidth: 1,
        borderColor: 'transparent',
        padding: 5,
        textAlign: 'center'
    }
});


const mapStateToProps = (state: any) => {
    const { accountSettings, global } = state;
    const { name, images, spokenLanguage } = accountSettings;
    const { loading } = global;

    return {
        images,
        spokenLanguage,
        name,
        loading
    };
};
  
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        onUpdateName: bindActionCreators(
            accountSettingsActions.onUpdateName,
            dispatch
        ),
        onUpdateImages: bindActionCreators(
            accountSettingsActions.onUpdateImages,
            dispatch
        ),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetPhoto);
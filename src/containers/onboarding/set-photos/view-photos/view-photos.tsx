
import React from 'react';

import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Container, View, Text, Button, Icon } from 'native-base';

import { StyleSheet, StatusBar } from 'react-native';

import GallerySwiper from "react-native-gallery-swiper";

import { BackButton } from '../../../../components';

import { accountSettingsActions } from '../../../../actions';

import { setPhotoLanguage } from '../languages';

interface IViewPhotoProps {
    spokenLanguage: string;
    onSetPrimaryPhoto: (images: Array<any>, index: number, navigation: any) => void;
}

interface IViewPhotoState {
    showPrimary: boolean;
    images: Array<any>;
    newImages: Array<any>;
    selectedPhotoIndex: number;
}

class ViewPhotos extends React.Component<IViewPhotoProps, IViewPhotoState> {

    private deckSwiperRef: any;

    constructor(props: IViewPhotoProps) {
        super(props);

        this.onPageScroll = this.onPageScroll.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        this.setPrimaryPhoto = this.setPrimaryPhoto.bind(this);

        let images = (this.props as any).navigation.getParam('images');
        const showPrimary = (this.props as any).navigation.getParam('showPrimary');
        const selectedPhotoIndex = (this.props as any).navigation.getParam('selectedPhotoIndex');

        (this.props as any).navigation.setParams({
            setPrimaryPhoto: () => this.setPrimaryPhoto()
        });

        let newImages= [];

        if(images){
            images = images.slice();
            for(let i = 0; i < images.length; i++){
                const image = images[i];
                newImages.push({ uri: image.path })
            }
        }

        this.state = {
            images,
            newImages,
            showPrimary,
            selectedPhotoIndex
        }
    }

    static navigationOptions = ({ navigation }: any) => {
        const navigationParams = navigation.state.params;
        const { spokenLanguage, setPrimaryPhoto } = navigationParams;
        const languageContent = setPhotoLanguage[spokenLanguage];

        return {
            headerStyle: {
                backgroundColor: '#007aff'
            },
            headerRight: 
                <Button transparent onPress={() => setPrimaryPhoto()}> 
                    <Text style={{ color: 'white', fontSize: 12, marginRight: 10 }}>
                        { languageContent.setAsPrimaryPhoto } 
                    </Text>
                </Button> 
            ,
            headerLeft: 
            <BackButton 
                onPress={() => {
                    navigation.pop() 
                }}
                title={languageContent.photos} 
            />,
        };
    };

    public render() {
        const { containerStyle, primaryImageTextStyle } = styles;
        const { pop } = (this.props as any).navigation;
        const { spokenLanguage } = this.props;
        const { showPrimary, newImages, selectedPhotoIndex } = this.state;
        const languageContent = setPhotoLanguage[spokenLanguage as any];
        return (
            <Container style={containerStyle}>
                <StatusBar barStyle="light-content" hidden={false} translucent={false} backgroundColor={"#007aff"} />
                <View style={{ height: '90%', position: 'relative', marginTop: 3, marginRight: 5, marginLeft: 5 }}>
                    <GallerySwiper 
                        images={newImages}
                        resizeMode='cover'
                        initialPage={selectedPhotoIndex}
                        ref={this.deckSwiperRef}
                        onPageScroll={this.onPageScroll}
                        sensitiveScroll={false}
                        resistantStrVertical={0}
                        pageMargin={5}
                        removeClippedSubviews={false}
                        // onSingleTapConfirmed={(index: number) => this.deckSwiperRef.current.currentPage === (newImages.length - 1) ? this.deckSwiperRef.current.scrollToPage({ index: 0, immediate: true }) : this.deckSwiperRef.current.scrollToPage({ index: index + 1, immediate: true })}
                        style={{ borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 3, backgroundColor: 'black' }}
                    />
                    {showPrimary &&
                        <View style={{ elevation: 3, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                            <Text style={primaryImageTextStyle}> { languageContent.primaryPhoto }  </Text>
                        </View>
                    }
                </View>
            </Container>
        );
    }

    private onCloseModal(){
        (this.props as any).navigation.pop();
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

    private setPrimaryPhoto(){
        const { images } = this.state;
        this.props.onSetPrimaryPhoto(images, this.state.selectedPhotoIndex, (this.props as any).navigation);
    }
};

const styles = StyleSheet.create({
    primaryImageTextStyle: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        paddingHorizontal: 10,
        paddingVertical: 10,
        textTransform: 'uppercase'
    },
    transparentButtonStyle: {
        color: '#007aff'
    },
    errorStyle: {
        position: 'absolute',
        alignSelf: 'center',
        color: '#007aff',
        fontSize: 18,
        textAlign: 'center',
        bottom: 100
    },
    buttonStyle: {
        backgroundColor: '#007aff',
        borderRadius: 5
    },
    containerStyle: {
        flex: 1,
        // justifyContent: 'space-between',
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
        fontSize: 20,
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
    const { accountSettings} = state;
    const { name, images, spokenLanguage } = accountSettings;

    return {
        images,
        spokenLanguage,
        name
    };
};
  
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        onSetPrimaryPhoto: bindActionCreators(
            accountSettingsActions.onSetPrimaryPhoto,
            dispatch
        )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewPhotos);
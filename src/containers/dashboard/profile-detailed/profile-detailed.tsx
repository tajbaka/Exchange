import React from 'react';

import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { chatActions, reverseFormatLanguages, distance } from '../../../actions';
import { BackButton } from '../../../components/';

import { profileDetailedLanguages } from './languages';

import { StatusBar, ScrollView } from 'react-native';
import { NativeBase, Text, View, Icon } from 'native-base';
import Mixpanel from 'react-native-mixpanel';
import GallerySwiper from "react-native-gallery-swiper";

export interface IProfileDetailedProps extends NativeBase.Container {
    userUid: string;
    spokenLanguage: string;
    learningLanguage: string;
    coords?: any;
}

interface IProfileDetailedState {
    images: any;
    loading: boolean;
    distanceAway?: number;
}

class ProfileDetailed extends React.Component<IProfileDetailedProps, IProfileDetailedState> {

    private deckSwiperRef: any;

    constructor(props: IProfileDetailedProps){
        super(props);
        this.deckSwiperRef = React.createRef();
        this.setViewHeight = this.setViewHeight.bind(this);
        this.onSwipe = this.onSwipe.bind(this);

        const { spokenLanguage, coords } = this.props;

        (this.props as any).navigation.setParams({
            spokenLanguage
        });

        const params = (this.props as any).navigation.state.params;
        let images = [];
        let newImages= [];
        
        if(params.otherUsersSettings.images){
            images = params.otherUsersSettings.images.slice();
            for(let i = 0; i < images.length; i++){
                const image = images[i];
                if(image.primary){
                    newImages.unshift({ uri: image.path })
                }
                else {
                    newImages.push({ uri: image.path })
                }
            }
        }

        let distanceAway;
        const otherUsersSettings = params.otherUsersSettings;

        if(coords && otherUsersSettings.coords){
            const { latitude, longitude } = coords;
            distanceAway = Math.round(distance(latitude, longitude, otherUsersSettings.coords.latitude, otherUsersSettings.coords.longitude, 'K'));
        }

        this.state = {
            images: newImages,
            loading: true,
            distanceAway
        }
    }

    static navigationOptions = ({ navigation }: any) => {
        const navigationParams = navigation.state.params;
        const { title } = navigationParams;

        return {
            headerStyle: {
                backgroundColor: '#007aff'
            },
            headerRight: null,
            headerLeft: 
            <BackButton 
                onPress={() => {
                    navigation.pop()
                }}
                title={title} 
            />,
        };
    };

    public componentDidMount(){
        Mixpanel.trackWithProperties("Looking at a Profile", { userUid: this.props.userUid });
    }

    public render() {
        const { spokenLanguage  } = this.props;
        let { images, loading, distanceAway } = this.state;
        const params = (this.props as any).navigation.state.params;
        const otherUsersSettings = params.otherUsersSettings;
        const { about, coords } = otherUsersSettings;
        const languageContent = profileDetailedLanguages[spokenLanguage];

        return (
            <View style={{ flex: 1, position: 'relative' }} onLayout={this.setViewHeight}>
                <StatusBar barStyle="light-content" hidden={false} translucent={false} backgroundColor={"#007aff"} />
                <View style={{ height: '65%', position: 'relative', marginHorizontal: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2 }}>
                    {images.length > 0 && !loading ?
                        <GallerySwiper
                            images={images}
                            resizeMode='contain'
                            sensitiveScroll={true}
                            ref={this.deckSwiperRef}
                            resistantStrVertical={0}
                            style={{ overflow: 'hidden', elevation: 3, borderRadius: 20, marginVertical: 2, backgroundColor: 'black', zIndex: 1 }}
                        />
                    :
                        <View style={{ backgroundColor: '#82beff', borderRadius: 20, marginVertical: 5, height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name='ios-happy' style={{ color: 'white', fontSize: 200 }} />
                        </View>
                    }
                </View>
                <View style={{ marginHorizontal: 10, paddingHorizontal: 5, paddingBottom: 10, borderBottomWidth: 1, borderColor: 'rgba(0,0,0, 0.15)', borderRadius: 10 }}>
                    <Text style={{ color: '#007aff', fontSize: 26, fontWeight: 'bold', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        { params.title }
                    </Text>
                    {coords && coords.city &&
                        <View style={{ paddingTop: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 14, color: '#007aff', fontWeight: 'bold', opacity: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                { languageContent.livesIn } { coords.city }, { coords.country }
                            </Text>
                            <Text style={{ fontSize: 14, color: '#007aff', fontWeight: 'bold', opacity: 0.7 }}>
                                {' '}{ distanceAway } km { languageContent.away }
                            </Text>
                        </View>
                    }
                </View>
                <View style={{ flexDirection: 'row',  alignItems: 'center', paddingHorizontal: 5, justifyContent: 'space-between', paddingVertical: 5, zIndex: 1000 }}>
                    <View style={{ borderRadius: 20, justifyContent: 'center', borderColor: 'rgba(0,122,255, 0.7)', opacity: 0.75, height: 35, marginRight: 10 }}>
                        <Text style={{ color: 'rgba(0,0,0,.7)', fontSize: 14, fontWeight: '600', paddingHorizontal: 10 }}>
                            {languageContent.speaks}
                            {reverseFormatLanguages(otherUsersSettings.spokenLanguage, spokenLanguage)}
                        </Text>
                    </View>
                    <View style={{ borderRadius: 20, justifyContent: 'center', borderColor: 'rgba(0,122,255, 0.7)', opacity: 0.75, height: 35 }}>
                        <Text style={{ color: 'rgba(0,0,0,.7)', fontSize: 14, fontWeight: '600', paddingHorizontal: 10 }}>
                            {languageContent.wantsToLearn}
                            {reverseFormatLanguages(otherUsersSettings.learningLanguage, spokenLanguage)}
                        </Text>
                    </View>
                </View>
                {about !== undefined && about.length > 0 &&
                    <ScrollView style={{ marginHorizontal: 15, borderColor: 'rgba(0,0,0,0.1)', padding: 5, marginBottom: 10, borderWidth: 1, borderRadius: 5, flex: 1 }}>
                        <Text style={{ fontSize: 13, color: 'rgba(0,0,0,0.75)' }}>
                            { about }
                        </Text>
                    </ScrollView>
                }
            </View>
        );
    }

    private onSwipe(index: number){
        let { images} = this.state;
        this.deckSwiperRef.current.currentPage === (images.length - 1) ? this.deckSwiperRef.current.scrollToPage({ index: 0, immediate: true }) : this.deckSwiperRef.current.scrollToPage({ index: index + 1, immediate: true });
    }

    private setViewHeight(event: any){
        setTimeout(() => {
            this.setState({ loading: false })
        }, 50);
        // const windowHeight = event.nativeEvent.layout.height;
        // const height = windowHeight * 0.8;
        // this.setState({ windowHeight, height })
    }
};

const mapStateToProps = (state: any) => {
    const { accountSettings, auth } = state;
    const { spokenLanguage, learningLanguage, coords } = accountSettings;
    const { userUid } = auth;

    return {
        coords,
        spokenLanguage, 
        learningLanguage,
        userUid
    };
};
  
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        onFindChat: bindActionCreators(
            chatActions.onFindChat,
            dispatch
        )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDetailed);
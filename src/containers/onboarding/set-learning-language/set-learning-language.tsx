import React from 'react';

import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { StyleSheet, FlatList } from 'react-native';

import { IAccountSettingsProps } from "../../account-settings";

import { accountSettingsActions } from '../../../actions';

import { Container, View, Text, Icon, Button } from 'native-base';

import { setLearningLanguages } from './languages';

interface ISetLearningLanguageState {
    loading?: boolean;
    options: any;
    learningLanguage: string | null;
}

class SetLearningLanguage extends React.Component<IAccountSettingsProps, ISetLearningLanguageState> {

    constructor(props: IAccountSettingsProps) {
        super(props);
        this.onPressItem = this.onPressItem.bind(this);
        this.onNextClick = this.onNextClick.bind(this);

        const { spokenLanguage } = this.props;
        const languageContent = setLearningLanguages[spokenLanguage as any];

        const options = [
            { 
                title : languageContent.spanish,
                translate: 'es'
            },
            { 
                title : languageContent.english,
                translate: 'en'
            },
            { 
                title : languageContent.none,
                translate: 'none'
            }
        ];

        for(let i = 0; i < options.length; i++){
            if(spokenLanguage === options[i].translate){
                options.splice(i, 1)
            }
        }

        this.state = {
            options,
            learningLanguage: options[0].translate ? options[0].translate : null
        }
    }

    static navigationOptions = {
        header: null,
    };

    public render() {
        const { containerStyle, buttonStyle, viewStyleLoading, titleWrapperStyle, itemActiveStyle, flatListStyle, itemStyle, flatListWrapperStyle, footerStyle, titleStyle } = styles;
        const { options, learningLanguage } = this.state;
        const { loading } = this.props;
        let { spokenLanguage } = this.props; 
        const navigation = (this.props as any).navigation;
        const { pop } = navigation;

        if(spokenLanguage === 'none') {
            spokenLanguage = 'es'
        }

        const languageContent = setLearningLanguages[spokenLanguage as any];

        return (
            <Container style={containerStyle}>
                {loading &&
                    <View style={viewStyleLoading} />
                }
                <View style={titleWrapperStyle}>
                    <Text style={titleStyle}> { languageContent.whatLanguageDoYouWantToLearn } </Text>
                </View>
                <View style={flatListWrapperStyle}>
                    <FlatList 
                        style={[flatListStyle, { maxHeight: (options.length + 1) * 25 }]}
                        keyExtractor={(item: any) => item.id}
                        data={options}
                        renderItem={({ item, index }: any) => 
                            <React.Fragment>
                                <Text style={[item.translate === learningLanguage ? itemActiveStyle : itemStyle]} onPress={() => this.onPressItem(index)}> { item.title } </Text>
                            </React.Fragment>
                        }
                    />
                </View>
                <View style={footerStyle}>
                    <Button onPress={() => pop()} transparent >
                        <Icon style={{ color: '#007aff', marginLeft: 0, marginRight: 0 }} name={'ios-arrow-back'} />
                        <Text style={{ color: '#007aff' }}> { languageContent.back } </Text>
                    </Button>
                    <Button onPress={this.onNextClick} style={buttonStyle}>
                        <Text> { languageContent.next } </Text>
                    </Button>
                </View>
            </Container>
        );
    }

    private onPressItem(index: any){
        const { options } = this.state;
        this.setState({ learningLanguage: options[index].translate });
    }

    private onNextClick(){
        const { onUpdateLearningLanguage } = this.props;
        if(onUpdateLearningLanguage){
            onUpdateLearningLanguage(this.state.learningLanguage, (this.props as any).navigation);
        }
    }
};

const styles = StyleSheet.create({
    viewStyleLoading: {
        flex: 1,
        opacity: 0.5,
        backgroundColor: 'white',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1
    },
    transparentButtonStyle: {
        color: '#007aff'
    },
    buttonStyle: {
        backgroundColor: '#007aff',
        borderRadius: 5
    },
    containerStyle: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 40,
        paddingBottom: 20,
    },
    footerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    titleWrapperStyle: {
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
    const { spokenLanguage, learningLanguage } = accountSettings;
    const { loading } = global;

    return {
      spokenLanguage,
      learningLanguage,
      loading
    };
};
  
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        onUpdateLearningLanguage: bindActionCreators(
            accountSettingsActions.onUpdateLearningLanguage,
            dispatch
        ),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetLearningLanguage);
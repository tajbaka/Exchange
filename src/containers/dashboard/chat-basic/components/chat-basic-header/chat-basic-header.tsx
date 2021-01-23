import React from 'react';

import {
    StyleSheet
  } from 'react-native';

import { chatBasicHeaderLanguages } from './languages'

import { NativeBase, Tabs, Tab } from 'native-base';

interface IChatBasicHeaderProps extends NativeBase.Container {
    firstTabElement: any;
    secondTabElement: any;
    thirdTabElement: any;
    spokenLanguage: string;
    tab: number;
    onChangeTab?: (event: any) => void;
}

export const ChatBasicHeader: React.SFC<IChatBasicHeaderProps> = props => {
    const { tabStyle, textStyle, activeTextStyle, activeTabStyle } = styles;
    const { spokenLanguage, firstTabElement, secondTabElement, thirdTabElement, onChangeTab, tab } = props;
    const languageContent = chatBasicHeaderLanguages[spokenLanguage];

    return (
        <Tabs locked={true}  page={tab} onChangeTab={onChangeTab} scrollWithoutAnimation={false} tabContainerStyle={{ paddingLeft: '15%', backgroundColor: 'white', borderBottomWidth: 0, elevation: 0 }} tabBarUnderlineStyle={{ opacity: 0 }} tabBarActiveTextColor='#007aff'>
            {firstTabElement &&
                <Tab heading={languageContent.firstHeading.toLocaleUpperCase()} tabStyle={tabStyle} activeTabStyle={activeTabStyle} activeTextStyle={activeTextStyle} textStyle={textStyle}>
                    { firstTabElement }
                </Tab>
            }
            {secondTabElement && 
                <Tab heading={languageContent.secondHeading.toLocaleUpperCase()} tabStyle={tabStyle} activeTabStyle={activeTabStyle} activeTextStyle={activeTextStyle} textStyle={textStyle}>
                    { secondTabElement }
                </Tab>
            }
            {thirdTabElement &&
                <Tab heading={languageContent.thirdHeading.toLocaleUpperCase()} tabStyle={tabStyle} activeTabStyle={activeTabStyle} activeTextStyle={activeTextStyle} textStyle={textStyle}>
                    { thirdTabElement }
                </Tab>
            }
        </Tabs>
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
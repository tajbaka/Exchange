import React from 'react';

import {
    Image,
    Animated,
    StyleSheet
  } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import { Button, Icon, Text,  NativeBase, View } from 'native-base';

interface IConnectProps extends NativeBase.Button {
    screenHeight: any;
    pulseAnim: any;
    ringFirstAnim: any;
    opacityAnim: any;
    buttonDropAnim: any;
    errorValue?: any;
    connect?: boolean;
    languageContent: any;
    onConnectButtonPress: () => void;
    onStopConnectButtonPress: () => void;
}

export const Connect: React.SFC<IConnectProps> = props => {
    const { connectStyle, connectButtonStyle } = styles;
    const { screenHeight, pulseAnim, ringFirstAnim, languageContent, connect, errorValue, opacityAnim, buttonDropAnim, onConnectButtonPress, onStopConnectButtonPress } = props;

    return (
        <LinearGradient colors={['white', '#8dc2ff', '#007aff']} style={connectStyle}>
            <Animated.View style={{ 
                position: 'absolute', 
                justifyContent: 'center', 
                alignItems: 'center',
                opacity: opacityAnim,
                transform: [
                    {
                        scaleX: ringFirstAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 3]
                        })
                    },
                    {
                        scaleY: ringFirstAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 3]
                        })
                    },
                    {
                        translateY: buttonDropAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-110, 0]
                        })
                    },
                    {
                        scaleX: buttonDropAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.75]
                        })
                    },
                    {
                        scaleY: buttonDropAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.75]
                        })
                    }
                ]
            }}>
            <View style={{ height: screenHeight/3.5, width: screenHeight/3.5, backgroundColor: '#2a91ff', borderRadius: screenHeight/7 }} />
            </Animated.View>
            <Animated.View style={{ 
                position: 'absolute', 
                justifyContent: 'center', 
                alignItems: 'center',
                opacity: opacityAnim,
                transform: [
                    {
                        scaleX: ringFirstAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 2]
                        })
                    },
                    {
                        scaleY: ringFirstAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 2]
                        }),
                    },
                    {
                        translateY: buttonDropAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-110, 0]
                        })
                    },
                    {
                        scaleX: buttonDropAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.75]
                        })
                    },
                    {
                        scaleY: buttonDropAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.75]
                        })
                    }
                ]
            }}>
            <View style={{ height: screenHeight/3.5, width: screenHeight/3.5, backgroundColor: '#2a91ff', borderRadius: screenHeight/7 }} />
            </Animated.View>
            <Animated.View style={{ 
                position: 'absolute', 
                justifyContent: 'center', 
                alignItems: 'center',
                opacity: opacityAnim,
                transform: [
                    {
                        scaleX: ringFirstAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.5]
                        })
                    },
                    {
                        scaleY: ringFirstAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.5]
                        })
                    },
                    {
                        translateY: buttonDropAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-110, 0]
                        })
                    },
                    {
                        scaleX: buttonDropAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.75]
                        })
                    },
                    {
                        scaleY: buttonDropAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0.75]
                        })
                    }
                    
                ]
            }}>
                <View style={{ height: screenHeight/3.5, width: screenHeight/3.5, backgroundColor: '#2a91ff', borderRadius: screenHeight/7 }} />
            </Animated.View>
            <Animated.View 
                style={{ 
                    height: screenHeight/3.5, 
                    width: screenHeight/3.5, 
                    position: 'absolute',
                    transform: [
                        {
                            scaleX: pulseAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.07]
                            })
                        },
                        {
                            scaleY: pulseAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.07]
                            })
                        },
                        {
                            translateY: buttonDropAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-110, 0]
                            })
                        },
                        {
                            scaleX: buttonDropAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0.75]
                            })
                        },
                        {
                            scaleY: buttonDropAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0.75]
                            })
                        }
                    ]
                }}
            >
            <Button style={[connectButtonStyle, { height: screenHeight/3.5, width: screenHeight/3.5, borderRadius: screenHeight/7 } ]} transparent onPress={onConnectButtonPress}> 
                <View style={{ position: 'absolute', zIndex: 3, elevation: 2, borderRadius: screenHeight/12, height: screenHeight/6, width: screenHeight/6 }}>
                    <Image
                        source={require('./globe-white.png')}
                        style={{ height: screenHeight/6, width: screenHeight/6 }}
                    />
                </View>
                <View style={{ position: 'absolute', height: screenHeight/3.5, width: screenHeight/3.5, borderRadius: screenHeight/7, elevation: 2, 
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2, zIndex: 1, backgroundColor: '#2a91ff' }} />
                <View style={{ position: 'absolute', borderColor: '#2a91ff', zIndex: 1, elevation: 2, bottom: '2%', left: '23%', borderWidth: 15, transform: [{ rotate: '70deg'}] }} />
            </Button>
        </Animated.View>
            <Animated.View
                style={{
                    opacity: buttonDropAnim,
                    position: 'absolute', 
                    top: 5, 
                    right: 5
                }}
            >
                <Button transparent onPress={onStopConnectButtonPress}> 
                    <Icon name='ios-close' style={{ color: 'grey', fontSize: 30 }} /> 
                </Button>
            </Animated.View>
            <Text style={{ position: 'absolute', bottom: '30%', paddingHorizontal: 20, fontSize: 22, color: 'white', textAlign: 'center', width: '100%' }}>
                {
                    errorValue !== undefined ? languageContent.noUsers
                    :
                    (errorValue === undefined && connect) ? languageContent.connecting
                    :
                    (errorValue === undefined) && languageContent.tapToConnect
                }
            </Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    connectStyle: {
        flex: 1,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'
    },
    connectButtonStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
});
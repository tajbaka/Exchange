import React from 'react';

import {
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard
  } from 'react-native';

import { Button, Icon, Text, Title, Form, Item, Input, Container, NativeBase, View, Textarea } from 'native-base';

interface buttonProps extends NativeBase.Button {
    iconName?: string;
}

interface IGeneralFormProps extends NativeBase.Container {
    loading?: boolean;
    title?: string;
    iconName: string;
    labelProps?: NativeBase.Label;
    labelText?: string;
    errorPlaceholder?: string;
    displayText?: string;
    inputProps?: NativeBase.Input;
    leftActionButtonText?: string;
    leftActionButtonProps?: buttonProps;
    rightActionButtonText?: string;
    rightActionButtonProps?: buttonProps;
    rightButtonProps?: buttonProps;
    rightButtonText?: string;
    leftButtonProps?: buttonProps;
    leftButtonText?: string;
    textAreaProps?: NativeBase.Textarea;
}

export const GeneralForm: React.SFC<IGeneralFormProps> = props => {

    const { textAreaProps, leftActionButtonProps, loading, iconName, errorPlaceholder, leftActionButtonText, rightActionButtonProps, rightActionButtonText, leftButtonProps, leftButtonText, rightButtonProps, title, labelText, rightButtonText, labelProps, inputProps, ...remaining } = props;
    const { actionButtonWrapperStyle, viewStyle, viewStyleLoading, leftActionButtonStyle, rightActionButtonStyle, generalFormStyle, buttonWrapperStyle, itemStyle, containerStyle, titleStyle, leftButtonStyle, rightButtonStyle } = styles;

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={viewStyle} pointerEvents={loading ? 'none' : 'auto'}>
                {loading &&
                    <View style={viewStyleLoading} />
                }
                <Container { ...remaining } style={containerStyle}>
                    <View>
                        <Title style={titleStyle}> { title } </Title>
                    </View>
                    <Form style={generalFormStyle}>
                        {inputProps &&
                            <Item rounded style={itemStyle} error={errorPlaceholder !== undefined}>
                                <Icon active name={iconName} style={{ color:'#007aff' }}   />
                                <Input  {...inputProps} placeholderTextColor={errorPlaceholder ? 'red' : 'rgba(0,0,0,.7)'} placeholder={errorPlaceholder ? errorPlaceholder : labelText} />
                            </Item>
                        }

                        {textAreaProps &&
                            <Item rounded style={[{ marginLeft: 25, marginRight: 25, marginTop: 25, paddingHorizontal: 5, borderWidth: 1, borderRadius: 10, borderColor: '#007aff' }]}>
                                <Icon active name={iconName} style={{ color:'#007aff', alignSelf: 'flex-start', paddingVertical: 5, paddingRight: 0 }}   />
                                <Textarea  {...textAreaProps}  placeholder={labelText} placeholderTextColor={'rgba(0,0,0,.7)'} style={{ fontSize: 18, flex: 1 }} />
                            </Item>
                        }
                        <View style={buttonWrapperStyle}>
                            {leftButtonText ?
                                <Button {...leftButtonProps} style={[leftButtonStyle, { marginLeft: (leftButtonProps && leftButtonProps.transparent) ? 0 : 20 }]}>
                                    {leftButtonProps && leftButtonProps.iconLeft && leftButtonProps.iconName &&
                                        <Icon style={rightActionButtonProps && { color: rightActionButtonProps.transparent ? '#007aff' : rightActionButtonProps.primary && 'white' }} name={leftButtonProps.iconName} />
                                    }
                                    <Text style={rightActionButtonProps && { color: rightActionButtonProps.transparent ? '#007aff' : rightActionButtonProps.primary ? 'white' : 'black', fontSize: 12 }}> { leftButtonText } </Text>
                                    {leftButtonProps && leftButtonProps.iconRight && leftButtonProps.iconName &&
                                        <Icon style={rightActionButtonProps && { color: rightActionButtonProps.transparent ? '#007aff' : rightActionButtonProps.primary && 'white'}} name={leftButtonProps.iconName} />
                                    }
                                </Button>
                                :
                                <View />
                            }
                            {rightButtonText ?
                                <Button {...rightButtonProps} style={[rightButtonStyle, { marginRight: (rightButtonProps && rightButtonProps.transparent) ? 0 : 20 }]}>
                                {rightButtonProps && rightButtonProps.iconName && rightButtonProps.iconLeft &&
                                        <Icon style={rightActionButtonProps && { color: rightActionButtonProps.transparent ? '#007aff' : rightActionButtonProps.primary && 'white' }} name={rightButtonProps.iconName} />
                                    }
                                    <Text style={rightActionButtonProps && { color: rightActionButtonProps.transparent ? '#007aff' : rightActionButtonProps.primary ? 'white' : 'black', fontSize: 12 }}> { rightButtonText } </Text>
                                    {rightButtonProps && rightButtonProps.iconName && rightButtonProps.iconRight &&
                                        <Icon style={rightActionButtonProps && { color: rightActionButtonProps.transparent ? '#007aff' : rightActionButtonProps.primary && 'white'}} name={rightButtonProps.iconName} />
                                    }
                                </Button>
                                :
                                <View />
                            }
                        </View>
                    </Form>
                    <View style={actionButtonWrapperStyle}>
                        {leftActionButtonText ? 
                            <Button {...leftActionButtonProps} style={[leftActionButtonStyle, leftActionButtonProps && { marginRight: leftActionButtonProps.transparent ? 0 : 20} , leftActionButtonProps && leftActionButtonProps.primary && { backgroundColor: '#007aff', borderRadius: 5} ]}>
                                {leftActionButtonProps && leftActionButtonProps.iconLeft && leftActionButtonProps.iconName &&
                                    <Icon style={leftActionButtonProps && leftActionButtonProps.transparent && { color: '#007aff' }} name={leftActionButtonProps.iconName} />
                                }
                                <Text style={leftActionButtonProps && leftActionButtonProps.transparent && { color: '#007aff' }}> { leftActionButtonText } </Text>
                                {leftActionButtonProps && leftActionButtonProps.iconName && leftActionButtonProps.iconRight &&
                                    <Icon style={leftActionButtonProps && leftActionButtonProps.transparent && { color: '#007aff' }} name={leftActionButtonProps.iconName} />
                                }
                            </Button>
                            :
                            <View/>
                        }
                        {rightActionButtonText ?    
                            <Button {...rightActionButtonProps} style={[rightActionButtonStyle, rightActionButtonProps &&  { marginRight: rightActionButtonProps.transparent ? 0 : 20}, rightActionButtonProps && rightActionButtonProps.primary && { backgroundColor:  '#007aff', borderRadius: 5 }]} disabled={((inputProps && inputProps.value && inputProps.value.length > 0) || (textAreaProps)) ? false : true}>
                                {rightActionButtonProps && rightActionButtonProps.iconName && rightActionButtonProps.iconLeft &&
                                    <Icon style={rightActionButtonProps && rightActionButtonProps.transparent && { color: '#007aff' }} name={rightActionButtonProps.iconName} />
                                }
                                <Text style={rightActionButtonProps && rightActionButtonProps.transparent && { color: '#007aff' }}> {rightActionButtonText } </Text>
                                {rightActionButtonProps && rightActionButtonProps.iconName && rightActionButtonProps.iconRight &&
                                    <Icon style={rightActionButtonProps && rightActionButtonProps.transparent && { color: '#007aff' }} name={rightActionButtonProps.iconName} />
                                }
                            </Button>
                            :
                            <View/>
                        }
                    </View>
                </Container>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
    },
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
    containerStyle: {
        flex: 1,
        justifyContent: 'space-between',
        marginTop: 60,
        marginBottom: 20,
    },
    titleStyle: {
        textAlign: 'center',
        fontSize: 24,
        color: '#007aff',
        fontWeight: '700'
    },
    itemStyle: {
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 10,
        paddingVertical: 2,
        borderColor: '#007aff'
    },
    generalFormStyle: {
        margin: 0,
        justifyContent: 'center',
        flex: 1,
    },
    buttonWrapperStyle: {
        marginTop: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftButtonStyle: {
        alignSelf: 'flex-start',
        justifyContent: 'center',
    },
    rightButtonStyle: {
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    actionButtonWrapperStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    leftActionButtonStyle: {
        justifyContent: 'center',
        alignSelf: 'flex-start',
    },
    rightActionButtonStyle: {
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    rightActionButtonDisabledStyle: {
        opacity: 0.5
    }
});
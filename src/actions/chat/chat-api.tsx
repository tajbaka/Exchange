import { UPDATE_TRANSLATION_LOADING, UPDATE_PHRASES, UPDATE_CHAT_FIRST_ENTRY, UPDATE_CHAT_LIST, UPDATE_VOICE_MESSAGE_ERROR, UPDATE_TAB, UPDATE_USER_LIST, UPDATE_CONTENT, UPDATE_TRANSLATE_CONTENT, UPDATE_IS_SWITCHED, UPDATE_FOUND_LIST, UPDATE_SWIPE_INDEX } from './types';

import Mixpanel from 'react-native-mixpanel';

import { axiosInstance } from '../common';

import { UPDATE_LOADING, UPDATE_ERROR } from '../';

import Sound from 'react-native-sound';

import { Platform } from 'react-native';

export { API_KEY } from '../../../config';

import RNFetchBlob from 'rn-fetch-blob';

export const chatBasicItemClick = (ref: any) => {
    const { images, navigation, id, chatList } = ref;

    const chatItem = chatList.find((o: any) => o.id === id);

    const otherUsersImages = chatItem.otherUsersSettings.images;

    let otherUserPrimaryPhoto;
    let primaryPhoto;

    if(images){
        for(let i = 0; i < images.length; i++){
            const image = images[i];
            if(image.primary){
                primaryPhoto = image;
                break;
            }
        }
    }

    if(otherUsersImages){
        for(let i = 0; i < otherUsersImages.length; i++){
            const image = otherUsersImages[i];
            if(image.primary){
                otherUserPrimaryPhoto = image;
                break;
            }
        }
    }

    navigation.navigate('ChatDetailed', { title: chatItem.name, id: chatItem.id, typing: chatItem.typing, otherUsersSettings: chatItem.otherUsersSettings, otherUserPrimaryPhoto, primaryPhoto });
}; 

export const createMessage = (ref: any) => {
    const { dispatch, userUid, navigation, learningLanguage, spokenLanguage } = ref;
    Mixpanel.trackWithProperties("Create Message", { userUid });
    axiosInstance.post('/get-user-list', { 
        userUid, 
        spokenLanguage,
        learningLanguage
    }).then((response: any) => { 
        const users = response.data; 
        dispatch({ type: UPDATE_USER_LIST, payload: users });
        navigation.navigate('CreateMessage', { spokenLanguage });
    }).catch((err: any) => { 
        console.log(err);
    });
};

export const resetTexts = (ref: any) => {
    const { dispatch } = ref;
    dispatch({ type: UPDATE_TRANSLATE_CONTENT, payload: null });
    dispatch({ type: UPDATE_CONTENT, payload: null });
};

export const createMessageItemClick = (ref: any) => {
    const { otherUsersSettings, navigation, chatList, images } = ref;

    let chatItem;

    if(chatList !== undefined){
        chatItem = chatList.find((o: any) => o.otherUsersSettings.email === otherUsersSettings.email);
    }

    if(chatItem){
        const obj = {
            id: chatItem.id,
            navigation,
            chatList
        }
        chatBasicItemClick(obj);
    }
    else {
        const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const id = randLetter + Date.now();
        const otherUsersImages = otherUsersSettings.images;

        let otherUserPrimaryPhoto;
        let primaryPhoto;

        if(images){
            for(let i = 0; i < images.length; i++){
                const image = images[i];
                if(image.primary){
                    primaryPhoto = image;
                    break;
                }
            }
        }

        if(otherUsersImages){
            for(let i = 0; i < otherUsersImages.length; i++){
                const image = otherUsersImages[i];
                if(image.primary){
                    otherUserPrimaryPhoto = image;
                    break;
                }
            }
        }

        navigation.replace('ChatDetailed', { title: otherUsersSettings.name, id, otherUsersSettings, otherUserPrimaryPhoto, primaryPhoto });
    }
};

export const chatDetailItemClick = (ref: any) => {
    const { chatItemId, chatDetailItemId, learningLanguage, userUid, dispatch } = ref;

    if(learningLanguage !== 'none'){
        console.log(userUid,
            chatItemId, 
            chatDetailItemId, 'here1')
        dispatch({ type: UPDATE_TRANSLATION_LOADING, payload: true });
        axiosInstance.post('/chat-item-click', { 
            userUid,
            chatItemId, 
            chatDetailItemId
        }).then(() => {
            dispatch({ type: UPDATE_TRANSLATION_LOADING, payload: false });
        }).catch(() => {
            dispatch({ type: UPDATE_TRANSLATION_LOADING, payload: false });
        });
    }
};

export const stop = (ref: any) => {
    const { chatList, chatItemId, chatDetailItemId, dispatch } = ref;
    const chatItem = chatList.find((o: any) => o.id === chatItemId);
    const chatDetailItem = chatItem.detailedChatList.find((o: any) => o.id === chatDetailItemId);

    chatDetailItem.playingRecording = false;
    chatDetailItem.playingVoice = false;
    
    if(sound !== null){
        sound.stop();
        sound = null;
    }
    dispatch({ type: UPDATE_CHAT_LIST, payload: chatList.slice() });
}

let sound: any = null;
let prevChatItemId: any = null;
let prevChatDetailItemId: any = null;

export const play = (ref: any) => {
    const { chatList, chatItemId, chatDetailItemId, learningLanguage, spokenLanguage, userUid, dispatch, type } = ref;
    const chatItem = chatList.find((o: any) => o.id === chatItemId);
    const chatDetailItem = chatItem.detailedChatList.find((o: any) => o.id === chatDetailItemId);
    let language = chatDetailItem.language;
    const content = language === spokenLanguage ? chatDetailItem.translatedContent : chatDetailItem.content;
    const editedContent = language === spokenLanguage ? chatDetailItem.editedTranslatedContent : chatDetailItem.editedContent;
    language = learningLanguage;

    if(sound !== null && prevChatDetailItemId && prevChatItemId){
        stop({ chatList, chatItemId: prevChatItemId, chatDetailItemId: prevChatDetailItemId, dispatch });
    }

    if(type === 'recording'){
        chatDetailItem.playingRecording = true;
    }
    else if(type === 'voice'){
        chatDetailItem.playingVoice = true;
    }
    const voiceMessage = chatDetailItem.voiceMessage;
    dispatch({ type: UPDATE_CHAT_LIST, payload: chatList.slice() });

    (async () => {
        prevChatItemId = chatItemId;
        prevChatDetailItemId = chatDetailItemId;
        if(type === 'recording'){
            const name = userUid + '-' + chatDetailItemId + '.mp3';
            let presignedUrl: any = null;
            dispatch({ type: UPDATE_LOADING, payload: true });

            await axiosInstance.post('http://ec2-18-189-253-90.us-east-2.compute.amazonaws.com:3000/presigned-url', {
                name,
            }).then((response: any) => { 
                presignedUrl = response.data;
                if(learningLanguage !== 'none'){
                    axiosInstance.post('/text-to-speech', { 
                        userUid,
                        chatItemId,
                        chatDetailItemId,
                        content,
                        editedContent,
                        presignedUrl,
                        language
                    }).then((response: any) => {
                        const url = response.data;
                        sound = new Sound(url, Platform.OS === 'android' ? Sound.MAIN_BUNDLE: '', (error) => {
                            if (error) {
                                console.log('failed to load the sound', error);
                                dispatch({ type: UPDATE_LOADING, payload: false });
                                return;
                            }
                            if(sound !== null){
                                sound.play((success: any) => {
                                    if (success) {
                                        console.log('successfully finished playing');
                                    } else {
                                        console.log('playback failed due to audio decoding errors');
                                    }
                                    chatDetailItem.playingRecording = false;
                                    dispatch({ type: UPDATE_LOADING, payload: false });
                                    dispatch({ type: UPDATE_CHAT_LIST, payload: chatList.slice() });
                                    sound = null;
                                });
                            }
                        });
                    }).catch(() => {
                        chatDetailItem.playingRecording = false;
                        dispatch({ type: UPDATE_LOADING, payload: false });
                    });
                }
            }).catch(() => { 
                dispatch({ type: UPDATE_LOADING, payload: false });
            });
        }
        else if(type === 'voice') {
            prevChatItemId = chatItemId;
            prevChatDetailItemId = chatDetailItemId;
            sound = new Sound(voiceMessage, Platform.OS === 'android' ? Sound.MAIN_BUNDLE: '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                    dispatch({ type: UPDATE_LOADING, payload: false });
                    return;
                }
                console.log(sound, 'here')
                if(sound !== null){
                    sound.play((success: any) => {
                        if (success) {
                            console.log('successfully finished playing');
                        } else {
                            console.log('playback failed due to audio decoding errors');
                        }
                        chatDetailItem.playingVoice = false;
                        dispatch({ type: UPDATE_LOADING, payload: false });
                        dispatch({ type: UPDATE_CHAT_LIST, payload: chatList.slice() });
                        sound = null;
                    });
                }
            });
        }
    })();
};

let lock = false;

export const changeChatText = (ref: any) => {
    const { dispatch, id, content, otherUsersSettings } = ref;
    const otherUserUid = otherUsersSettings.userUid;

    if(!lock) {
        lock = true;
        axiosInstance.post('/typing-message', { 
            id,
            otherUserUid
        }).then(() => {
            setTimeout(() => {
                lock = false;
            }, 3000);
        });
    }
    dispatch({ type: UPDATE_CONTENT, payload: content });
};

export const changeTranslationChatText = (ref: any) => {
    return new Promise(function(resolve, reject) {
        const { dispatch, value, spokenLanguage, learningLanguage, loading } = ref;
        let { isSwitched } = ref;
        const format = 'text';
        const splitValue = value.trim().split(' ');

        (async () => {
            if(splitValue.length === 1 || splitValue.length === 2 || splitValue.length === 3){
                let detectionUrl = `https://translation.googleapis.com/language/translate/v2/detect?key=${API_KEY}`;
                const sendValue = value.replace(" ", "%20");
                detectionUrl += '&q=' + sendValue;
                let detectedLanguage: any;

                await axiosInstance.get(detectionUrl).then((response: any) => {
                    detectedLanguage = response.data.data.detections[0][0].language;
                }).catch((err: any) => {
                    detectedLanguage = spokenLanguage;
                });

                if(detectedLanguage === spokenLanguage){
                    isSwitched = false;
                }
                else if (detectedLanguage === learningLanguage){ 
                    isSwitched = true;
                }
                dispatch({ type: UPDATE_IS_SWITCHED, payload: isSwitched });
            }

            let url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
            url += '&q=' + encodeURI(value);

            if(isSwitched){
                url += `&source=${learningLanguage}`;
                url += `&target=${spokenLanguage}`;
            }
            else {
                url += `&source=${spokenLanguage}`;
                url += `&target=${learningLanguage}`;
            }
        
            url += `&format=${format}`;

            if(learningLanguage !== 'none' && !loading){
                if(value && value.length > 0){
                    axiosInstance.get(url).then((response: any) => {
                        const translatedContent = response.data.data.translations[0].translatedText;
                        if(!loading){
                            dispatch({ type: UPDATE_TRANSLATE_CONTENT, payload: translatedContent });
                        }
                        resolve(translatedContent);
                    })
                    .catch((error:any) => {
                        reject(error)
                    });
                }
                else {
                    dispatch({ type: UPDATE_TRANSLATE_CONTENT, payload: null });
                    resolve();
                }
            }
        })();
    });
};

export const sendMessage = (ref: any) => {
    const { dispatch, userUid, id, otherUsersSettings, firstMessage } = ref;
    let { content } = ref;
    let sendMessage = true;

    if(content !== null){
        content = content.replace(/\s+/g,' ').trim();
    }

    if(content.length === 0){
        sendMessage = false;
    }

    const otherUserUid = otherUsersSettings.userUid;

    dispatch({ type: UPDATE_TRANSLATE_CONTENT, payload: null });
    dispatch({ type: UPDATE_CONTENT, payload: '' });

    if(sendMessage) {
        dispatch({ type: UPDATE_LOADING, payload: true });
        if(firstMessage){
            Mixpanel.trackWithProperties("Chat First Entry", { userUid });
            dispatch({ type: UPDATE_CHAT_FIRST_ENTRY, payload: false });
        }
        axiosInstance.post('/send-message', { 
            userUid,
            content,
            id,
            otherUserUid
        }).then(() => {
            dispatch({ type: UPDATE_LOADING, payload: false });
        }).catch((err: any) => {
            dispatch({ type: UPDATE_LOADING, payload: false });
        });
    }
};

export const pressPhrase = (ref: any) => {
    const { dispatch, phrase, spokenLanguage, learningLanguage, userUid } = ref;
    Mixpanel.trackWithProperties("Press Phrase", { userUid });

    dispatch({ type: UPDATE_TRANSLATE_CONTENT, payload: phrase[learningLanguage] });
    dispatch({ type: UPDATE_CONTENT, payload: phrase[spokenLanguage] });
};

export const switchContent = (ref: any) => {
    const { dispatch, translatedContent, content, isSwitched, userUid } = ref;
    Mixpanel.trackWithProperties("Content Switched", { userUid });
    dispatch({ type: UPDATE_TRANSLATE_CONTENT, payload: content });
    dispatch({ type: UPDATE_CONTENT, payload: translatedContent });
    dispatch({ type: UPDATE_IS_SWITCHED, payload: !isSwitched });
};

export const editMessage = (ref: any) => {
    const { dispatch, chatItemId, chatDetailItemId, chatList, spokenLanguage, learningLanguage } = ref;
    const chatItem = chatList.find((o: any) => o.id === chatItemId);
    const chatDetailItem = chatItem.detailedChatList.find((o: any) => o.id === chatDetailItemId);
    const { language, content, translatedContent, editedContent, editedTranslatedContent } = chatDetailItem;

    if(language === spokenLanguage){
        if(editedContent && editedTranslatedContent){
            dispatch({ type: UPDATE_TRANSLATE_CONTENT, payload: editedTranslatedContent });
            dispatch({ type: UPDATE_CONTENT, payload: editedContent });
        }
        else {
            dispatch({ type: UPDATE_TRANSLATE_CONTENT, payload: translatedContent });
            dispatch({ type: UPDATE_CONTENT, payload: content });
        }
    }
    else if(language === learningLanguage){
        if(editedContent && editedTranslatedContent){
            dispatch({ type: UPDATE_TRANSLATE_CONTENT, payload: editedContent });
            dispatch({ type: UPDATE_CONTENT, payload: editedTranslatedContent });
        }
        else {
            dispatch({ type: UPDATE_TRANSLATE_CONTENT, payload: content });
            dispatch({ type: UPDATE_CONTENT, payload: translatedContent });
        }
    }
};

export const finishEditMessage = (ref: any) => {
    const { dispatch, chatItemId, chatDetailItemId, userUid, otherUsersSettings, content, translatedContent } = ref;
    const otherUserUid = otherUsersSettings.userUid;

    dispatch({ type: UPDATE_LOADING, payload: true });
    
    axiosInstance.post('/edit-message', { 
        chatItemId,
        chatDetailItemId,
        userUid,
        otherUserUid,
        content,
    }).then(() => {
        dispatch({ type: UPDATE_TRANSLATE_CONTENT, payload: null });
        dispatch({ type: UPDATE_CONTENT, payload: null });
        dispatch({ type: UPDATE_LOADING, payload: false });
    }).catch((err: any) => {
        dispatch({ type: UPDATE_TRANSLATE_CONTENT, payload: null });
        dispatch({ type: UPDATE_CONTENT, payload: null });
        dispatch({ type: UPDATE_LOADING, payload: false });
    });
};

export const stopEditMessage = (ref: any) => {
    const { dispatch } = ref;
    dispatch({ type: UPDATE_TRANSLATE_CONTENT, payload: null });
    dispatch({ type: UPDATE_CONTENT, payload: null });
    dispatch({ type: UPDATE_IS_SWITCHED, payload: false });
};

export const changeChatUserAppState = (ref: any) => {
    const { otherUsersSettings, nextAppState, id } = ref;

    const otherUserUid = otherUsersSettings.userUid;
    let status = false;
    if(nextAppState === 'active'){
        status = true;
    }

    axiosInstance.post('/update-chat-user-state-change', { 
        status, 
        id,
        otherUserUid
    });
};

export const sendVoiceMessage = (ref: any) => {
    const { dispatch, userUid, id, otherUsersSettings, firstMessage, voiceMessagePath } = ref;
    const otherUserUid = otherUsersSettings.userUid;

    (async () => {
        const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const uniqueId = randLetter + Date.now();
        const name = uniqueId + '.m4a';
        // const name = 'test.m4a';
        const uri = voiceMessagePath.replace("file://", "");
        const Blob = RNFetchBlob.polyfill.Blob;
        const fs = RNFetchBlob.fs;
        (window as any).XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        (window as any).Blob = Blob;

        let presignedUrl: any = null;
        dispatch({ type: UPDATE_LOADING, payload: true });
        dispatch({ type: UPDATE_TRANSLATION_LOADING, payload: true });
        
        
        await axiosInstance.post('http://ec2-18-189-253-90.us-east-2.compute.amazonaws.com:3000/presigned-url', {
            name,
        }).then((response: any) => { 
            presignedUrl = response.data;
        }).catch(() => { 
            dispatch({ type: UPDATE_LOADING, payload: false });
            dispatch({ type: UPDATE_TRANSLATION_LOADING, payload: false });
        });

        let blob: any = null;

        await fs.readFile(uri, 'base64').then((data) => {
            return (Blob as any).build(data, { type: `audio/mp3;BASE64` })
        }).then((resBlob) => {
            blob = resBlob;
        }).catch((error) => {
            console.log(error)
        });

        await new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = (res)  => {
                if(xhr.status === 200){
                    resolve('done');
                }
            }
            xhr.open('PUT', presignedUrl, true);
            xhr.responseType = 'json';
            xhr.send(blob);
        });

        Mixpanel.trackWithProperties("Sent Voice Message", { userUid });

        if(firstMessage){
            Mixpanel.trackWithProperties("Chat First Entry", { userUid });
            dispatch({ type: UPDATE_CHAT_FIRST_ENTRY, payload: false });
        }

        axiosInstance.post('/send-voice-message', { 
            userUid,
            voiceMessage: presignedUrl.split("?")[0],
            voiceMessageName: name,
            id,
            name,
            otherUserUid,
            uniqueId
        }).then((respond: any) => {
            const { data } = respond;
            if(data === 'error'){
                dispatch({ type: UPDATE_VOICE_MESSAGE_ERROR, payload: true });
                setTimeout(() => {
                    dispatch({ type: UPDATE_VOICE_MESSAGE_ERROR, payload: false });
                }, 100);
            }
            else {
                dispatch({ type: UPDATE_VOICE_MESSAGE_ERROR, payload: false });
            }
            dispatch({ type: UPDATE_TRANSLATION_LOADING, payload: false });
            dispatch({ type: UPDATE_LOADING, payload: false });
        }).catch((err: any) => {
            dispatch({ type: UPDATE_TRANSLATION_LOADING, payload: false });
            dispatch({ type: UPDATE_LOADING, payload: false });
        });
    })();
};

export const nextChat = (ref: any) => {
    const { dispatch, foundList, images, navigation } = ref;
    let { swipeIndex } = ref;
    swipeIndex++;
    if(swipeIndex >= foundList.length){
        // axiosInstance.post('/next-chat', { 
        //     userUid,
        //     otherUserUid
        // }).then(() => {
        //     dispatch({ type: UPDATE_ERROR, payload: 'noUsers' });
        //     setTimeout(() => {
        //         dispatch({ type: UPDATE_ERROR, payload: undefined });
        //     }, 2500);
            navigation.navigate('ChatBasic', { startSearch: false });
        // });
    }
    else {
        // axiosInstance.post('/next-chat', { 
        //     userUid,
        //     otherUserUid
        // }).then(() => {
            const otherUsersSettings = foundList[swipeIndex];
            if(otherUsersSettings){
                const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                const id = randLetter + Date.now();
                const otherUsersImages = otherUsersSettings.images;

                let otherUserPrimaryPhoto;
                let primaryPhoto;

                if(images){
                    for(let i = 0; i < images.length; i++){
                        const image = images[i];
                        if(image.primary){
                            primaryPhoto = image;
                            break;
                        }
                    }
                }

                if(otherUsersImages){
                    for(let i = 0; i < otherUsersImages.length; i++){
                        const image = otherUsersImages[i];
                        if(image.primary){
                            otherUserPrimaryPhoto = image;
                            break;
                        }
                    }
                }
                
                navigation.replace('ChatDetailed', { title: otherUsersSettings.name, id, otherUsersSettings, setLoading: false, otherUserPrimaryPhoto, primaryPhoto, showArrows: true });
                dispatch({ type: UPDATE_SWIPE_INDEX, payload: swipeIndex });

            }
        // });
    }
};

export const backChat = (ref: any) => {
    const { dispatch, foundList, navigation, images } = ref;
    let { swipeIndex } = ref;
    swipeIndex--;
    const otherUsersSettings = foundList[swipeIndex];
        if(otherUsersSettings){
            const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            const id = randLetter + Date.now();
            const otherUsersImages = otherUsersSettings.images;

            let otherUserPrimaryPhoto;
            let primaryPhoto;

            if(images){
                for(let i = 0; i < images.length; i++){
                    const image = images[i];
                    if(image.primary){
                        primaryPhoto = image;
                        break;
                    }
                }
            }

            if(otherUsersImages){
                for(let i = 0; i < otherUsersImages.length; i++){
                    const image = otherUsersImages[i];
                    if(image.primary){
                        otherUserPrimaryPhoto = image;
                        break;
                    }
                }
            }
            dispatch({ type: UPDATE_SWIPE_INDEX, payload: swipeIndex });
            navigation.replace('ChatDetailed', { title: otherUsersSettings.name, id, otherUsersSettings, setLoading: false, otherUserPrimaryPhoto, primaryPhoto, showArrows: true });
        }
};

export const findChat = (ref: any) => {
    const { dispatch, userUid, navigation, images } = ref;
    dispatch({ type: UPDATE_LOADING, payload: true });
    Mixpanel.trackWithProperties("Finding Chat", { userUid });
    axiosInstance.post('/find-chat', { 
        userUid,
    }).then((response: any) => { 
        const foundList = response.data;
        const otherUsersSettings = foundList[0];
        if(otherUsersSettings){
            const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            const id = randLetter + Date.now();
            const otherUsersImages = otherUsersSettings.images;

            let otherUserPrimaryPhoto;
            let primaryPhoto;

            if(images){
                for(let i = 0; i < images.length; i++){
                    const image = images[i];
                    if(image.primary){
                        primaryPhoto = image;
                        break;
                    }
                }
            }

            if(otherUsersImages){
                for(let i = 0; i < otherUsersImages.length; i++){
                    const image = otherUsersImages[i];
                    if(image.primary){
                        otherUserPrimaryPhoto = image;
                        break;
                    }
                }
            }
            dispatch({ type: UPDATE_FOUND_LIST, payload: foundList });
            navigation.navigate('ChatDetailed', { title: otherUsersSettings.name, id, otherUsersSettings, setLoading: false, otherUserPrimaryPhoto, primaryPhoto, showArrows: true });
            setTimeout(() => {
                dispatch({ type: UPDATE_ERROR, payload: undefined });
            }, 1000);
        }
        else {
            dispatch({ type: UPDATE_ERROR, payload: 'noUsers' });
            setTimeout(() => {
                dispatch({ type: UPDATE_ERROR, payload: undefined });
            }, 2000);
            dispatch({ type: UPDATE_LOADING, payload: false });
        }
    }).catch((err: any) => { 
        dispatch({ type: UPDATE_LOADING, payload: false });
        console.log(err)
    })
};

export const changeTab = (ref: any) => {
    const { dispatch, tab } = ref;
    dispatch({ type: UPDATE_TAB, payload: tab });
};

export const getPhrases = (ref: any) => {
    const { dispatch, userUid } = ref;

    axiosInstance.get('/get-phrases', { 
        userUid
    }).then((res: any) => { 
        const phrases = res.data;
        dispatch({ type: UPDATE_PHRASES, payload: phrases });
    }).catch(() => { 
        dispatch({ type: UPDATE_PHRASES, payload: [] });
    });
};


export const blockUser = (ref: any) => {
    const { dispatch, userUid, otherUsersSettings } = ref;
    const otherUserUid = otherUsersSettings.userUid;
    axiosInstance.post('/block-user', { 
        userUid,
        otherUserUid
    }).then((res: any) => { 
      
    }).catch(() => { 
    });
};

export const reportUser = (ref: any) => {
    const { dispatch, userUid, otherUsersSettings, id, reason } = ref;
    const otherUserUid = otherUsersSettings.userUid;
    axiosInstance.post('/report-user', { 
        userUid,
        otherUserUid,
        id,
        reason
    }).then((res: any) => { 
        
    }).catch(() => { 
        
    });
};
import { UPDATE_JOURNAL_TRANSLATE_CONTENT, UPDATE_JOURNAL_FIRST_ENTRY, UPDATE_SELECTED_START_DATE_NOTIFIED, UPDATE_JOURNAL_ENTRY_STATEMENT, UPDATE_JOURNAL_TRANSLATION_LOADING, UPDATE_JOURNAL_CONTENT, UPDATE_IS_JOURNAL_SWITCHED, UPDATE_JOURNAL_VOICE_MESSAGE_ERROR, UPDATE_JOURNAL_LIST } from './types';

import Mixpanel from 'react-native-mixpanel';

import { axiosInstance } from '../common';

import { sameDay } from '../general-functions'

import { UPDATE_LOADING } from '../';

import Sound from 'react-native-sound';

import RNFetchBlob from 'rn-fetch-blob';

import { Platform } from 'react-native';

export { API_KEY } from '../../../config';

import moment from 'moment'; 

export const itemClick = (ref: any) => {
    const { selectedStartDate, journalListItemId, learningLanguage, userUid, dispatch } = ref;

    if(learningLanguage !== 'none'){
        dispatch({ type: UPDATE_JOURNAL_TRANSLATION_LOADING, payload: true });
        axiosInstance.post('/journal-item-click', { 
            userUid,
            selectedStartDate, 
            journalListItemId
        }).then(() => {
            dispatch({ type: UPDATE_JOURNAL_TRANSLATION_LOADING, payload: false });
        }).catch(() => {
            dispatch({ type: UPDATE_JOURNAL_TRANSLATION_LOADING, payload: false });
        });
    }
};

export const stop = (ref: any) => {
    const { journalList, selectedStartDate, journalListItemId, dispatch } = ref;
    let journalEntry = journalList.find((o: any) => sameDay(o.selectedStartDate, selectedStartDate));
    const journalListItem = journalEntry.list.find((o: any) => o.id === journalListItemId);

    journalListItem.playingRecording = false;
    journalListItem.playingVoice = false;
    
    if(sound !== null){
        sound.stop();
        sound = null;
    }
    dispatch({ type: UPDATE_JOURNAL_LIST, payload: journalList.slice() });
}

let sound: any = null;
let prevJournalListItemId: any = null;
let prevSelectedStartDate: any = null;

export const play = (ref: any) => {
    const { journalList, selectedStartDate, journalListItemId, learningLanguage, spokenLanguage, userUid, dispatch, type } = ref;
    const journalEntry = journalList.find((o: any) => sameDay(o.selectedStartDate, selectedStartDate));
    const journalListItem = journalEntry.list.find((o: any) => o.id == journalListItemId)
    let language = journalListItem.language;

    const content = language === spokenLanguage ? journalListItem.translatedContent : journalListItem.content;
    // const editedContent = language === spokenLanguage ? journalListItem.editedTranslatedContent : journalListItem.editedContent;
    language = learningLanguage;

    if(sound !== null && prevSelectedStartDate && selectedStartDate){
        stop({ journalList, selectedStartDate: prevSelectedStartDate, journalListItemId: prevJournalListItemId, dispatch });
    }

    if(type === 'recording'){
        journalListItem.playingRecording = true;
    }
    else if(type === 'voice'){
        journalListItem.playingVoice = true;
    }
    const voiceMessage = journalListItem.voiceMessage;
    dispatch({ type: UPDATE_JOURNAL_LIST, payload: journalList.slice() });

    (async () => {
        prevSelectedStartDate = selectedStartDate;
        prevJournalListItemId = journalListItemId;
        if(type === 'recording'){
            const name = userUid + '-' + prevJournalListItemId + '.mp3';
            let presignedUrl: any = null;
            dispatch({ type: UPDATE_LOADING, payload: true });

            await axiosInstance.post('http://ec2-18-189-253-90.us-east-2.compute.amazonaws.com:3000/presigned-url', {
                name,
            }).then((response: any) => { 
                presignedUrl = response.data;
                if(learningLanguage !== 'none'){
                    axiosInstance.post('/journal-text-to-speech', { 
                        userUid,
                        selectedStartDate,
                        journalListItemId,
                        content,
                        // editedContent,
                        presignedUrl,
                        language
                    }).then((response: any) => {
                        const url = response.data;
                        sound = new Sound(url, Platform.OS === 'android' ? Sound.MAIN_BUNDLE: '', (error) => {
                            if (error) {
                                console.log('failed to load the sound', error);
                                return;
                            }
                            if(sound !== null){
                                sound.play((success: any) => {
                                    if (success) {
                                        console.log('successfully finished playing');
                                    } else {
                                        console.log('playback failed due to audio decoding errors');
                                    }
                                    journalListItem.playingRecording = false;
                                    dispatch({ type: UPDATE_LOADING, payload: false });
                                    // dispatch({ type: UPDATE_CHAT_LIST, payload: journalList.slice() });
                                    sound = null;
                                });
                            }
                        });
                    }).catch(() => {
                        journalListItem.playingRecording = false;
                        dispatch({ type: UPDATE_LOADING, payload: false });
                    });
                }
            }).catch(() => { 
                dispatch({ type: UPDATE_LOADING, payload: false });
            });
        }
        else if(type === 'voice') {
            prevSelectedStartDate = selectedStartDate;
            prevJournalListItemId = journalListItemId;
            sound = new Sound(voiceMessage, Platform.OS === 'android' ? Sound.MAIN_BUNDLE: '', (error) => {
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
                            journalListItem.playingVoice = false;
                            dispatch({ type: UPDATE_LOADING, payload: false });
                            dispatch({ type: UPDATE_JOURNAL_LIST, payload: journalList.slice() });
                            sound = null;
                        });
                }
            });
        }
    })();
};

export const changeText = (ref: any) => {
    const { dispatch, content } = ref;
    dispatch({ type: UPDATE_JOURNAL_CONTENT, payload: content });
};

export const changeTranslationText = (ref: any) => {
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
                dispatch({ type: UPDATE_IS_JOURNAL_SWITCHED, payload: isSwitched });
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
                            dispatch({ type: UPDATE_JOURNAL_TRANSLATE_CONTENT, payload: translatedContent });
                        }
                        resolve(translatedContent);
                    })
                    .catch((error:any) => {
                        reject(error)
                    });
                }
                else {
                    dispatch({ type: UPDATE_JOURNAL_TRANSLATE_CONTENT, payload: null });
                    resolve();
                }
            }
        })();
    });
};

export const sendMessage = (ref: any) => {
    const { dispatch, userUid, selectedStartDate, firstMessage } = ref;
    let { content } = ref;
    let sendMessage = true;
    let date = moment().unix();

    if(content !== null){
        content = content.replace(/\s+/g,' ').trim();
    }

    if(content.length === 0){
        sendMessage = false;
    }

    dispatch({ type: UPDATE_JOURNAL_TRANSLATE_CONTENT, payload: null });
    dispatch({ type: UPDATE_JOURNAL_CONTENT, payload: '' });

    if(sendMessage) {
        dispatch({ type: UPDATE_LOADING, payload: true });
        if(firstMessage){
            Mixpanel.trackWithProperties("Journal First Entry", { userUid });
            dispatch({ type: UPDATE_JOURNAL_FIRST_ENTRY, payload: false });
        }
        axiosInstance.post('/send-journal-entry', { 
            userUid,
            content,
            selectedStartDate,
            date,
        }).then(() => {
            
            dispatch({ type: UPDATE_LOADING, payload: false });
        }).catch((err: any) => {
            dispatch({ type: UPDATE_LOADING, payload: false });
        });
    }
};

export const switchContent = (ref: any) => {
    const { dispatch, translatedContent, content, isSwitched, userUid } = ref;
    Mixpanel.trackWithProperties("Journal Content Switched", { userUid });
    dispatch({ type: UPDATE_JOURNAL_TRANSLATE_CONTENT, payload: content });
    dispatch({ type: UPDATE_JOURNAL_CONTENT, payload: translatedContent });
    dispatch({ type: UPDATE_IS_JOURNAL_SWITCHED, payload: !isSwitched });
};

export const sendVoiceMessage = (ref: any) => {
    const { dispatch, userUid, selectedStartDate, voiceMessagePath, firstMessage } = ref;

    (async () => {
        const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const uniqueId = randLetter + Date.now();
        const name = uniqueId + '.m4a';
        const uri = voiceMessagePath.replace("file://", "");
        const Blob = RNFetchBlob.polyfill.Blob;
        const fs = RNFetchBlob.fs;
        (window as any).XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        (window as any).Blob = Blob;

        let presignedUrl: any = null;
        dispatch({ type: UPDATE_LOADING, payload: true });
        dispatch({ type: UPDATE_JOURNAL_TRANSLATION_LOADING, payload: true });
        
        if(firstMessage){
            Mixpanel.trackWithProperties("Journal First Entry", { userUid });
            dispatch({ type: UPDATE_JOURNAL_FIRST_ENTRY, payload: false });
        }

        await axiosInstance.post('http://ec2-18-189-253-90.us-east-2.compute.amazonaws.com:3000/presigned-url', {
            name,
        }).then((response: any) => { 
            presignedUrl = response.data;
        }).catch(() => { 
            dispatch({ type: UPDATE_LOADING, payload: false });
            dispatch({ type: UPDATE_JOURNAL_TRANSLATION_LOADING, payload: false });
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

        Mixpanel.trackWithProperties("Sent Journal Voice Message", { userUid });

        let date = moment();
        date = date.unix();

        axiosInstance.post('/send-journal-voice-message', { 
            userUid,
            voiceMessage: presignedUrl.split("?")[0],
            voiceMessageName: name,
            date,
            selectedStartDate,
            uniqueId
        }).then((respond: any) => {
            const { data } = respond;
            if(data === 'error'){
                dispatch({ type: UPDATE_JOURNAL_VOICE_MESSAGE_ERROR, payload: true });
                setTimeout(() => {
                    dispatch({ type: UPDATE_JOURNAL_VOICE_MESSAGE_ERROR, payload: false });
                }, 100);
            }
            else {
                dispatch({ type: UPDATE_JOURNAL_VOICE_MESSAGE_ERROR, payload: false });
            }
            dispatch({ type: UPDATE_JOURNAL_TRANSLATION_LOADING, payload: false });
            dispatch({ type: UPDATE_LOADING, payload: false });
        }).catch((err: any) => {
            dispatch({ type: UPDATE_JOURNAL_TRANSLATION_LOADING, payload: false });
            dispatch({ type: UPDATE_LOADING, payload: false });
        });
    })();
};

export const dateChange = (ref: any) => {
    const { dispatch, selectedStartDate, userUid, selectedStartDateNotified, spokenLanguage } = ref;
    dispatch({ type: UPDATE_JOURNAL_TRANSLATION_LOADING, payload: true });

    if(selectedStartDateNotified !== null){
        updateSelectedStartDateNotified({ dispatch, selectedStartDateNotified: null });
    }

    axiosInstance.post('/update-journal-date', { 
        userUid,
        selectedStartDate,
        spokenLanguage
    }).then((res: any) => {
        const journalEntryStatement = res.data;
        dispatch({ type: UPDATE_JOURNAL_ENTRY_STATEMENT, payload: journalEntryStatement });
        dispatch({ type: UPDATE_JOURNAL_TRANSLATION_LOADING, payload: false });
    }).catch(() => {
        dispatch({ type: UPDATE_JOURNAL_TRANSLATION_LOADING, payload: false });
    });
};

export const updateSelectedStartDateNotified = (ref: any) => {
    const { dispatch, selectedStartDateNotified } = ref;
    dispatch({ type: UPDATE_SELECTED_START_DATE_NOTIFIED, payload: selectedStartDateNotified });
   
};
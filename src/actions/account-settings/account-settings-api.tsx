import {
    UPDATE_LOADING,
} from '../';

import { formatLanguages } from '../general-functions';

import Mixpanel from 'react-native-mixpanel';

import { axiosInstance } from '../common';

import { createAccount } from '../auth/auth-api';

import { UPDATE_ACCOUNT_SETTINGS } from './types';

import RNFetchBlob from 'rn-fetch-blob';

import messaging from '@react-native-firebase/messaging';

export const updateFCMToken = (ref: any) => {
    const { dispatch, userUid, fcmToken } = ref;
    if(fcmToken !== undefined && fcmToken !== null){
        dispatch({ type: UPDATE_LOADING, payload: true });
        axiosInstance.post('/update-fcm-token', { 
            userUid,
            fcmToken
        }).then(() => { 
            dispatch({ type: UPDATE_LOADING, payload: false });
        }).catch(() => { 
            dispatch({ type: UPDATE_LOADING, payload: false });
        });
    }
};

export const updateLocalSpokenLanguage = (ref: any) => {
    const { dispatch, accountSettings } = ref;
    let { spokenLanguage } = ref;
    spokenLanguage = formatLanguages(spokenLanguage);
    accountSettings.spokenLanguage = spokenLanguage;
    dispatch({ type: UPDATE_ACCOUNT_SETTINGS, payload: accountSettings });
};

export const updateSpokenLanguage = (ref: any) => {
    const { dispatch, oldSpokenLanguage, accountSettings, navigation, userUid } = ref;
    let { spokenLanguage } = ref;

    if(spokenLanguage !== undefined){
        spokenLanguage = formatLanguages(spokenLanguage);
        if(navigation !== undefined){
            accountSettings.spokenLanguage = spokenLanguage;
            dispatch({ type: UPDATE_ACCOUNT_SETTINGS, payload: accountSettings });
            Mixpanel.trackWithProperties("Update Spoken Language", { spokenLanguage, userUid });
            navigation.navigate('SetLearningLanguage');
        }
        else {
            dispatch({ type: UPDATE_LOADING, payload: true });
            axiosInstance.post('/update-spoken-language', { 
                userUid,
                spokenLanguage
            }).then(() => { 
                messaging().unsubscribeFromTopic('journal-' + oldSpokenLanguage);
                messaging().subscribeToTopic('journal-' + spokenLanguage);
                messaging().unsubscribeFromTopic('general-' + oldSpokenLanguage);
                messaging().subscribeToTopic('general-' + spokenLanguage);
                dispatch({ type: UPDATE_LOADING, payload: false });
            }).catch(() => { 
                dispatch({ type: UPDATE_LOADING, payload: false });
            });
        }
    }
};

export const updateLearningLanguage = (ref: any) => {
    const { dispatch, accountSettings, navigation, userUid } = ref;
    let { learningLanguage } = ref;
    if(learningLanguage !== undefined){
        learningLanguage = formatLanguages(learningLanguage);
        if(navigation !== undefined){
            accountSettings.learningLanguage = learningLanguage;
            dispatch({ type: UPDATE_ACCOUNT_SETTINGS, payload: accountSettings });
            Mixpanel.trackWithProperties("Update Learning Language", { userUid });
            navigation.navigate('SetName');
            // navigation.navigate('SetPhotos', { firstTimeLogin: true });
        }
        else {
            axiosInstance.post('/update-learning-language', { 
                userUid,
                learningLanguage
            }).then(() => { 
                dispatch({ type: UPDATE_LOADING, payload: false });
            }).catch(() => { 
                dispatch({ type: UPDATE_LOADING, payload: false });
            });
        }
    }
    
};

export const updateCoordinates = (ref: any) => {
    const { coords, userUid } = ref;
    if(coords !== undefined && userUid !== undefined){
        Mixpanel.trackWithProperties("Update Coordinates", { userUid });
        const { latitude, longitude } = coords;
        axiosInstance.get(`https://geocode.xyz/${latitude},${longitude}?geoit=json`).then((res: any) => {
            console.log(res, 'here');
            const data = res.data;
            const { country, city } = data;
            coords.country = country;
            coords.city = city;
            axiosInstance.post('/update-coordinates', { 
                coords,
                userUid
            });
        }).catch((err:any) => console.log(err));
        
    }
};

export const updateName = (ref: any) => {
    const { userUid, dispatch, name, navigation, accountSettings } = ref;
    
    if(name !== undefined && name.length > 0){
        if(navigation !== undefined){
            accountSettings.name = name;
            dispatch({ type: UPDATE_ACCOUNT_SETTINGS, payload: accountSettings });
            Mixpanel.trackWithProperties("Setting Name", { userUid });
            navigation.navigate('SetDescription');
        }
        else {
            axiosInstance.post('/update-name', { 
                userUid,
                name
            }).then(() => {
                dispatch({ type: UPDATE_LOADING, payload: false });
            }).catch(() => {
                dispatch({ type: UPDATE_LOADING, payload: false });
            });
        }
    }
};

export const updateAbout = (ref: any) => {
    const { userUid, dispatch, about, navigation, accountSettings } = ref;
    if(navigation !== undefined){
        accountSettings.about = about;
        dispatch({ type: UPDATE_ACCOUNT_SETTINGS, payload: accountSettings });
        Mixpanel.trackWithProperties("Setting About Description", { userUid });
        // navigation.navigate('SetSpokenLanguage');
        navigation.navigate('SetPhotos', { firstTimeLogin: true });
    }
    else {
        axiosInstance.post('/update-about', { 
            userUid,
            about
        }).then(() => {
            dispatch({ type: UPDATE_LOADING, payload: false });
        }).catch(() => {
            dispatch({ type: UPDATE_LOADING, payload: false });
        });
    }
};

export const updateImages = (ref: any) => {
    const { dispatch, userUid, firstTimeLogin, accountSettings, navigation, usernameValue, passwordValue, name, learningLanguage, spokenLanguage } = ref;
    let { images } = ref;

    async function getImagePaths(images: any, userUid: any) {
        for(let i = 0; i < images.length; i++){
            const image = images[i];
            if(image && image.path){
                const fileNameArr = image.path.split('/');
                const name = userUid + '-' + fileNameArr[fileNameArr.length - 1];
                const uri = image.path.replace("file://", "");
                const Blob = RNFetchBlob.polyfill.Blob;
                const fs = RNFetchBlob.fs;
                (window as any).XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
                (window as any).Blob = Blob;
                let presignedUrl: any = null;

                await axiosInstance.post('http://ec2-18-189-253-90.us-east-2.compute.amazonaws.com:3000/presigned-url', {
                    name,
                }).then((response: any) => { 
                    presignedUrl = response.data;
                }).catch(() => { 
                    dispatch({ type: UPDATE_LOADING, payload: false });
                });

                await fs.readFile(uri, 'base64').then((data) => {
                    return (Blob as any).build(data, { type: `${image.mime};BASE64` })
                }).then((blob) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('PUT', presignedUrl, true)
                    xhr.responseType = 'json';
                    xhr.send(blob);
                    image.path = presignedUrl.split("?")[0];
                }).catch((error) => {
                    console.log(error)
                });
            }
        }
        return images;
    }

    if (firstTimeLogin){
        dispatch({ type: UPDATE_LOADING, payload: true });

        (async () => {
            images = await getImagePaths(images, userUid);

            const createAccountObj = {
                dispatch, 
                usernameValue, 
                passwordValue, 
                navigation, 
                images, 
                name, 
                learningLanguage, 
                spokenLanguage
            }

            createAccount(createAccountObj);
        })();
    }
    else {
        dispatch({ type: UPDATE_LOADING, payload: true });

        (async () => {
            images = await getImagePaths(images, userUid);
            
            axiosInstance.post('/update-images', { 
                userUid,
                images
            }).then(() => {
                accountSettings.images = images;
                dispatch({ type: UPDATE_ACCOUNT_SETTINGS, payload: accountSettings });
                dispatch({ type: UPDATE_LOADING, payload: false });
                navigation.navigate('AccountSettings');
            }).catch(() => { 
                dispatch({ type: UPDATE_LOADING, payload: false });
            });
        })();
    }
};

export const setPrimaryPhoto = (ref: any) => {
    const { dispatch, index, navigation, accountSettings } = ref;
    let { images } = ref;

    images = images.slice();

    for(let i = 0; i < images.length; i++){
        images[i].primary = false;
    }
    images[index].primary = true;

    accountSettings.images = images;
    dispatch({ type: UPDATE_ACCOUNT_SETTINGS, payload: accountSettings });
    navigation.pop();
};

export const changeAppState = (ref: any) => {
    const { nextAppState, userUid } = ref;
    if(userUid !== undefined){
        let status = false;
        if(nextAppState === 'active'){
            status = true;
        }
        axiosInstance.post('/update-state-change', { 
            status, 
            userUid
        });
    }
};

export const acceptUserAgreement = (ref: any) => {
    const { userUid } = ref;

    axiosInstance.post('/accept-user-agreement', { 
        userUid
    });
};

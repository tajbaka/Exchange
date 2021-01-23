import * as moment from 'moment';
import 'moment/locale/es';

import { languages } from './languages';

export function validateEmail(email: string) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

export function validatePassword(password: string) {
  return password.length > 5;
}

export function formatLanguages(language: string){
    if(language.includes('es')){
      language = 'es'
    }
    else if(!language.includes('none')) {
      language = 'en';
    }
    return language;
}

export function reverseFormatLanguages(language: string, spokenLanguage: string){
  const languageContent = languages[spokenLanguage];

  if(language === 'es'){
      language = languageContent.spanish;
  }
  else if(language === 'en') {
    language = languageContent.english;
  }
  else {
    language = '';
  }
  return language;
}

export function convertUTCToFormattedText(dateString: string, spokenLanguage?: string) {
    let dateObj: any;
    dateObj = moment.unix(parseInt(dateString, 10));

    if(spokenLanguage === 'en' || spokenLanguage === undefined){
      return(dateObj.calendar(undefined, {
          sameDay: () => {
              return '[Today] hh:mm a';
          },
          nextDay: '[Tomorrow at ] hh:mm a',
          nextWeek: 'DD/MM/YYYY hh:mm a',
          lastDay: '[Yesterday at ] hh:mm a',
          lastWeek: 'DD/MM/YYYY hh:mm a',
          sameElse: 'DD/MM/YYYY hh:mm a'
      }));
    }
    else if(spokenLanguage === 'es'){
      dateObj.locale('es');
      return(dateObj.calendar(undefined, {
        sameDay: () => {
            return '[Hoy] hh:mm a';
        },
        nextDay: '[Mañana a las ] hh:mm a',
        nextWeek: 'DD/MM/YYYY hh:mm a',
        lastDay: '[Ayer a las ] hh:mm a',
        lastWeek: 'DD/MM/YYYY hh:mm a',
        sameElse: 'DD/MM/YYYY hh:mm a'
    }));
    }
}

export function sortList(list: Array<any>, asc?: boolean, obj?: string) {
  if (list && obj === undefined) {
    list.sort(function compare(a, b) {
      const dateA = new Date(parseInt(a.date, 10) * 1000) as any;
      const dateB = new Date(parseInt(b.date, 10) * 1000) as any;
      if (asc) {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  }
  else if(list && obj !== undefined){
    list.sort(function compare(a, b) {

      let aObj = a[obj];
      let bObj = b[obj];

      if(aObj === undefined){
        aObj = 0;
      }
      if(bObj === undefined){
        bObj = 0;
      }
      const dateA = new Date(parseInt(aObj, 10) * 1000) as any;
      const dateB = new Date(parseInt(bObj, 10) * 1000) as any;

      if (asc) {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  }
  return list;
}

export function msToTime(duration: number) {
  let seconds: any = Math.floor((duration) % 60);
  let minutes: any = Math.floor((duration / 60) % 60);

  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return minutes + ":" + seconds;
}

export function arraysMatch(arr1: any, arr2: any, compareObj: string) {

	// Check if the arrays are the same length
	if (arr1.length !== arr2.length) return false;

	// Check if all items exist and are in the same order
	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i][compareObj] !== arr2[i][compareObj]) return false;
	}

	// Otherwise, return true
	return true;

};

export function sameDay (unix1: any, unix2: any) {
  const d1 = new Date(unix1 * 1000);
  const d2 = new Date(unix2 * 1000);
  return d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();
}

export function distance(lat1: any, lon1: any, lat2: any, lon2: any, unit: any) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}
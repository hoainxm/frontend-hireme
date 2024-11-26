/** @format */

import { PageURL, ScopeKey, ScopeValue, SectionID } from '../../models/enum';
import { PermissionDeny, YOUTUBE_EMBEDDED_URL } from './constants';

import { Alert } from './popup';
import { UserProfile } from '../../app/auth/models';

export const makeClientToUnauthorize = ({ isSysAdmin }: { isSysAdmin: boolean }) => {
  localStorage.removeItem('pageTable');
  // localStorage.setItem(ScopeKey.IS_AUTHENTICATED, ScopeValue.FALSE);
  // localStorage.setItem(ScopeKey.IS_SYSTEM_ADMIN, ScopeValue.FALSE);
  sessionStorage.setItem(ScopeKey.ACCESS_TOKEN, encodeBase64(''));
  // window.location.href = isSysAdmin ? PageURL.ADMIN_LOGIN : PageURL.HOME;
};

export const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type: 'image/png' });
};

export const dateToString = (dateObject: Date | null, enableTime: boolean = true) => {
  if (!dateObject) return '';
  const month = `0${dateObject.getMonth() + 1}`.slice(-2);
  const day = `0${dateObject.getDate()}`.slice(-2);
  const year = dateObject.getFullYear();

  if (enableTime) {
    const hour = `0${dateObject.getHours()}`.slice(-2);
    const minute = `0${dateObject.getMinutes()}`.slice(-2);
    const second = `0${dateObject.getSeconds()}`.slice(-2);
    return `${month}/${day}/${year} ${hour}:${minute}:${second}`;
  }

  return `${month}/${day}/${year}`;
};

export const stringToDate = (dateString: string) => {
  const date = new Date(dateString);
  return date;
};

export const compareDate = (a: string, b: string) => {
  const aDate = new Date(a).getTime();
  const bDate = new Date(b).getTime();

  if (aDate < bDate) return -1;
  if (aDate > bDate) return 1;
  return 0;
};

export const handleErrorNoPermission = (e: any, t: any) => {
  Alert.error({ title: 'Oops!', content: t(PermissionDeny[e.response?.data.detail]) });
};

export const encodeBase64 = (data: string) => {
  return Buffer.from(data).toString('base64');
};

export const decodeBase64 = (data: string) => {
  return Buffer.from(data, 'base64').toString('ascii');
};

// export const getKeyPair = (userInfo: UserProfile) => {
//   return `${userInfo.id}${userInfo.username}${userInfo.social_token}iMRA7RRL9l`;
// };

export const copyToClipboard = (text: string) => {
  var tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
};

export const getYoutubeLink = (videoId: string) => {
  return YOUTUBE_EMBEDDED_URL + videoId;
};

export const findActiveSection = (
  allSections: Array<{
    sectionId: SectionID;
    text: string;
  }>
) => {
  const activeSection = allSections.find((s) => {
    const section = document.getElementById(s.sectionId);
    if (section) {
      const rect = section.getBoundingClientRect();
      return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
    }
    return false;
  });

  return activeSection;
};

export const splitArray = <T>(arr: Array<T>) => {
  const chunkSize = Math.ceil(arr.length / 2);
  const result: Array<Array<T>> = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
};

export const verifyUploadData = (files: FileList, listSuffix: Array<string>, size?: number): boolean => {
  for (let i = 0; i < files.length; i++) {
    const fileType: string = (files[i] as Blob).type.split('/')[1];
    if (size && files[i].size / 1024 / 1024 > size) {
      return false;
    }
    if (!listSuffix.includes(fileType)) {
      return false;
    }
  }
  return true;
};

export const configViewSetMeta = (initialScale: string, maximumScale: string) => {
  const viewport = document.querySelector('meta[name=viewport]');
  if (viewport) {
    viewport.setAttribute('content', `width=device-width, initial-scale=${initialScale} maximum-scale=${maximumScale}`);
  }
};

export const cleanNullableValueInObject = <T>(obj: T) => {
  for (let key in obj) {
    if (obj[key] === null || obj[key] === undefined || obj[key] === 0) {
      delete obj[key];
    }
  }
  return obj;
};

export const getWindowSize = () => {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
};

export const formatDurationDisplay = (duration: number) => {
  // format output - mm:ss
  let min = Math.floor(duration / 60);
  let sec = Math.ceil(duration - min * 60);
  if (sec === 60) {
    min++;
    sec = 0;
  }
  const formatted = [min, sec].map((n) => (n < 10 ? '0' + n : n)).join(':');
  return formatted;
};

export const sleep = (time = 2000) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

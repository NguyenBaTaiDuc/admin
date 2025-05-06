// src/services/apiFacebook.ts
import { useEffect } from 'react';

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

export const useFacebookSDK = () => {
  useEffect(() => {
    const scriptId = 'facebook-jssdk';
    delete window.FB;
    window.fbAsyncInit = function () {
      console.log('[FB SDK] Init bắt đầu...');
      window.FB.init({
        appId: '410801255454310',
        cookie: true,
        xfbml: true,
        version: 'v19.0', 
      });
      console.log('[FB SDK] Init thành công!');
    };

  
    if (!document.getElementById(scriptId)) {
      const js = document.createElement('script');
      js.id = scriptId;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      js.async = true;
      js.defer = true;
      document.body.appendChild(js);
    }
  }, []);
};
export const getUserPage = async (userAccessToken: string) => {
  const res = await fetch(`https://graph.facebook.com/me/accounts?access_token=${userAccessToken}`);
  const data = await res.json();
  return data.data;
};
export const getPagePosts = async (pageID: string, pageAccessToken: string)=> {
  const res = await fetch(`https://graph.facebook.com/${pageID}/posts?fields=message,permalink_url,created_time,attachments&access_token=${pageAccessToken}`);
  const data = await res.json();
  return data.data; 
}

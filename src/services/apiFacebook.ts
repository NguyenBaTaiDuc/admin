// src/services/apiFacebook.ts
import axios from 'axios';
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
export const getPagePosts = async (pageID: string, pageAccessToken: string) => {
  const res = await fetch(`https://graph.facebook.com/${pageID}/posts?fields=message,permalink_url,created_time,attachments&access_token=${pageAccessToken}`);
  const data = await res.json();
  return data.data;
}
type SchedulePostInput = {
  pageToken: string;
  pageId: string;
  message: string;
  imageUrl: string[] | null;
  scheduledTime: number; // timestamp in seconds
};

export const schedulePostFacebook = async ({
  pageToken,
  pageId,
  message,
  imageUrl,
  scheduledTime,
}: SchedulePostInput): Promise<any> => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const mindelay = 600;
    if (scheduledTime < now + mindelay) {
      throw new Error('Facebook yêu cầu bài viết phải được đặt lịch ít nhất 10 phút kể từ thời điểm hiện tại.');

    }
    let attachedMedia = null;

    // Nếu có ảnh: upload ảnh trước để lấy media_fbid
    if (Array.isArray(imageUrl) && imageUrl.length > 0) {
      const photoUploadUrl = `https://graph.facebook.com/v21.0/${pageId}/photos`;

      const photoUploadRes = await fetch(photoUploadUrl, {
        method: 'POST',
        body: new URLSearchParams({
          url: imageUrl[0],
          published: 'false',
          access_token: pageToken,
        }),
      });

      const uploadData = await photoUploadRes.json();

      if (!photoUploadRes.ok) {
        console.error('Upload ảnh lỗi:', uploadData);
        throw new Error(uploadData.error?.message || 'Lỗi khi upload ảnh');
      }

      attachedMedia = JSON.stringify([{ media_fbid: uploadData.id }]);
    }

    // Gửi bài viết lên Facebook với ảnh (nếu có)
    const postUrl = `https://graph.facebook.com/v21.0/${pageId}/feed`;

    const postParams = new URLSearchParams({
      message,
      published: 'false',
      scheduled_publish_time: scheduledTime.toString(),
      access_token: pageToken,
    });

    if (attachedMedia) {
      postParams.append('attached_media', attachedMedia);
    }

    const postRes = await fetch(postUrl, {
      method: 'POST',
      body: postParams,
    });

    const postData = await postRes.json();

    if (!postRes.ok) {
      console.error('Đăng bài lỗi:', postData);
      throw new Error(postData.error?.message || 'Lỗi khi tạo bài viết');
    }

    return postData;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Lỗi schedulePostFacebook:', err.message);
      throw err;
    } else {
      console.error('Lỗi không xác định:', err);
      throw new Error('Đã xảy ra lỗi không xác định');
    }
  }

};

export const getAllSchedulePostFacebook = async (
  pageToken: string,
  pageId: string
): Promise<any[]> => {
  try {
    const url = new URL(`https://graph.facebook.com/v21.0/${pageId}/scheduled_posts`);
    url.searchParams.set(
      'fields',
      'id,message,scheduled_publish_time,created_time,status_type,attachments{media,subattachments},full_picture'
    );
    url.searchParams.set('access_token', pageToken);

    const res = await fetch(url.toString());
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || 'Lỗi khi lấy bài viết đã đặt lịch');
    }

    return data.data || [];
  } catch (err: any) {
    console.error('Lỗi getAllSchedulePostFacebook:', err.message);
    throw err;
  }
};
export const deleteSchedulePostFacebook = async (
  postId: string,
  pageToken: string
) => {
  const response = await axios.delete(
    `https://graph.facebook.com/v21.0/${postId}`,
    {
      params: { access_token: pageToken },
    }
  );
  return response?.data;
};


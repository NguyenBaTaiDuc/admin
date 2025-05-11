
import Pop_up_Schedule from '@/components/PopUp/Pop_up_Schedule';
import { useFacebookSDK } from '@/services/apiFacebook';
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined';
import { useEffect, useState, useContext } from 'react';
import EditableTable, { FacebookPost } from '@/components/Table_Media_Management';
import SelectFacebookPage from '@/components/PopUp/SelectFacebookPage';
import { notification } from 'antd';
import { AuthContext } from '@/services/auth_context';
import { useTranslation } from 'react-i18next';

declare global {
  interface Window {
    FB: any;
  }
}
const Media_Management_page = () => {
  const { t } = useTranslation();
  //Chuyển short-live accessToken thành Long-live accessToken
  const exchangetolonglivedaccesstoken = async (shortLivedToken: string): Promise<string | null> => {
    const appID = '410801255454310';
    const appSecret = 'fc9b3139e54bf59c373e5eb937ecd499';
    const url = `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `grant_type=fb_exchange_token&` +
      `client_id=${appID}&` +
      `client_secret=${appSecret}&` +
      `fb_exchange_token=${shortLivedToken}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.access_token) {
        console.log('Long_Lived_Token', data.access_token);
        return data.access_token;
      }
      else {
        console.error('Không thẻ đỏi', data);
        return null;
      }

    }
    catch (error) {
      console.error('Lỗi khi đổi Token', error);
      return null;
    }
  }
  // hiển thị pop up nội dung bài viết trên mxh
  const [showContentModal, setShowContentModal] = useState(false);
  const [currentContent, setCurrentContent] = useState('');
  const handleViewContent = (content: string) => {
    setCurrentContent(content);
    setShowContentModal(true);
  };
  const [post, setPost] = useState<FacebookPost[]>([]);
  const { isLogin, login } = useContext(AuthContext);
  useFacebookSDK();
  const connectFacebook = () => {
    if (!window.FB) {
      alert('Facebook SDK chưa sẵn sàng.');
      return;
    }

    window.FB.login((response: any) => {
      if (response.authResponse) {
        const { accessToken } = response.authResponse;
        handleFBResponse(accessToken); // Xử lý async bên ngoài
      }
    }, {
      scope: 'public_profile,email,pages_show_list,pages_manage_posts'
    });
  };

  const handleFBResponse = async (accessToken: string) => {
    const longLivedToken = await exchangetolonglivedaccesstoken(accessToken);
    if (longLivedToken) {
      login(longLivedToken);
      localStorage.setItem('facebookAccessToken', longLivedToken);
      alert('Kết nối thành công với Facebook!');
      fetchFacebookPages(longLivedToken);
    } else {
      alert('Không thể lấy long-lived token.');
    }
  };

  const [showModel, setshowModel] = useState(false);
  const [SocialPage, setSocialPage] = useState<{ id: string, name: string, access_token: string }[]>([]);
  const [showSocialPage, setShowSocialPage] = useState(false);

  const fetchFacebookPages = async (accessToken: string) => {
    try {
      const res = await fetch(`https://graph.facebook.com/me/accounts?access_token=${accessToken}`);
      const data = await res.json();

      if (data.error) {
        // handleFacebookApiError(data);
        console.error('Lỗi từ Facebook API:', data.error);
        alert('Đã xảy ra lỗi khi lấy danh sách trang Facebook.');
        return;
      }
      const facebookpage = data.data.map((page: any) => ({
        id: page.id,
        name: page.name,
        access_token: page.access_token,
      }));
      setSocialPage(facebookpage);
      localStorage.setItem('connectedPages', JSON.stringify(facebookpage))
      window.dispatchEvent(new Event('facebook_connected'));
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      alert('Đã xảy ra lỗi khi kết nối với Facebook.');
    }
  };
  useEffect(() => {
    const pages = localStorage.getItem('connectedPages');
    if (pages) {
      try {
        const parsed = JSON.parse(pages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSocialPage(parsed);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  //lấy danh sách bài viết từ facebook
  const getPagePosts = async (pageId: string, pageAccessToken: string): Promise<FacebookPost[]> => {
    try {
      const res = await fetch(`https://graph.facebook.com/${pageId}/posts?fields=message,permalink_url,created_time,id&access_token=${pageAccessToken}`);
      const data = await res.json();

      if (data.error) {
        console.error('Lỗi từ API Facebook:', data.error);
        throw new Error(data.error.message);
      }

      return data.data.map((post: any) => ({
        id: post.id,
        message: post.message || 'No content',
        created_time: post.created_time,
        permalink_url: post.permalink_url
      }));
    } catch (error) {
      console.error('Lỗi khi lấy post:', error);
      return [];
    }
  };

  return (
    <div className='w-full h-screen sm:h-auto min-h-[calc(100vh-35px)]  bg-white rounded-none sm:rounded-xl shadow-none sm:shadow-xl p-4 sm:p-6 md:p-8 pt-6 sm:pt-0 sm:pb-4'>
      {/* show pop up learn how to set up */}
      {
        showModel && (
          <div className='fixed inset-0 bg-black-50 z-40 flex items-center justify-center'>
              <button
                className=' absolute top-2 right-2  text-gray-500 hover:text-black text-lg'
                onClick={() => { setshowModel(false) }}
              >
                <CloseOutlined />
              </button>
              <Pop_up_Schedule onClose={() => { setshowModel(false) }} />
          </div>
        )
      }
      {showContentModal && (
        <div
          onClick={() => setShowContentModal(false)}
          className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg relative  max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowContentModal(false)}
              className="absolute top-2 right-3 text-xl text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-4">Post Content</h3>
            <p className="text-gray-700 whitespace-pre-line">{currentContent}</p>
          </div>
        </div>
      )}
      {
        isLogin ? (
          <div className='pt-10 sm:pt-2 md:pt-0 text-xs xs:text-[12px] sm:text-[14px] base:text-base lg:text-base'>
            <h1 className=' font-montserrat py-2 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl color-primary font-semibold color-primary'>
              {t("Get List Post Social Media")}
            </h1>
            <hr className='w-full border-[#e5e7eb]' />
            <div className=' mt-2'>
              <div className='flex justify-start items-center gap-2'>
                <h3 className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl  font-semibold text-black font-montserrat'>
                  {t("Facebook Pages")}:
                </h3>
                <h3
                  onClick={() => setShowSocialPage(true)}
                  className="text-[11px] sm:text-xs md:text-sm lg:text-base font-montserrat cursor-pointer text-gray-600 underline py-2" >
                  {t("Select Page Facebook")}
                </h3>
                {showSocialPage && (
                  <SelectFacebookPage
                    onClose={() => setShowSocialPage(false)}
                    pages={SocialPage}
                    onSelectPage={async (page) => {
                      const pageData = SocialPage.find(p => p.id === page.id);
                      if (!pageData) return;
                      try {
                        const postsData = await getPagePosts(page.id, pageData.access_token);
                        if (postsData.length > 0) {
                          setPost(postsData);          // ✅ chỉ set nếu có post
                        } else {
                          notification.warning({
                            message: 'Không có bài viết',
                            description: `Trang "${page.name}" hiện chưa có bài viết nào.`,
                          });
                        }
                        setShowSocialPage(false);     // ✅ đóng popup dù có hoặc không
                      } catch (error) {
                        notification.error({ message: 'Lỗi', description: 'Không lấy được bài viết từ Facebook.' });
                        setShowSocialPage(false);
                      }
                    }}
                  />
                )}
              </div>
              <div className="flex justify-start items-center  gap-2 ">
                <h3 className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl  font-semibold text-black font-montserrat'>
                  {t("Instagram Pages")}:
                </h3>
                <h3 className='text-[11px] sm:text-xs md:text-sm lg:text-base font-montserrat cursor-pointer text-gray-600 underline py-2'>
                  {t("Select Page Instagram")}
                </h3>
              </div>
              <div className="flex justify-start items-center  gap-2 ">
                <h3 className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl  font-semibold text-black font-montserrat'>
                  {t("Blog Url")}:
                </h3>
                <h3 className='text-[11px] sm:text-xs md:text-sm lg:text-base font-montserrat cursor-pointer text-gray-600 underline py-2'>
                  {t("Input Blog Url")}
                </h3>
              </div>
            </div>
            {post.length > 0 && (
              <div className='w-full overflow-x-auto sm:overflow-visible pt-4'>
                <h3 className='text-lg font-semibold mb-4'>Post Details:</h3>
                <EditableTable posts={post} onViewContent={handleViewContent} />
              </div>
            )}
          </div>
        ) : (
          <>
            <div className=' pt-10 sm:pt-2 md:pt-0 text-xs xs:text-[12px] sm:text-[14px] base:text-base lg:text-base'>
              <div className='font-montserrat py-2 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl color-primary font-semibold flex items-center gap-2'>
                {t("Social Media Management")}
              </div>
              <hr className='w-full border-[#e5e7eb]' />
              <div className="flex flex-col sm:flex-row">
                <p className="m-0 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-700">
                  {t("Manage your pages with an App ID.")}
                  <span
                    onClick={() => setshowModel(true)}
                    className="text-sky-500 font-normal hover:underline cursor-pointer inline-flex items-center gap-1 py-2 sm:py-4 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"
                  >
                    {t("Learn how to set it up!")}
                  </span>
                </p>
              </div>

              <p className="color-primary text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl pb-2 font-semibold flex items-center gap-2 mt-4">
                {t("Social App ID")}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-[80%]">
                <input
                  type="text"
                  className="flex-1 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl px-[12px] py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
                  placeholder={t("Enter your AppID Social Media Management")}
                />
                <button
                  className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold bg-primary text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition duration-300"
                  type="button"
                  onClick={() =>  connectFacebook()}
                >
                  {t("Connect")}
                </button>
              </div>

              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold text-black mt-6">
                {t("Select a default Facebook page:")}
              </p>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-500 mt-2">
                {t("No pages available")}
              </p>

              <div>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold color-primary flex items-center gap-2 mt-4">
                  {t("Business Type:")}
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-[80%]">
                  <input
                    className="flex-1 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl px-[12px] py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
                    type="text"
                    placeholder={t("Enter your Business Type")}
                  />
                  <button
                    className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold bg-primary text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition duration-300"
                    type="button"
                  >
                    {t("Save")}
                  </button>
                </div>
              </div>

            </div>
          </>
        )
      }
    </div>
  )
}
export default Media_Management_page

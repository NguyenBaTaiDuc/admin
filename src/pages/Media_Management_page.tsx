
import Pop_up_Schedule from '@/components/PopUp/Pop_up_Schedule';
import { getPagePosts, useFacebookSDK } from '@/services/apiFacebook';
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined';
import { useEffect, useState, useContext } from 'react';
import EditableTable, { FacebookPost } from '@/components/Table_Media_Management';
import SelectFacebookPage from '@/components/PopUp/SelectFacebookPage';
import { access } from 'fs';
import { notification } from 'antd';
import { AuthContext } from '@/services/auth_context';

declare global {
  interface Window {
    FB: any;
  }
}
const Media_Management_page = () => {
  //kiểm tra nếu accessToken hợp lệ 
  const validateAccessToken = async (token: string): Promise<boolean> => {
    try {
      const res = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
      const data = await res.json();
      console.log('Kết quả kiểm tra token:', data);

      if (data.error) {
        console.warn('Token không hợp lệ:', data.error);
        localStorage.removeItem('fbAccessToken');
        localStorage.removeItem('connectedPages');
        window.dispatchEvent(new Event('facebook_token_expired'));
        return false;
      }
      return true;
    } catch (error) {
      console.error('Lỗi khi gọi Facebook API:', error);
      return false;
    }
  };
  // hiển thị pop up nội dung bài viết trên mxh
  const [showContentModal, setShowContentModal] = useState(false);
  const [currentContent, setCurrentContent] = useState('');
  const handleViewContent = (content: string) => {
    setCurrentContent(content);
    setShowContentModal(true);
  };
  const [post, setPost] = useState<FacebookPost[]>([]);
  const { isLogin, logout, login } = useContext(AuthContext);
  useFacebookSDK();
  const connectFacebook = () => {
    console.log('Bắt đầu connectFacebook...');
    if (!window.FB) {
      alert('Facebook SDK chưa sẵn sàng.');
      console.warn('FB chưa được khởi tạo!');
      return;
    }
    console.log('FB SDK đã tồn tại, bắt đầu gọi login...');
    window.FB.login((response: any) => {
      console.log('Response từ FB.login:', response);
      if (response.authResponse) {
        const { accessToken, userID } = response.authResponse;
        console.log(' Kết nối thành công', { accessToken, userID });
        login(accessToken);
        alert('Kết nối thành công với Facebook!');
        fetchFacebookPages(accessToken);
      } else {
        console.warn('Người dùng đã từ chối hoặc lỗi khác');
      }
    }, {
      scope: 'public_profile,email,pages_show_list,pages_manage_posts'
    });
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
          <div className='fixed inset-0 bg-black-50 bg-opacity-30 backdrop-blur-sm z-40 flex items-center justify-center'>
            <div className='bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-2xl w-full relative z-50'>
              <button
                className=' absolute top-2 right-2  text-gray-500 hover:text-black text-lg'
                onClick={() => { setshowModel(false) }}
              >
                <CloseOutlined />
              </button>
              <Pop_up_Schedule onClose={() => { setshowModel(false) }} />
            </div>
          </div>
        )
      }
      {showContentModal && (
        <div
          onClick={() => setShowContentModal(false)}
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
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
          <div>
            <h1 className=' text-xl font-semibold color-primary'>Get List Post Social Media</h1>
            <hr className='w-full border-[#e5e7eb]' />
            <div className=' mt-2'>
              <div className='flex justify-start items-center gap-2'>
                <h3 className='text-lg font-semibold text-black '>Facebook Pages:</h3>
                <h3
                  onClick={() => setShowSocialPage(true)}
                  className="cursor-pointer text-gray-600 underline py-2" >Select Page Facebook</h3>
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
                      } catch (err) {
                        notification.error({ message: 'Lỗi', description: 'Không lấy được bài viết từ Facebook.' });
                        setShowSocialPage(false);
                      }
                    }}
                  />
                )}
              </div>
              <div className="flex justify-start items-center  gap-2 ">
                <h3 className='text-lg font-semibold text-black'>Instagram Pages:</h3>
                <h3 className='cursor-pointer text-gray-600 underline py-2'>Select Page Instagram</h3>
              </div>
              <div className="flex justify-start items-center  gap-2 ">
                <h3 className='text-lg font-semibold text-black'> Blog Url:</h3>
                <h3 className='cursor-pointer text-gray-600 underline py-2'>Input Blog Url</h3>
              </div>
            </div>
            {post.length > 0 && (
              <div className='mt-8'>
                <h3 className='text-lg font-semibold mb-4'>Post Details:</h3>
                <EditableTable posts={post} onViewContent={handleViewContent} />
              </div>
            )}
          </div>
        ) : (
          <>
            <div className=' sm: pt-10'>
              <div className=' color-primary w-max text-base sm:text-lg md:text-xl font-semibold flex items-center gap-2'>
                Social Media Management
              </div>
              <hr className='w-full border-[#e5e7eb]' />
              <div className='flex flex-col sm:flex-row'>
                <p className='m-0 text-base sm:text-lg text-gray-700'>
                  Manage your pages with an App ID.
                  <span
                    onClick={() => setshowModel(true)}
                    className='text-sky-500 font-normal hover:underline cursor-pointer inline-flex items-center gap-1 py-2 sm:py-4'>
                    Learn how to set it up!</span>
                </p>
              </div>
              <p className='color-primary text-base sm: pb-2 sm:text-lg font-semibold flex items-center gap-2 mt-4'>
                Social App ID
              </p>
              <div
                className='flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-[80%]'>
                <input
                  type='text'
                  className='flex-1 px-[12px] py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400'
                  placeholder='Enter your AppID Social Media Management' />
                <button
                  className='text-base sm:text-lg font-semibold bg-primary text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition duration-300'
                  type="button"
                  onClick={() => connectFacebook()}
                >
                  Connect</button>
              </div>
              <p className='text-base sm:text-lg font-semibold text-black mt-6'>Select a default Facebook page:</p>
              <p className='text-sm sm:text-base text-gray-500 mt-2'>No pages available</p>
              <div>
                <p className="text-base sm:text-lg sm font-semibold color-primary flex items-center gap-2 mt-4">
                  Business Type
                </p>
                <div className='flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-[80%]'>
                  <input
                    className='flex-1 px-[12px] py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400'
                    type='text'
                    placeholder='Enter your Business Type' />
                  <button
                    className='text-base sm:text-lg font-semibold bg-primary text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition duration-300'
                    type="button"
                  >
                    Save
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

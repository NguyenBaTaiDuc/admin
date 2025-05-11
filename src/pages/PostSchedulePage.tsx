import QuestionCircleOutlined from '@ant-design/icons/lib/icons/QuestionCircleOutlined';
import { useContext, useEffect, useState } from 'react';
import { HiPaperAirplane } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';
import "../index.css";
import { Alert, Badge, Calendar } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import Pop_up_Schedule from '@/components/PopUp/Pop_up_Schedule';
import OptionSchedulePost from '@/components/PopUp/OptionSchedulePost';
import Schedule_AI_Generate_Post from '@/components/PopUp/Schedule_AI_Generate_Post';
import CreateAndSchedulePost from '@/components/PopUp/CreateAndSchedulePost';
import ScheduleFacebookPost from '@/components/PopUp/ScheduleFacebookPost';
import CustomTooltip from '@/components/PopUp/Tooltip';
import image from '../assets/iconFacebook.svg'
import { Post, ListSchedulePost } from '@/components/PopUp/ListSchedulePost';
import { AuthContext } from '@/services/auth_context';
import PostFromFacebook from '@/components/PopUp/PostFromFacebook';
import { useTranslation } from 'react-i18next';
import { getAllSchedulePostFacebook, getPagePosts } from '@/services/apiFacebook';
const PostSchedulePage: React.FC = () => {
  // ngày nào đặt lịch thì badge sẽ hiện ở ngày đó 
  const [postCountByDate, setPostCountByDate] = useState<Record<string, number>>({});
  const updatePostCountByDate = (allPosts: Post[]) => {
    const counter: Record<string, number> = {};

    allPosts.forEach(post => {
      const rawTimestamp =
        post.scheduled_publish_time ||
        post.scheduledTime ||
        post.postingTime ||
        post.created_time;

      if (!rawTimestamp) return;

      const postDate = typeof rawTimestamp === 'number'
        ? (rawTimestamp > 1e12 ? dayjs(rawTimestamp) : dayjs.unix(rawTimestamp))
        : dayjs(rawTimestamp);

      const dateStr = postDate.format("YYYY-MM-DD");
      counter[dateStr] = (counter[dateStr] || 0) + 1;
    });

    setPostCountByDate(counter);
  };
  // đưa bài post lên calender
  const getTodayPostAndSchedules = async (pageId: string, pageToken: string) => {
    let posted: any[] = [];
    let scheduled: any[] = [];

    try {
      const result = await Promise.all([
        getPagePosts(pageId, pageToken),
        getAllSchedulePostFacebook(pageToken, pageId),
      ]);
      posted = Array.isArray(result[0]) ? result[0] : [];
      scheduled = Array.isArray(result[1]) ? result[1] : [];
    } catch (error) {
      console.error('Lỗi khi lấy bài viết:', error);
    }
    const today = dayjs().startOf('day');
    const todayPosted = posted.filter((post: any) =>
      dayjs(post.created_time).isAfter(today)
    ).map((post: any) => ({
      id: post.id,
      content: post.message || '',
      url: post.permalink_url,
      tag: 'Published',
      selectedPageId: pageId,
      created_time: post.created_time,
      postingTime: post.created_time, // Ensure postingTime is included
      selectedPage: pageId, // Ensure selectedPage is included
      pageAccessToken: pageToken, // Add pageAccessToken
    }));
    const futureScheduled = scheduled.filter((post: any) =>
      dayjs.unix(post.scheduled_publish_time).isAfter(today)
    ).map((post: any) => ({
      id: post.id,
      content: post.message || '',
      url: `https://facebook.com/${post.id}`,
      tag: 'Scheduled',
      imageUrl: post.full_picture || post.attachments?.data?.[0]?.media?.image?.src || '',
      selectedPageId: pageId,
      scheduled_publish_time: post.scheduled_publish_time,
      postingTime: post.scheduled_publish_time, // Ensure postingTime is included
      selectedPage: pageId, // Ensure selectedPage is included
      pageAccessToken: pageToken, // Add pageAccessToken
    }));
    return [...todayPosted, ...futureScheduled];
  };
  const { t } = useTranslation();
  //cập nhật thời khóa biểu sau khi xóa bài viết đã đặt lịch
  // Giúp cập nhật lại lịch sau khi xóa bài viết
  const handlePostUpdated = async () => {
    if (!selectedPageId || connectedSocial.length === 0) return;

    const selectedPage = connectedSocial.find((p) => p.id === selectedPageId);
    if (!selectedPage) {
      console.warn('Không tìm thấy trang được chọn!');
      return;
    }
    try {
      const posts = await getTodayPostAndSchedules(selectedPage.id, selectedPage.access_token);
      const grouped = groupPostsByDate(posts);
      setScheduledPostsByDate(grouped);

      console.log('[Cập nhật lịch]  Lịch đã được làm mới sau khi xóa bài viết.');
    } catch (err: any) {
      console.error('Lỗi khi cập nhật lại thời khóa biểu:', err.message);
    }
  };
  // xử lý khi token hết hạn
  const { isLogin, logout, login } = useContext(AuthContext);
  // đóng mở pop up ListSchedulePost
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedDateForPopup, setSelectedDateForPopup] = useState('');
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
  // đóng mở pop up PostFromFacebook
  const [selectDetailPost, setselectDetailPost] = useState<Post | null>(null);
  const [postFromFacebookDetail, setpostFromFacebookDetail] = useState(false);
  useEffect(() => {
    const handleTokenExpired = () => {
      setconnectedSocial([]);
    };
    window.addEventListener('facebook_token_expired', handleTokenExpired);
    return () => window.removeEventListener('facebook_token_expired', handleTokenExpired);
  }, []);
  // nghe sự kiện kois nối login faceboook
  useEffect(() => {
    const handleFacebookConnected = () => {
      const pageData = localStorage.getItem('connectedPages');
      try {
        const pages = JSON.parse(pageData || '[]')
        if (Array.isArray(pages) && pages.length > 0) {
          setconnectedSocial(pages)
        }
        else {
          setconnectedSocial([]);
        }
      }
      catch (e) {
        setconnectedSocial([]);
      }
    };
    handleFacebookConnected();
    // đăng ký lắng nghe event từ tab khác hoặc trang khác
    window.addEventListener('facebook_connected', handleFacebookConnected);
    return () => {
      window.removeEventListener('facebook_connected', handleFacebookConnected);
    };
  }, []);
  // danh sách bài đã đăng và lên lịch đăng
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [scheduledPostsByDate, setScheduledPostsByDate] = useState<Record<string, any[]>>({});
  useEffect(() => {
    if (isLogin) {
      const stored = localStorage.getItem('scheduledPostsByDate');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setScheduledPostsByDate(parsed);
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
        }
      }
    }
  }, [isLogin]);
  // lắng nghr sự kiện reload lại page sau khi schedule bài viết lên face
  useEffect(() => {
    const fetchAllPosts = async () => {
      if (!selectedPageId) return;
      const page = connectedSocial.find((p) => p.id === selectedPageId);
      if (!page) return;
      const posts = await getTodayPostAndSchedules(page.id, page.access_token,);
      setScheduledPostsByDate(groupPostsByDate(posts));
      updatePostCountByDate(posts);
    };

    fetchAllPosts();

  }, [selectedPageId]); // Khi đổi page -> tự load lại

  const groupPostsByDate = (posts: any[]) => {
    return posts.reduce((acc: Record<string, any[]>, post) => {
      const timestamp = post.scheduled_publish_time
        ? dayjs.unix(post.scheduled_publish_time)
        : dayjs(post.created_time);
      const key = timestamp.format('YYYY-MM-DD');
      if (!acc[key]) acc[key] = [];
      acc[key].push(post);
      return acc;
    }, {});
  };
  //kiểm tra xem đã kết nói với tài khoản facebook chưa
  const [connectedSocial, setconnectedSocial] = useState<{
    [x: string]: string; id: string, name: string
  }[]>([]);
  //chọn platform Facebook hoặc IG
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  // đóng mở pop up Facebook and IG post
  const [IsOpenFaceandIGPopup, setIsOpenFaceandIGPopup] = useState(false);
  // mở pop up của Generate AI Post
  const [IsshowAIschedulepost, setIsshowAIchedulepost] = useState(false);
  // đóng mở pop up Create and Schedule a New Post
  const [IsOpenCreateSchedulePostPopup, setIsOpenCreateandSchedulePopup] = useState(false);
  // Pop up learn how to schedule post
  const [Isshowpopuplearn, setIsshowpopuplearn] = useState(false);
  const [Isshowoptionschedulepost, setIsshowoptionschedulepost] = useState(false);
  const navigate = useNavigate();
  //Calender
  const [value, setValue] = useState(() => dayjs('2017-01-25'));
  const [selectedValue, setSelectedValue] = useState(() => dayjs());
  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
    setSelectedValue(newValue);
  };
  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
  };
  //đóng option pop up, hiện pop up AI 
  const handleChooseAIPost = () => {
    setIsshowoptionschedulepost(false); // đóng popup Option
    setTimeout(() => {
      setIsshowAIchedulepost(true); // mở popup AI
    }, 0);
  };
  //đóng option pop up, hiện pop up AI 
  const handleChooseCreateandSchedulePost = () => {
    setIsshowoptionschedulepost(false); // đóng popup Option
    setTimeout(() => {
      setIsOpenCreateandSchedulePopup(true); // mở popup Create and Schedule Post
    }, 0);
  };
  //đóng pop up chọn facebook && IG , hiện pop up AI Schedulw Facebook và IG 
  const handleChooseFacebookandIGPost = (platform: 'Facebook' | 'Instagram') => {
    setIsOpenCreateandSchedulePopup(false); // đóng popup Option
    setSelectedPlatform(platform); // lưu platform đã chọn
    setTimeout(() => {
      setIsOpenFaceandIGPopup(true); // mở popup Create and Schedule Post
    }, 0);
  };

  // lấy tên page
  const [pageName, setPageName] = useState<string>(''); // Define state for pageName
  useEffect(() => {
    if (selectDetailPost?.selectedPage) {
      const token = localStorage.getItem("accessToken"); // Đọc tại thời điểm thực thi
      if (!token) {
        console.warn("Access token not found in localStorage");
        return;
      }

      fetch(`https://graph.facebook.com/${selectDetailPost.selectedPage}?fields=name&access_token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Facebook Graph Response:", data);
          if (data.error) {
            console.error("Graph API error:", data.error);
          } else {
            setPageName(data.name);
          }
        });
    }
  }, [selectDetailPost?.selectedPage]);
  // chỉnh format ngày giờ
  const formattedPostingTime = selectDetailPost?.postingTime
    ? dayjs(
      typeof selectDetailPost.postingTime === 'number' && selectDetailPost.postingTime < 1e12
        ? selectDetailPost.postingTime * 1000
        : selectDetailPost.postingTime
    ).format('D [tháng] M [lúc] HH:mm')
    : '';

  return (
    <div className='flex flex-col'>
      <div className="w-full  sm:h-auto min-h-screen sm:min-h-[calc(100vh-35px)] bg-white rounded-none sm:rounded-xl shadow-none sm:shadow-xl p-4 sm:p-6 md:p-8 pt-6">
        {/* Show pop up learn how to schedule post */}
        {
          Isshowpopuplearn && (
            <div className='fixed inset-0 bg-black/30  z-60 flex items-center justify-center'>
              <button
                className=' absolute top-2 right-2  text-gray-500 hover:text-black text-lg'
                onClick={() => { setIsshowpopuplearn(false) }}
              >
                <CloseOutlined />
              </button>
              <Pop_up_Schedule onClose={() => setIsshowpopuplearn(false)} />
            </div>
          )
        }
        {/* Show pop up learn how to schedule post */}
        {
          Isshowoptionschedulepost && (
            <div className='fixed inset-0 bg-black/30 z-60 flex items-center justify-center '>
              <OptionSchedulePost
                onClose={() => {
                  setIsshowoptionschedulepost(false);
                  setIsshowAIchedulepost(false);
                  setIsOpenCreateandSchedulePopup(false);
                }}
                onChooseAIPost={handleChooseAIPost} // truyền hàm vào prop
                onChooseCreateandSchedulePost={handleChooseCreateandSchedulePost} // truyền hàm vào prop
              />
            </div>
          )
        }
        {/* mở pop up AI create post */}
        {
          IsshowAIschedulepost && (
            <div className='fixed inset-0 bg-black/30 z-60 flex items-center justify-center '>
              <div className='bg-white rounded-lg shadow-lg p-4 sm:p-6 w-[92%] sm:w-[90%] md:w-[640px] lg:w-[800px] xl:w-[1024px] relative'>
                <button
                  className='absolute top-2 right-2  text-gray-500  hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm'
                  onClick={() => { setIsshowAIchedulepost(false) }}
                >
                  <CloseOutlined
                    style={{ fontSize: '20px', padding: 10 }}
                  />
                </button>
                <Schedule_AI_Generate_Post onClose={() => setIsshowAIchedulepost(false)} />
                     <div className="flex justify-end w-full">
                  <button
                    onClick={() => setIsshowAIchedulepost(false)}
                    className="px-4 py-2 mt-6 text-sm sm:text-base font-semibold border-2 border-[rgb(58,166,202)] text-[rgb(58,166,202)] rounded-md hover:bg-[rgb(58,166,202)]/80 hover:text-white transition-all"
                  >
                    {t("Close")}
                  </button>
                </div>
              </div>
            </div>
          )
        }
        {/* mở pop up create and schedule post */}
        {
          IsOpenCreateSchedulePostPopup && (
            <div className='fixed inset-0 bg-black/30 z-60 flex items-center justify-center '>
              <div className="bg-white rounded-lg shadow-lg px-4 py-4 sm:px-6 sm:py-6 w-full max-w-[95%] sm:max-w-[600px] lg:max-w-[768px] mx-auto relative">

                <button
                  className=' absolute top-2 right-2  text-gray-500  hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm'
                  onClick={() => { setIsOpenCreateandSchedulePopup(false) }}
                >
                  <CloseOutlined
                    style={{ fontSize: '20px', padding: 10 }} />
                </button>
                <CreateAndSchedulePost
                  onClose={() => {
                    setIsshowoptionschedulepost(false);
                    setIsshowAIchedulepost(false);
                    setIsOpenCreateandSchedulePopup(false);
                  }}
                  onChooseFacebookandIG={handleChooseFacebookandIGPost} // truyền hàm vào prop\
                />
              </div>
            </div>
          )
        }
        {/* Pop up mở facebook và instagram post */}
        {
          IsOpenFaceandIGPopup && (
            <div className='fixed inset-0 bg-black/30 z-60 flex items-center justify-center '>
              <div className="bg-white rounded-lg shadow-lg   p-4 sm:p-6 md:p-8  w-full  max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl  mx-auto relative">
                <button
                  className=' absolute top-2 right-2  text-gray-500  hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm'
                  onClick={() => { setIsOpenFaceandIGPopup(false) }}
                >
                  <CloseOutlined
                    style={{ fontSize: '20px', padding: 10 }} />
                </button>
                <ScheduleFacebookPost
                  handlePostUpdated={handlePostUpdated}
                  onClose={() => setIsOpenFaceandIGPopup(false)}
                  platform={selectedPlatform === 'Facebook' || selectedPlatform === 'Instagram' ? selectedPlatform : 'Facebook'}
                  onBackToPlatForm={() => {
                    setIsOpenFaceandIGPopup(false);
                    setTimeout(() => setIsOpenCreateandSchedulePopup(true), 0);
                  }}
                />
              </div>
            </div>
          )
        }
        <h1 className=' font-bold py-2 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl color-primary pt-10 sm:pt-2 md:pt-0 '> {t("Post Schedule")}</h1>
        <hr className="w-full border-[#e5e7eb] py-2" />
        {/* Description Line */}
        {/* Description Line */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <span className="text-black text-xs sm:text-sm md:text-base flex flex-col">
            <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-700 font-montserrat">
              {t("Plan and manage your social media content in one place")}
            </span>

            <div className="text-blue-600 font-normal text-xs sm:text-sm md:text-base flex gap-1 items-center cursor-pointer mt-2">
              <label className="font-semibold text-black font-montserrattext-xs sm:text-sm md:text-base lg:text-lg xl:text-xl py-1">
                {t("Schedule Post")}
              </label>
              <QuestionCircleOutlined
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'blue',
                  color: 'white',
                  padding: '2px',
                }}
              />
              <span
                onClick={() => setIsshowpopuplearn(true)}
                className="hover:underline text-blue-600 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-montserrat"
              >
                {t("Learn How to schedule a post")}
              </span>
            </div>
          </span>
        </div>

        {/* Responsive Button */}
        <button
          onClick={() => setIsshowoptionschedulepost(true)}
          className="text-left mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-white border rounded-lg flex gap-2 items-center whitespace-nowrap
             text-xs sm:text-sm md:text-base lg:text-lg"
        >
          <HiPaperAirplane className="w-5 h-5 sm:w-6 sm:h-6" />
          {t("Click here to schedule post")}
        </button>

        <div className='bg-white pb-10 text-black flex flex-col '>
          <div className='w-[600px] flex flex-row items-center gap-1 pt-5 pb-2 '>
            <label className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold w-auto flex '>
              {t("Select a page to view scheduled posts:")}
            </label>
            <CustomTooltip
              defaultColor="#6B7280"
              className="text-[14px] text-gray-500 hover:text-blue-600 cursor-pointer transition-colors ml-1 whitespace-normal max-w-[300px] w-fit"
              placement="bottomLeft"
              hoverColor="#2563EB"
              customStyle={{
                fontSize: '12px',
                color: 'white',
                whiteSpace: 'normal',
                width: 'fit-content',
                maxWidth: '350px',
                padding: '8px'
              }}
              title={t('View scheduled Posts')}
              description=''
            />
          </div>
          {isLogin ? (
            <div className="w-full sm:w-[300px]">
              <select
                className="border border-gray-300 rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl  w-full"
                onChange={(e) => {
                  const selectedPageId = e.target.value;
                  setSelectedPageId(selectedPageId);
                  console.log("Selected Page ID:", selectedPageId);
                }}
              >
                <option value="">-- {t("Select a Page")} --</option>
                {connectedSocial.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className='flex flex-row'>
              <p className='text-gray-500 text-xs sm:text-sm md:text-base lg:text-lg  flex gap-1 items-center'>
                {t("No page available?")}
                <span
                  onClick={() => navigate('/Media_Management')}
                  className=' btn-connect text-xs sm:text-sm md:text-base lg:text-lg  hover:underline cursor-pointer'>
                  {t("Let's connect")}
                </span>
              </p>
            </div>
          )}
          <div className="page-bottom-spacing bg-white pb-10 text-black flex flex-col">
            {/* các đoạn khác */}
            <div className="relative">
              <div className="w-full rounded-t-2xl bg-white pt-5">
                <div className='pb-5'>
                  <Alert message={`${t("You selected date:")} ${selectedValue?.format('YYYY-MM-DD')}`} className="mb-20 " />
                </div>
                <Calendar
                  defaultValue={dayjs()}

                  onSelect={(newValue) => {
                    setValue(newValue);
                    setSelectedValue(newValue);
                  }}
                  onPanelChange={(newValue) => setValue(newValue)}
                  cellRender={(date) => {
                    const dateKey = date.format('YYYY-MM-DD');
                    const posts = scheduledPostsByDate[dateKey] || [];
                    const filteredPosts = posts.filter((post) => post.selectedPageId === selectedPageId);
                    if (!selectedPageId || filteredPosts.length === 0) return null;

                    return (
                      <div className="flex justify-center">
                        <div
                          className="relative inline-block cursor-pointer"
                          onClick={() => {
                            setSelectedDateForPopup(date.format('YYYY-MM-DD'));
                            setSelectedPosts(filteredPosts);
                            setPopupVisible(true);
                          }}
                        >
                          <img className="w-10 h-10 rounded-md" src={image} alt="" />
                          <div className='hidden sm:block'>
                            <Badge
                              count={posts.length}
                              style={{
                                backgroundColor: 'red',
                                position: 'absolute',
                                top: '-52px',
                                right: '-46px',
                                transform: 'scale(0.8)',
                                transformOrigin: 'top right',
                                color: 'white'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  }}
                  headerRender={({ value: current, onChange }) => {
                    const month = current.month();
                    const year = current.year();
                    const changeMonth = (offset: number) => {
                      const newDate = current.clone().add(offset, 'month');
                      setValue(newDate);
                      onChange(newDate); // để thay đổi tháng trên Calendar
                    };
                    const goToday = () => {
                      const today = dayjs();
                      setValue(today);
                      setSelectedValue(today);
                      onChange(today);
                    };
                    return (
                      <div className="flex justify-between items-center px-2 pb-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={month}
                            onChange={(e) => {
                              const newDate = current.clone().month(parseInt(e.target.value));
                              setValue(newDate);
                              onChange(newDate);
                            }}
                            className="border rounded px-2 py-1"
                          >
                            {Array.from({ length: 12 }, (_, i) => (
                              <option key={i} value={i}>
                                {dayjs().month(i).format('MMM')}
                              </option>
                            ))}
                          </select>

                          <select
                            value={year}
                            onChange={(e) => {
                              const newDate = current.clone().year(parseInt(e.target.value));
                              setValue(newDate);
                              onChange(newDate);
                            }}
                            className="border rounded px-2 py-1"
                          >
                            {Array.from({ length: 10 }, (_, i) => year - 5 + i).map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={goToday}
                            className="px-3 py-1 border rounded-md color-primary border-primary hover-bg-primary "
                          >
                            {t("Today")}
                          </button>
                          <hr className="h-6 w-px border-l border-black mx-2" />

                          <button
                            onClick={() => changeMonth(-1)}
                            className="px-2 py-1 border rounded-md color-primary border-primary hover-bg-primary"
                          >
                            <LeftOutlined />
                          </button>
                          <button
                            onClick={() => changeMonth(1)}
                            className="px-2 py-1 border rounded-md color-primary border-primary hover-bg-primary"
                          >
                            <RightOutlined />
                          </button>
                        </div>
                        {isLogin && popupVisible && (
                          <ListSchedulePost
                            isOpen={popupVisible}
                            onClose={() => setPopupVisible(false)}
                            posts={selectedPosts}
                            date={selectedDateForPopup}
                            onPostsUpdated={handlePostUpdated}
                            onViewPost={(post) => {
                              setselectDetailPost(post);
                              setPopupVisible(false);
                              setpostFromFacebookDetail(true); // cần bật cái này nếu muốn mở popup bài viết chi tiết
                            }}
                          />
                        )}

                        {isLogin && postFromFacebookDetail && (
                          <PostFromFacebook
                            isOpen={postFromFacebookDetail}
                            onClose={() => {
                              setpostFromFacebookDetail(false);
                              setPopupVisible(false);
                            }}
                            onBack={() => {
                              setpostFromFacebookDetail(false);
                              setPopupVisible(true);
                            }}
                            header={pageName}
                            description={formattedPostingTime || ''}
                          >
                            {selectDetailPost && (
                              <div className="flex flex-col gap-4 items-start w-full">
                                <p className="text-base max-w-[50%] break-words">{selectDetailPost.content}</p>
                                {selectDetailPost.imageUrl && (
                                  <div className="w-full flex justify-center">
                                    <img
                                      src={selectDetailPost.imageUrl}
                                      alt="Ảnh bài viết"
                                      className="max-w-[50%] h-auto object-contain rounded"
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </PostFromFacebook>
                        )}
                      </div>
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='h-5'>
      </div>
    </div>
  );
};

export default PostSchedulePage
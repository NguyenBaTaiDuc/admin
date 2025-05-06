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
const PostSchedulePage: React.FC = () => {
  // xử lý khi token hết hạn
  const { isLogin, logout, login } = useContext(AuthContext);
  // đóng mở pop up ListSchedulePost
    const [popupVisible, setPopupVisible] = useState(false);
  const [selectedDateForPopup, setSelectedDateForPopup] = useState('');
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
  useEffect(() => {
    const handleTokenExpired = () => {
      setconnectedSocial([]);
    };
    window.addEventListener('facebook_token_expired', handleTokenExpired);
    return () => window.removeEventListener('facebook_token_expired', handleTokenExpired);
  }, []);
  // reload trang sau khi đặt lịch 
  const [reloadPostsFlag, setReloadPostsFlag] = useState(false);
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
  
  useEffect(() => {
    localStorage.setItem('scheduledPostsByDate', JSON.stringify(scheduledPostsByDate));
  }, [scheduledPostsByDate]);

  //load bài viết theo selectedPageId và reloadPostFlag
  useEffect(() => {
    const scheduledPosts = JSON.parse(localStorage.getItem('scheduledPosts') || '[]');
    const postedPosts = JSON.parse(localStorage.getItem('postedPosts') || '[]');
  
    const today = dayjs().startOf('day');
  
    // Ưu tiên lấy scheduled nếu bị trùng
    const combinedPosts = [...scheduledPosts];
  
    const seen = new Set<string>();
  
    // đánh dấu các bài đã có trong scheduled
    scheduledPosts.forEach((post: any) => {
      const uniqueKey = `${post.selectedPage}_${post.postingTime}_${post.content}`;
      seen.add(uniqueKey);
    });
  
    // chỉ thêm các bài posted nếu không trùng
    postedPosts.forEach((post: any) => {
      const uniqueKey = `${post.selectedPage}_${post.postingTime}_${post.content}`;
      if (!seen.has(uniqueKey)) {
        combinedPosts.push(post);
        seen.add(uniqueKey);
      }
    });
  
    const grouped: Record<string, any[]> = {};
  
    combinedPosts
      .filter((post: any) => {
        const postDate = dayjs(post.postingTime);
        const isFutureOrToday = postDate.isSame(today) || postDate.isAfter(today);
        const isSamePage = selectedPageId ? post.selectedPage === selectedPageId : true;
        return isFutureOrToday && isSamePage;
      })
      .forEach((post: any) => {
        const dateKey = dayjs(post.postingTime).format('YYYY-MM-DD');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(post);
      });
  
    setScheduledPostsByDate(grouped);
  }, [selectedPageId, reloadPostsFlag]);
  
  // lắng nghr sự kiện reload lại page sau khi schedule bài viết lên face
  useEffect(() => {
    const handleReload = () => {
      setReloadPostsFlag(prev => !prev); // Toggle flag để trigger reload
    };

    window.addEventListener('reload_posts', handleReload);

    return () => {
      window.removeEventListener('reload_posts', handleReload);
    };
  }, []);


  //kiểm tra xem đã kết nói với tài khoản facebook chưa
  const [connectedSocial, setconnectedSocial] = useState<{ id: string, name: string }[]>([]);
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
  const [isClickBtn, setIsClickBtn] = useState<'day' | 'week'>('day');
  //Calender
  const [value, setValue] = useState(() => dayjs('2017-01-25'));
  const [selectedValue, setSelectedValue] = useState(() => dayjs('2017-01-25'));
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

 
  return (
    <div className='flex flex-col'>
      <div className="w-full  sm:h-auto  bg-white rounded-none sm:rounded-xl shadow-none sm:shadow-xl p-4 sm:p-6 md:p-8 pt-6">
        {/* Show pop up learn how to schedule post */}
        {
          Isshowpopuplearn && (
            <div className='fixed inset-0 bg-black/50  z-40 flex items-center justify-center'>
              <div className='bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-2xl w-full relative z-50'>
                <button
                  className=' absolute top-2 right-2  text-gray-500 hover:text-black text-lg'
                  onClick={() => { setIsshowpopuplearn(false) }}
                >
                  <CloseOutlined />
                </button>
                <Pop_up_Schedule onClose={() => setIsshowpopuplearn(false)} />
              </div>
            </div>
          )
        }
        {/* Show pop up learn how to schedule post */}
        {
          Isshowoptionschedulepost && (
            <div className='fixed inset-0 bg-black/50 z-40 flex items-center justify-center '>
              <div className='bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-3xl w-full relative z-50 '>
                <button
                  className=' absolute top-2 right-2  text-gray-500  hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm'
                  onClick={() => { setIsshowoptionschedulepost(false) }}
                >
                  <CloseOutlined
                    style={{ fontSize: '20px', padding: 10 }}
                  />
                </button>
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
            </div>
          )
        }
        {/* mở pop up AI create post */}
        {
          IsshowAIschedulepost && (
            <div className='fixed inset-0 bg-black/50 z-40 flex items-center justify-center '>
              <div className='bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-3xl w-full relative z-50 '>
                <button
                  className='absolute top-2 right-2  text-gray-500  hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm'
                  onClick={() => { setIsshowAIchedulepost(false) }}
                >
                  <CloseOutlined
                    style={{ fontSize: '20px', padding: 10 }}
                  />
                </button>
                <Schedule_AI_Generate_Post onClose={() => setIsshowAIchedulepost(false)} />
              </div>
            </div>
          )
        }
        {/* mở pop up create and schedule post */}
        {
          IsOpenCreateSchedulePostPopup && (
            <div className='fixed inset-0 bg-black/50 z-40 flex items-center justify-center '>
              <div className='bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-3xl w-full relative z-50 '>
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
            <div className='fixed inset-0 bg-black/50 z-40 flex items-center justify-center '>
              <div className='bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-3xl w-full relative z-50 '>
                <button
                  className=' absolute top-2 right-2  text-gray-500  hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm'
                  onClick={() => { setIsOpenFaceandIGPopup(false) }}
                >
                  <CloseOutlined
                    style={{ fontSize: '20px', padding: 10 }} />
                </button>
                <ScheduleFacebookPost
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
        <h1 className=' color-primary w-max text-base sm:text-lg md:text-xl font-semibold flex items-center gap-2'>Post Schedule</h1>
        <hr className="w-full border-[#e5e7eb] py-2" />
        {/* Description Line */}
        <div className="flex justify-between items-start">
          <span className="text-black text-sm flex flex-col">
            <span className='m-0 text-base sm:text-lg text-gray-700'> Plan and manage your social media content in one place</span  >
            <div className=' text-blue-600 font-normal text-sm  flex gap-1 items-center cursor-pointer mt-2'>
              <label className="text-sm font-semibold text-black  w-auto py-2">Schedule Post</label>
              <QuestionCircleOutlined
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'blue',
                  color: 'white',
                  padding: '2px',
                }} />
              <span
                onClick={() => setIsshowpopuplearn(true)}
                className='hover:underline text-blue-600 '>   Learn How to schedule a post
              </span>
            </div>
          </span>
        </div>
        <button
          onClick={() => setIsshowoptionschedulepost(true)}
          className="w-[280px] text-left p-3  bg-primary hover:bg-primary/90 text-white border rounded-lg 
            flex gap-2 items-center"
        >
          <HiPaperAirplane className="w-6 h-6 " /> Click here to schedule post
        </button>
        <div className='bg-white pb-10 text-black flex flex-col '>
          <div className='w-[600px] flex flex-row items-center gap-1 pt-5 pb-2 '>
            <label className='text-sm font-semibold w-auto flex '>Select a page to view scheduled posts:</label>
            <CustomTooltip
              defaultColor="#6B7280"
              className="text-[14px] !text-gray-500 hover:!text-blue-600 cursor-pointer transition-colors mt-1 ml-1"
              placement="bottomLeft"
              hoverColor="#2563EB"
              customStyle={{ fontSize: '14px', color: 'white' }}
              title={"View scheduled Posts"}
              description={"Choose a page to view and manage scheduled posts, including their status, platform, and actions like edit or remove"} />
          </div>
          {isLogin  ? (
            <div className="w-[300px]">
              <select
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
                onChange={(e) => {
                  const selectedPageId = e.target.value;
                  setSelectedPageId(selectedPageId);
                  console.log("Selected Page ID:", selectedPageId);
                  // bạn có thể lưu lại hoặc gọi API theo ID này
                }}
              >
                <option value="">-- Select a Page --</option>
                {connectedSocial.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className='flex flex-row w-[300px]'>
              <p className='text-gray-500 text-base flex gap-1 items-center'> No page available?
                <span
                  onClick={() => navigate('/Media_Management')}
                  className=' btn-connect text-base hover:underline cursor-pointer'>Let's connect</span>
              </p>
            </div>
          )}
          <div className="page-bottom-spacing bg-white pb-10 text-black flex flex-col">
            {/* các đoạn khác */}
            <div className="relative">
              <div className="w-full rounded-t-2xl bg-white pt-5">
                <div className='pb-5'>
                  <Alert message={`You selected date: ${selectedValue?.format('YYYY-MM-DD')}`} className="mb-20 " />
                </div>
                <Calendar
                  value={value}
                  onSelect={(newValue) => {
                    setValue(newValue);
                    setSelectedValue(newValue);
                  }}
                  onPanelChange={(newValue) => setValue(newValue)}
                  cellRender={(date) => {
                    const dateKey = date.format('YYYY-MM-DD');
                    const posts = scheduledPostsByDate[dateKey] || [];
                    // setScheduledPostsByDate({...scheduledPostsByDate})
                    if(!selectedPageId || posts.length ===0) return null;

                    return  (
                      <div className="flex justify-center">
                        <div
                        className="relative inline-block cursor-pointer"
                        onClick={() => {
                          setSelectedDateForPopup(date.format('YYYY-MM-DD'));
                          setSelectedPosts(posts);
                          setPopupVisible(true);
                        }}
                        >
                          <img className="w-10 h-10 rounded-md" src={image} alt="" />
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
                            Hôm nay
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
                        <ListSchedulePost
                          isOpen={popupVisible}
                          onClose={() => setPopupVisible(false)}
                          posts={selectedPosts}
                          date={selectedDateForPopup}
                        />
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
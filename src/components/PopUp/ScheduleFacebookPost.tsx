import { schedulePostFacebook } from '@/services/apiFacebook';
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
interface ScheduleFacebookPostProps {
  onClose: () => void;
  platform: 'Facebook' | 'Instagram';
  onBackToPlatForm: () => void;
  handlePostUpdated: () => Promise<void>;
}

const ScheduleFacebookPost: React.FC<ScheduleFacebookPostProps> = ({ handlePostUpdated, onClose, platform, onBackToPlatForm }) => {
  const modalRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedPage, setSelectedPage] = useState('');
  const [postingTime, setPostingTime] = useState('');
  const [connectedPages, setConnectedPages] = useState<{ id: string; name: string; access_token: string }[]>([]);

  useEffect(() => {
    const pagesData = localStorage.getItem('connectedPages');
    if (pagesData) {
      const parsedPages = JSON.parse(pagesData);
      if (Array.isArray(parsedPages)) {
        const validPages = parsedPages.filter((page) => page.access_token);
        setConnectedPages(validPages);
      }
    }
  }, []);
  const handleSchedulepost = async () => {
    const scheduledTime = new Date(postingTime).getTime();
    const now = Date.now();
    if (isNaN(scheduledTime)) {
      alert('Thời gian đăng bài không hợp lệ');
      return;
    }
    if (scheduledTime <= now) {
      alert('Bạn phải chọn thời gian đăng bài từ thời điểm hiện tại trở đi (không thể đặt lịch trong quá khứ).');
      return;
    }
    const selected = connectedPages.find((page) => page.id == selectedPage);
    if (!selected) {
      alert('Không tìm thấy trang web');
      return;
    }
    try {
      const result = await schedulePostFacebook({
        pageId: selected.id,
        pageToken: selected.access_token,
        message: content,
        imageUrl: imageUrl ? [imageUrl] : null,
        scheduledTime: Math.floor(scheduledTime / 1000),

      });
      // console.log(result?.id);
      console.log({
        pageId: selected.id,
        pageToken: selected.access_token,
        message: content,
        imageUrl,
        scheduledTime: Math.floor(scheduledTime / 1000),
        postId: result?.id,
      });
      toast.success("Đặt lịch thành công");
      if (typeof handleSchedulepost === 'function') {
        await handlePostUpdated();
      }
      // window.dispatchEvent(new Event('reload_post'));
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Lỗi khi đặt lịch bài viết", error.message);
        toast.error("Đã xảy ra lỗi khi đặt lịch");
        console.log('Lỗi khi đặt lịch:', error.message);
      } else {
        console.error("Lỗi không xác định:", error);
        toast.error("Lỗi không xác định khi đặt lịch");
      }
    }
  };
  const handleNext = () => {
    if (step === 1) setStep(2);
  };


  const handlePrevious = () => {
    if (step === 2) {
      setStep(1);
    } else {
      onBackToPlatForm(); // quay về CreateAndSchedulePost
    }
  };
  return (
    <div className="px-4 sm:px-6 md:px-10 py-6 w-full">
      <div
        ref={modalRef}
      >
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[rgb(255,118,14,var(--tw-text-opacity,1))] mb-4 sm:mb-6 text-center">
          {t('SchedulePost', { platform })}
        </h2>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm sm:text-base font-semibold mb-2">
                {t('Content')}:
              </label>
              <textarea
                className="w-full h-40 p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[rgb(255,118,14,var(--tw-text-opacity,1))]"
                placeholder={t('Input content...')}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm sm:text-base font-semibold text-black mb-2">
                {t('Paste image URL')}:
              </label>
              <input
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[rgb(255,118,14,var(--tw-text-opacity,1))]"
                type="text"
                placeholder={t('Paste image URL')}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col space-y-6 flex-grow mt-6">
            <label className="block text-sm sm:text-base font-semibold text-black">
              {t('Select Facebook page')}:
            </label>
            <div className="relative w-full max-w-xs sm:max-w-sm">
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="appearance-none w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[rgb(255,118,14,var(--tw-border-opacity,1))]"
              >
                <option value="">{t('Select a Page')}</option>
                {connectedPages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </select>
              <DownOutlined
                style={{ fontSize: 16 }}
                className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
              />
            </div>

            <label className="block text-sm sm:text-base font-semibold text-black mb-2">
              {t('Posting time')}:
            </label>
            <input
              type="datetime-local"
              value={postingTime}
              min={dayjs().format('YYYY-MM-DDTHH:mm')}
              onChange={(e) => setPostingTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[rgb(255,118,14,var(--tw-text-opacity,1))] appearance-none"
            />
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 text-sm sm:text-base md:text-lg font-semibold border-2 border-[rgb(58,166,202,var(--tw-border-opacity,1))] text-[rgb(58,166,202,var(--tw-text-opacity,1))] rounded-md hover:bg-[rgb(58,166,202,var(--tw-border-opacity,1))]/80 hover:text-white"
            onClick={handlePrevious}
          >
            {t('Previous')}
          </button>

          {step === 2 ? (
            <button
              className={`px-4 py-2 text-sm sm:text-base md:text-lg font-semibold border-2 rounded-md ${selectedPage
                ? 'bg-[rgb(3,105,94,var(--tw-border-opacity,1))] text-white hover:bg-[rgb(3,105,94,var(--tw-border-opacity,1))]/90 border-[rgb(3,105,94,var(--tw-border-opacity,1))]'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed border-gray-300'
                }`}
              onClick={handleSchedulepost}
              disabled={!selectedPage}
            >
              {t('Schedule')}
            </button>
          ) : (
            <button
              className="px-4 py-2 text-sm sm:text-base md:text-lg font-semibold border-2 bg-[rgb(3,105,94,var(--tw-bg-opacity,1))] text-white rounded-md hover:bg-[rgb(3,105,94,var(--tw-bg-opacity,1))]/90 border-[rgb(3,105,94,var(--tw-border-opacity,1))]"
              onClick={handleNext}
            >
              {t('Next')}
            </button>
          )}
        </div>
      </div>
    </div>
  );

};

export default ScheduleFacebookPost;


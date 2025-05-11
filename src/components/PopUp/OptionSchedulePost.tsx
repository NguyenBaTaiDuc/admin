import FileTextOutlined from '@ant-design/icons/lib/icons/FileTextOutlined';
import RobotOutlined from '@ant-design/icons/lib/icons/RobotOutlined';
import { CloseOutlined } from '@ant-design/icons';
import React, { useEffect, useRef} from 'react';
import { useTranslation } from 'react-i18next';
type PopUpProps = {
  onClose: () => void;
  onChooseAIPost: () => void;
  onChooseCreateandSchedulePost: () => void;
};
const OptionSchedulePost: React.FC<PopUpProps> = ({
  onClose,
  onChooseAIPost,
  onChooseCreateandSchedulePost
}) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div
        ref={modalRef}
        className="relative bg-white w-full max-w-[800px] mx-4 p-6 rounded-lg shadow-lg flex flex-col justify-center items-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
          aria-label="Close"
        >
          <CloseOutlined style={{ fontSize: 20 }} />
        </button>

        <h1 className="text-base lg:text-lg text-[rgb(255,118,14)] font-semibold mb-4 text-center">
          {t("Which option would you like to choose?")}
        </h1>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 w-full">
          <button
            onClick={() => {
              onChooseAIPost();
              onClose();
            }}
            className="w-full lg:w-1/2 h-[180px] sm:h-[200px] text-sm lg:text-base font-semibold px-4 sm:px-6 py-3 sm:py-4 
              hover:border-[rgb(255,118,14)] hover:bg-[rgb(255,118,14)]/5 hover:-translate-y-1 transition-all duration-200 
              flex flex-col justify-start items-start gap-2 sm:gap-4 rounded-lg border border-gray-200 text-left"
          >
            <RobotOutlined
              style={{
                color: 'rgb(255,118,14)',
                fontSize: '24px',
              }}
              className="lg:!text-[32px]"
            />
            <p className="text-sm lg:text-base">{t("Schedule AI-Generated Post")}</p>
            <p className="text-xs lg:text-sm font-light">
              {t("Option to retrieve the AI-generated article content for you")}:
            </p>
          </button>
          <button
            onClick={() => {
              onChooseCreateandSchedulePost();
              onClose();
            }}
            className="w-full lg:w-1/2 h-[180px] sm:h-[200px] text-sm lg:text-base font-semibold px-4 sm:px-6 py-3 sm:py-4 
              hover:border-[rgb(255,118,14)] hover:bg-[rgb(255,118,14)]/5 hover:-translate-y-1 transition-all duration-200 
              flex flex-col justify-start items-start gap-2 sm:gap-4 rounded-lg border border-gray-200 text-left"
          >
            <FileTextOutlined
              style={{
                color: 'rgb(255,118,14)',
                fontSize: '24px',
              }}
              className="lg:!text-[32px]"
            />
            <p className="text-sm lg:text-base">{t("Create and Schedule a New Post")}</p>
            <p className="text-xs lg:text-sm font-light">
              {t("Option to create content in your own way")}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
export default OptionSchedulePost;

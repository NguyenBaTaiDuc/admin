import LeftOutlined from '@ant-design/icons/lib/icons/LeftOutlined';
import RightOutlined from '@ant-design/icons/lib/icons/RightOutlined';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type PopUpProps = {
  onClose: () => void;
};

const Schedule_AI_Generate_Post: React.FC<PopUpProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const modelRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelRef.current && !modelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={modelRef}
      className=" p-4 sm:p-6 rounded-lg w-fit max-w-[90%] sm:max-w-[480px] lg:max-w-[440px] mx-auto flex flex-col justify-center items-center">
        
      <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-[rgb(255,118,14)] font-semibold text-center">
        {t("Select a post")}
      </h1>

      <div className="flex items-center justify-center flex-row gap-2 mt-4 text-sm sm:text-base">
        <LeftOutlined
          style={{ fontSize: '24px' }}
          className="lg:!text-[32px] opacity-50 cursor-not-allowed"
        />
        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl text-center leading-relaxed">
          {t("There are no AI-generated posts yet.Go to the")}{' '}
          <span
            onClick={() => navigate('/ai_content_creation')}
            className="text-[rgb(58,166,202)] cursor-pointer hover:underline text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl"
          >
            {t("AI Generate Post page to create.")}
          </span>
        </p>
        <RightOutlined
          style={{ fontSize: '24px' }}
          className="lg:!text-[32px] opacity-50 cursor-not-allowed"
        />
      </div>

     
    </div>
  );
};

export default Schedule_AI_Generate_Post;

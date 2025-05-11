import React, { useEffect, useRef } from 'react';
import imageface from '../PopUp/images/iconFacebook.svg';
import imageinsta from '../PopUp/images/iconInstagram.svg';
import { useTranslation } from 'react-i18next';

type PopUpProps = {
  onClose: () => void;
  onChooseFacebookandIG: (platform: 'Facebook' | 'Instagram') => void;
};

const CreateAndSchedulePost: React.FC<PopUpProps> = ({ onClose, onChooseFacebookandIG }) => {
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

  const { t } = useTranslation();

  return (
    <div
      ref={modalRef}
      className="flex flex-col p-4 sm:p-6 md:p-8 max-w-full sm:max-w-[480px] md:max-w-[600px] mx-auto"
    >
      <h1 className="text-orange-500 text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-6 text-center">
        {t('Schedule Post')}
      </h1>
      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-primary-black text-center">
        {t('Which social platform do you want AI to create posts for?')}
      </h2>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-6">
        <div
          onClick={() => {
            onChooseFacebookandIG('Facebook');
            onClose();
          }}
          className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 border-gray-200 rounded-md cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-orange-500/90 w-full sm:w-auto justify-center"
        >
          <img
            src={imageface}
            alt="Facebook"
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
          />
          <span className="text-sm sm:text-base md:text-lg">Facebook</span>
        </div>

        <div
          onClick={() => {
            onChooseFacebookandIG('Instagram');
            onClose();
          }}
          className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 border-gray-200 rounded-md cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-orange-500/90 w-full sm:w-auto justify-center"
        >
          <img
            src={imageinsta}
            alt="Instagram"
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
          />
          <span className="text-sm sm:text-base md:text-lg">Instagram</span>
        </div>
      </div>
    </div>
  );
};

export default CreateAndSchedulePost;

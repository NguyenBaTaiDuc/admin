import React from 'react'
import { useTranslation } from 'react-i18next';

interface FacebookPage {
  id: string;
  name: string;
}

interface Props {
  pages: FacebookPage[];
  onClose: () => void;
  onSelectPage: (page: FacebookPage) => void;
}

const SelectFacebookPage: React.FC<Props> = ({ onClose, pages, onSelectPage }) => {
  const { t } = useTranslation();
  return (
    <div className='fixed inset-0 bg-black/30 bg-opacity-30  z-50 flex items-center justify-center'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-2xl p-4 sm:p-6 relative mx-4'>
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-500 hover:text-black'
        >
          ✕
        </button>
        <h3 className='text-xl font-semibold mb-4'>
          {t("Select Page")}
        </h3>
        <div className='space-y-4 max-h-[400px] overflow-y-auto'>
          {pages.map((page) => (
            <div key={page.id} className='flex items-center justify-between border border-gray-100 rounded-lg p-4 bg-white shadow-sm transition duration-200'>
              <div className='items-center'>
                <p className='font-semibold text-[10px] sm:text-base text-center'>{page.name}</p>
              </div>
              <button
                onClick={() => onSelectPage(page)}
                className='bg-primary text-white px-3 py-1 rounded text-sm sm:text-base hover-gbsidebar'
              >
                {t("View Posts")}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default SelectFacebookPage
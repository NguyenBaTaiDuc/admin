import React from 'react'
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
  return (
    <div className='fixed inset-0 bg-black/30 bg-opacity-30  z-50 flex items-center justify-center'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative'>
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-500 hover:text-black'
        >
          ✕
        </button>
        <h3 className='text-xl font-semibold mb-4'>Select Page:</h3>
        <div className='space-y-4 max-h-[400px] overflow-y-auto'>
          {pages.map((page) => (
            <div key={page.id} className='flex items-center justify-between border-[0.5px] border-gray-100 rounded-lg p-4 bg-white shadow-sm transition duration-200'>
              <div className=' items-center'>
                <p className='font-semibold text-center'>{page.name}</p>
              </div>
              <button
                onClick={() => onSelectPage(page)}
                className='  bg-primary text-white px-4 py-1 rounded hover-gbsidebar'
              >
                View Posts
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SelectFacebookPage
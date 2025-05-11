import Pop_up_Schedule from '@/components/PopUp/Pop_up_Schedule';
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SettingPage = () => {
  const { t } = useTranslation();
  const [showModel, setshowModel] = useState(false);
  return (
    <div className='w-full h-screen sm:h-auto min-h-[calc(100vh-35px)]  bg-white rounded-none sm:rounded-xl shadow-none sm:shadow-xl p-4 sm:p-6 md:p-8 pt-6 sm:pt-0 sm:pb-4'>
      {/* show pop up learn how to set up */}
      {
        showModel && (
          <div className='fixed inset-0 bg-black-50 bg-black/30 z-40 flex items-center justify-center'>
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
      <div className=' sm: pt-10'>
        <div className=' color-primary w-max font-montserrat py-2 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl color-primary font-semibold flex items-center gap-2'>
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
            onClick={() => { }}
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
    </div>
  )
}

export default SettingPage
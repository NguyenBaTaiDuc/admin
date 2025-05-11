import CreateMarketing from '@/components/CreateMarketing';
import FacebookOutlined from '@ant-design/icons/lib/icons/FacebookOutlined';
import InstagramOutlined from '@ant-design/icons/lib/icons/InstagramOutlined';
import LinkedinOutlined from '@ant-design/icons/lib/icons/LinkedinOutlined';
import SettingOutlined from '@ant-design/icons/lib/icons/SettingOutlined';
import  { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from "@/services/auth_context";
import CreateMarketingPlan from '@/components/PopUp/CreateMarketingPlan';
const GenerateMarketingPlan = () => {
      const [IsShowCreateMarketingPlanPopup, setIsShowCreateMarketingPlanPopup] = useState(false);
        const {isLogin} = useContext(AuthContext);
    const { t } = useTranslation();
    const [showAdvencedSettings, setShowAdvancedSettings] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const handlePlatformSelect = (platform: string) => {
        setSelectedPlatform(platform);
    };

    return (
        <div className="w-full h-screen sm:h-auto min-h-[calc(100vh-35px)]  bg-white rounded-none sm:rounded-xl shadow-none sm:shadow-xl p-4 sm:p-6 md:p-8 pt-6 sm:pt-0 sm:pb-4">
            <div className='pt-10 sm:pt-2 md:pt-0 text-xs xs:text-[12px] sm:text-[14px] base:text-base lg:text-base'>
                <CreateMarketing />
            </div>

            <hr className='w-full border-[#e5e7eb] mt-1' />
            <h2 className="font-bold py-2 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl color-primary">
                {t("Which social platform do you want AI to create posts for?")}
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 py-1">

                <div className="flex flex-col sm:flex-row gap-4 py-1">
                    <button
                        className={`px-4 py-2 rounded cursor-pointer flex flex-row items-center justify-center gap-1 border border-gray-300
                        ${selectedPlatform === 'Facebook' ? 'bg-primary text-white font-bold' : 'text-gray-600 bg-white'}`}
                        onClick={() => handlePlatformSelect('Facebook')}
                    >
                        <FacebookOutlined style={{ fontSize: '20px' }} />
                        Facebook
                    </button>
                    {/* Các button khác tương tự */}
                </div>

                <button
                    className={`px-4 py-2 rounded cursor-pointer flex flex-row items-center justify-center gap-1 border border-gray-300
                     ${selectedPlatform === 'Instagram' ? 'bg-primary text-white font-bold' : 'text-gray-600 bg-white'}`}
                    onClick={() => handlePlatformSelect('Instagram')}
                >
                    <InstagramOutlined
                        style={{ fontSize: '20px' }}
                    /> Instagram
                </button>
                <button
                    className={`px-4 py-2 rounded cursor-pointer flex items-center justify-center gap-1 border border-gray-300
                 ${selectedPlatform === 'Instagram' ? 'bg-primary text-white font-bold' : 'text-gray-600 bg-white'}`}
                    onClick={() => handlePlatformSelect('Instagram')}
                >
                    <span className="-translate-x-[6px] flex items-center gap-1">
                        <LinkedinOutlined style={{ fontSize: '20px' }} />
                        LinkedIn
                    </span>
                </button>

            </div>
            {selectedPlatform && (
                <div className="">
                    <label className="block mb-2 font-bold color-primary">
                        {t("Which pages do you want to generate for the marketing plan?")}
                    </label>
                    <select className="w-full max-w-xs border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="quantus">Quantus Learn</option>
                        <option value="academy">Quantus Learn</option>
                        <option value="community">Hephaestus Technology & Consulting</option>
                    </select>
                </div>
            )}
            <div className="btn-settings inline-flex text-[17px] cursor-pointer hover:underline items-center gap-2 pt-3">
                <SettingOutlined
                    style={{ fontSize: 15, fontWeight: 'light' }} />
                <p onClick={() => setShowAdvancedSettings(prev => !prev)}>
                    {t("Advanced Settings")}
                </p>
            </div>
            {showAdvencedSettings && (
                <div className="flex flex-col sm:flex-row gap-4 mt-5">
                    {/* Business Type */}
                    <div className="flex flex-row items-center gap-2">
                        <label className="color-primary font-bold mb-1 text-[17px]">
                            {t("Business Type:")}
                        </label>
                        <input
                            type="text"
                            className="w-[150px] p-2 border border-gray-300 rounded-md"
                            placeholder={t("e.g. E-commerce")}
                        />
                    </div>
                    {/* Language */}
                    {/* Language */}
                    <div className="flex flex-row items-center gap-2">
                        <label className="color-primary font-bold mb-1 text-[17px]">
                            {t("Language")}
                        </label>
                        <div className="relative w-40 ">
                            <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500 pointer-events-none">
                                {t("Language")}
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded px-3 py-1.5 pt-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-black transition duration-150 ease-in-out"
                            >
                                <option>English</option>
                                <option>Vietnamese</option>
                                <option>Spanish</option>
                                <option>French</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
            <button 
            onClick={() => {
                if(!isLogin){
                    {
                     setIsShowCreateMarketingPlanPopup(true);
                    }
                }
            }}
            className="flex ml-auto px-2  mt-6 py-2 text-lg w-max self-end text-white font-medium rounded-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 items-center gap-2">
                {t("Generate Post Content with AI")}✨
            </button>
            {IsShowCreateMarketingPlanPopup && (
            <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center">
              <CreateMarketingPlan
                onClose={() => setIsShowCreateMarketingPlanPopup(false)}
              />
            </div>
          )}
        </div>
       
    );
};

export default GenerateMarketingPlan;
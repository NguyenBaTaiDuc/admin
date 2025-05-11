import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logoChowBusiness.svg";
import image from "../assets/iconEN.png";
import imageVN from "../assets/icons8-vietnam-48.png";
import StepBackwardOutlined from "@ant-design/icons/lib/icons/StepBackwardOutlined";
import GlobalOutlined from "@ant-design/icons/lib/icons/GlobalOutlined";
import RightOutlined from "@ant-design/icons/lib/icons/RightOutlined";
import MergeOutlined from "@ant-design/icons/lib/icons/MergeOutlined";
import HomeOutlined from "@ant-design/icons/lib/icons/HomeOutlined";
import SettingOutlined from "@ant-design/icons/lib/icons/SettingOutlined";
import './side_bar.css';
import UnorderedListOutlined from "@ant-design/icons/lib/icons/UnorderedListOutlined";
import CloseOutlined from "@ant-design/icons/lib/icons/CloseOutlined";
import { useTranslation } from "react-i18next";
import { AndroidOutlined } from "@ant-design/icons";
import CustomTooltip from "./PopUp/Tooltip";
// import '../i18n'
interface SideBarProps {
  onToggleCollapse: (collapsed: boolean) => void;
}
const Sidebar: React.FC<SideBarProps> = ({ onToggleCollapse }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSocialOpen, setSocialOpen] = useState(false);
  // side bar cho
  const [isMobileTabbarOpen, setIsMobileTabberOpen] = useState(false);
  // ẩn hiện tab bar trên mobile
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onToggleCollapse(newState);
  };

  //đổi ngôn ngữ
  const { t, i18n } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false)

  const changeLanguage = (lng: 'en' | 'vi') => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  return (
    //button side bar khi ở màn hình mobile
    <>
      {/* Button menu trên mobile */}
      {/* Nút mở menu - chỉ hiện khi sidebar đang ĐÓNG và là mobile */}
      {!isMobileTabbarOpen && (
        <div className="sm:hidden fixed top-4 left-4 z-50 bg-amber-300 rounded-md border-2 border-amber-500 flex items-center justify-center w-10 h-10">
          <button onClick={() => setIsMobileTabberOpen(true)}>
            <UnorderedListOutlined style={{ fontSize: 28, color: "white" }} />
          </button>
        </div>
      )}

      {isMobileTabbarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
          onClick={() => setIsMobileTabberOpen(false)}
        >

        </div>
      )
      }
      <div
        className={`
             fixed top-0 left-0 h-screen p-4 bg-custom-sidebar z-40
             transform sm:transition-[width] transition-transform duration-500 ease-in-out
             ${isMobileTabbarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0
             ${isCollapsed ? "w-17" : "w-72"}
             rounded-tr-xl rounded-br-xl
             flex flex-col justify-between
             text-sm sm:text-base md:text-[17px] lg:text-[18px]
         `}
      >


        {/* Close button on mobile */}
        {isMobileTabbarOpen && (
          <div className="flex justify-end mb-4 sm:hidden">
            <button
              onClick={() => setIsMobileTabberOpen(false)}
              className="flex items-center justify-center w-10 h-10 bg-primary rounded-md hover:bg-amber-400 transition-colors"
            >
              <CloseOutlined
                style={{ color: 'white' }}
                className="text-white text-xl" />
            </button>
          </div>
        )}
        {/* Top Section: Close Icon + Content */}
        <div className="flex flex-col flex-end">
          {/* Toggle Icon aligned right */}
          <div className={`hidden sm:flex mb-2 ${isCollapsed ? 'justify-center' : 'justify-end'}`}>
            <StepBackwardOutlined
              onClick={toggleSidebar}
              style={{
                color: "white",
                fontSize: "25px",
                cursor: "pointer",
                transform: isCollapsed ? "rotate(180deg)" : "none",
                transition: "transform 0.3s ease",
              }}
            />
          </div>
          {/* Logo */}
          <div className={`transition-all duration-300 ${isMobileTabbarOpen
            ? "mt-0"
            : isCollapsed
              ? "mt-20"
              : "mt-4"
            }`}>
            {!isCollapsed && (
              <div className="flex justify-start mb-4 pt-10">
                <img src={logo} alt="Logo" className="w-68 h-auto" />
              </div>
            )}
          </div>
          {/* Menu */}
          <nav className={`flex flex-col w-full items-start space-y-5 ${isMobileTabbarOpen ? "pb-70" : ""}  ${isCollapsed ? 'items-center justify-center flex pt-15 ' : ''} `}>
            <NavLink
              className={`relative group w-full ${isCollapsed ? 'items-center justify-center flex ' : 'pl-6'} h-10 flex items-center gap-2 rounded-md cursor-pointer hover-gbsidebar`}
              to="/"
            >
              <CustomTooltip
                defaultColor="white"
                className="absolute w-5 h-5 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                placement="bottomRight"
                hoverColor="rgba(253,206,28,0.733)/90"
                customStyle={{ fontSize: '14px', color: 'white' }}
                title={"Manage AI Content"}
                description={"Leverage AI tools to generate, manage, and optimize content for marketing, promotions, and customer engagement"} />
              <HomeOutlined
                style={{ color: "white" }}
                className={`text-white ${isCollapsed ? "text-2xl" : "text-xl"}`}
              />
              {!isCollapsed && <p className="text-white text-sm sm:text-base md:text-[17px] lg:text-[18px]">{t('home')}</p>}
            </NavLink>

            <NavLink
              className={`relative group w-full ${isCollapsed ? 'items-center justify-center flex' : 'pl-6'} h-10 flex items-center gap-2 rounded-md cursor-pointer hover-gbsidebar`}
              to="/ai_content_creation"
            >
              <CustomTooltip
                defaultColor="white"
                className="absolute w-5 h-5 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                placement="bottomRight"
                hoverColor="rgba(253,206,28,0.733)/90"
                customStyle={{ fontSize: '14px', color: 'white' }}
                title={"Manage AI Content"}
                description={"Leverage AI tools to generate, manage, and optimize content for marketing, promotions, and customer engagement"} />
              <AndroidOutlined
                style={{ color: "white" }}
                className={`text-white ${isCollapsed ? "text-2xl" : "text-xl"}`}
              />
              {!isCollapsed && <p className="text-white text-sm sm:text-base md:text-[17px] lg:text-[18px]">{t('ai_content')}</p>}
            </NavLink>

            <div className="flex-col w-full items-center gap-2 cursor-pointer"
            >
              <div className="flex items-center justify-between w-full cursor-pointer  rounded-md hover-gbsidebar" onClick={() => setSocialOpen(!isSocialOpen)}>
                <div
                  className={`relative group flex items-center w-full h-10 cursor-pointer rounded-md hover-gbsidebar ${!isCollapsed ? ' pl-6 gap-2' : 'pr-3 ml-[-2px]'}`}
                  onClick={() => setSocialOpen(!isSocialOpen)}
                >
                  {/* Icon Warning hiển thị khi hover */}
                  <CustomTooltip
                    defaultColor="white"
                    className="absolute w-5 h-5 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    placement="bottomRight"
                    hoverColor="rgba(253,206,28,0.733)/90"
                    customStyle={{ fontSize: '14px', color: 'white' }}
                    title={"Manage Social Media"}
                    description={"Oganize and manage affiliate links to increase revenue through partnerships and collaborations"} />
                  {/* Icon chính */}
                  <GlobalOutlined
                    style={{ color: 'white' }}
                    className={`text-white ${isCollapsed ? " text-2xl" : "text-xl"}`} />

                  {/* Text */}
                  {!isCollapsed && (
                    <p className="text-white text-sm sm:text-base md:text-[17px] lg:text-[18px]">{t('Social Media')}</p>
                  )}
                </div>
                {/* Xoay icon theo trạng thái */}
                {!isCollapsed && (
                  <RightOutlined
                    className={`text-white transition-transform ml-15  duration-300 ease-in-out ${isSocialOpen ? "rotate-90" : "rotate-0"
                      }`}
                    style={{ fontSize: "12px", color: 'white' }}
                  />
                )}
              </div>
              {isSocialOpen && !isCollapsed && (
                <div className="flex flex-col mt-4 space-y-1 w-full px-2">
                  <NavLink
                    to="/Media_Management"
                    className=" pl-12 w-full block text-white text-sm sm:text-base md:text-[17px] lg:text-[18px] hover-gbsidebar rounded-md py-2 px-2"
                  >
                    {t('Media Management')}
                  </NavLink>
                  <NavLink
                    to="/post-schedule"
                    className="w-full block text-white text-sm sm:text-base md:text-[17px] lg:text-[18px] hover-gbsidebar rounded-md py-2 px-2 pl-12"
                  >
                    {t('Post Schedule')}
                  </NavLink>
                </div>

              )}

            </div>
            <NavLink
              className={`relative group w-full ${isCollapsed ? 'justify-center' : 'pl-6'} h-10 flex items-center gap-2 rounded-md cursor-pointer hover-gbsidebar`}
              to="/TrafficGrowCenter"
            >
              <CustomTooltip
                defaultColor="white"
                className="absolute w-5 h-5 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                placement="bottomRight"
                hoverColor="rgba(253,206,28,0.733)/90"
                customStyle={{ fontSize: '14px', color: 'white' }}
                title={"Manage Traffic Grow Center"}
                description={"Oganize and manage affiliate links to increase revenue through partnerships and collaborations"} />
              <MergeOutlined
                style={{ color: "white" }}
                className={`text-white ${isCollapsed ? "text-2xl" : "text-xl"}`}
              />
              {!isCollapsed && <p className="text-white text-sm sm:text-base md:text-[17px] lg:text-[18px]">{t('Traffic Grow Center')}</p>}
            </NavLink>

            <NavLink
              className={`relative group w-full ${isCollapsed ? 'items-center justify-center flex' : 'pl-6'} h-10 flex items-center gap-2 rounded-md cursor-pointer hover-gbsidebar`}
              to="/setting"
            >
              <CustomTooltip
                defaultColor="white"
                className="absolute w-5 h-5 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                placement="bottomRight"
                hoverColor="rgba(253,206,28,0.733)/90"
                customStyle={{ fontSize: '14px', color: 'white' }}
                title={"Manage Settings"}
                description={"Adjust content settings, including permissions, preference, and system configurations, to enhance content management efficiency"} />
              <SettingOutlined
                style={{ color: "white" }}
                className={`text-white ${isCollapsed ? "text-2xl" : "text-xl"}`}
              />
              {!isCollapsed && <p className="text-white text-sm sm:text-base md:text-[17px] lg:text-[18px]">{t('Settings')}</p>}
            </NavLink>
          </nav>
        </div>
        {/* Bottom: Language Selector */}
        <div
          className={`relative w-full h-10 rounded-md cursor-pointer flex items-center gap-2 text-white text-sm mb-8 opacity-90 hover-gbsidebar transition-all duration-200
            ${isCollapsed ? 'justify-center ml-[-2px]' : 'pl-8'}
             `}
          onClick={() => {
            // chỉ cho phép mở dropdown khi sidebar đang mở
            if (!isCollapsed) {
              setIsLangOpen(!isLangOpen);
            }
          }}
        >
          <img src={image} alt="Language Icon" className="w-6 h-6" />

          {/* TEXT chỉ hiện khi sidebar mở */}
          {!isCollapsed && <span className="text-sm sm:text-base md:text-[17px] lg:text-[18px]">{t('Language')}</span>}

          {/* DROPDOWN chỉ hiện khi sidebar mở + lang open */}
          {!isCollapsed && isLangOpen && (
            <div className="absolute bottom-full mb-2 left-0 w-full bg-primary text-white rounded-md shadow-md z-50">
              <button
                onClick={() => changeLanguage('en')}
                className="flex items-center w-full text-left px-8 py-2 hover-gbsidebar text-sm sm:text-base md:text-[17px] lg:text-[18px]"
              >
                <img src={image} alt="EN" className="w-6 h-6 mr-3 " />
                English
              </button>
              <button
                onClick={() => changeLanguage('vi')}
                className="flex items-center w-full text-left px-7.5 py-2 hover-gbsidebar text-sm sm:text-base md:text-[17px] lg:text-[18px]"
              >
                <img src={imageVN} alt="VI" className="w-7 h-7 mr-3" />
                Tiếng Việt
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );

};
export default Sidebar;

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/side_bar";
import "../index.css"
const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainPaddingLeft = isCollapsed ? "sm:pl-[68px]" : "sm:pl-[288px]"; // 17 * 4 = 68px | 72 * 4 = 288px

  return (
    <div className="h-screen flex bg-gray-100 sm:bg-gray-100 overflow-y-scroll custom-scrollbar">
      <Sidebar  onToggleCollapse={setIsCollapsed}/>
      <main className={`flex-1 transition-all duration-300 ease-in-out ${mainPaddingLeft} `}>
      <div className="w-full h-screen sm:h-full py-0 px-0 sm:py-5 sm:px-5">
          <Outlet/>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;

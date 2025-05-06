import { useContext } from "react";
import { StateContext } from "./contexts/StateContext";
import { Route, Routes } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import { Spin } from "antd";
import HomePage from "./pages/HomePage";
import AIContentPage from "./pages/AIContentPage";
import SettingPage from "./pages/SettingPage";
import TrafficGrowCenterPage from "./pages/TrafficGrowCenterPage";
import Media_Management_page from "./pages/Media_Management_page";
import PostSchedulePage from "./pages/PostSchedulePage";
import"../src/i18n"
import MainLayout from "./Layout/MainLayout";
import Welcome_AI_Strategy from "./pages/Welcome_AI_Strategy";
import GenerateMarketingPlan from "./pages/Generate_MarketingPlan_automatic";
import ChatWithAI from "./pages/ChatWithAI";
import UploadContentForAI from "./pages/UploadContentForAI";
function App() {
  const { loading } = useContext(StateContext);
  return (
    <div style={{ position: "relative" }}>
      <>
        <Routes>
          <Route path='/' element={<MainLayout/>}>
          <Route index element={<HomePage/>}/>
          <Route path = '/' element={<HomePage/>}/>
          <Route path="/ai_content_creation" element={<AIContentPage/>}/>
          <Route path ='Media_Management' element={<Media_Management_page/>}/>
          <Route path= 'post-schedule' element={<PostSchedulePage/>}/>
          <Route path='TrafficGrowCenter' element={<TrafficGrowCenterPage/>}/>
          <Route path='setting' element={<SettingPage/>}/>
          <Route path="/Welcome_Strategy" element={<Welcome_AI_Strategy/>}/>
          <Route path="/MarketingPlan_Automatic" element={<GenerateMarketingPlan/>}/>
          <Route path="/ChatWithAI" element={<ChatWithAI/>}/>
          <Route path="/UploadContentForAI" element={<UploadContentForAI/>}/>
          <Route path="*" element={<NotFoundPage/>}/>
          </Route>
        </Routes>
        {loading && (
          <div>
            <Spin />
          </div>
        )}
      </>
    </div>
  );
}
export default App;

import React from "react";
import { useNavigate } from 'react-router-dom';
import CustomTooltip from "@/components/PopUp/Tooltip";
import '../index.css'
import { useTranslation } from 'react-i18next';
const AIContentPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col px-8 justify-center bg-white items-center w-full sm:w-auto min-h-screen sm:min-h-[calc(100vh-35px)] rounded-none sm:rounded-xl shadow-none sm:shadow-xl">

      <h1 className="font-bold py-2 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl color-primary font-montserrat text-center sm:text-base pb-6 ">
        {t("How Do You Want AI to Create Your Content?")}
      </h1>

      <div className="flex flex-col lg:flex-row  justify-center items-center gap-4 w-full">

        <div className="relative w-full base:flex-1 lg:w-auto mb-1">
          <div
            onClick={() => navigate('/Welcome_Strategy')}
            className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold px-4 py-3 border-2 rounded-md flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer border-[rgb(3,105,94,1)] bg-transparent text-[rgb(3,105,94,1)]  hover:bg-[rgb(3,105,94,1)]/10 btn-mobile "
          >
            <CustomTooltip
              defaultColor="black"
              customStyle={{ fontSize: '15px' }}
              hoverColor="rgb(3,105,94,var(--tw-text-opacity,1))/90"
              title={t("AI Generate")}
              description={t("AI will generate content based on the data you provide, along with sample content and initial foundations that shape the posts.")} />
            {t("Train my social media agent")}
          </div>
        </div>

        <div className="relative w-full base:flex-1 lg:w-auto">
          <div
            onClick={() => navigate('/MarketingPlan_Automatic')}
            className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl color-primary font-semibold px-4 py-3 border-2 border-primary hover:bg-[rgb(255,118,14,1)]/10 cursor-pointer rounded-md flex items-center justify-center gap-2 transition-all duration-300"
          >
            <CustomTooltip
              defaultColor="black"
              customStyle={{ fontSize: '15px' }}
              hoverColor="rgb(255,118 14,var(--tw-text-opacity,1))/90"
              title={t("AI Generate automatically")}
              description={t("By analyzing your industry, target audience, and provided data. AI can craft engaging and relevant posts that align with your business type")} />
            {t("Let Chow generate automatically")}
          </div>
        </div>
      </div>
    </div>

  );
};

export default AIContentPage;

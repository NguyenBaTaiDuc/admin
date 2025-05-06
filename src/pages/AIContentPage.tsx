import InfoCircleOutlined from "@ant-design/icons/lib/icons/InfoCircleOutlined";
import React from "react";
import { useNavigate } from 'react-router-dom';
import CustomTooltip from "@/components/PopUp/Tooltip";
import '../index.css'
const AIContentPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center bg-white items-center w-full sm:w-auto sm:pb-5 min-h-[calc(100vh-35px)]   rounded-none sm:rounded-xl shadow-none sm:shadow-xl">


      <h1 className="text-2xl md:text-xl lg:text-2xl font-montserrat text-center sm:text-base pb-4 ">
        How Do You Want AI to Create Your Content?
      </h1>

      <div className="flex flex-col justify-center items-center md:flex-row gap-4 w-full">
        <div className="relative w-full md:w-auto">
          <div
          onClick={()=> navigate('/Welcome_Strategy')}
            className="text-sm  sm:text-sm md:text-lg lg:text-xl text-[rgb(3,105,94,1)] font-semibold px-4 py-2 border-2 border-[rgb(3,105,94,1)] hover:bg-[rgb(3,105,94,1)]/10 cursor-pointer rounded-md  flex items-center justify-center gap-2 transition-all duration-300"
          >
            <CustomTooltip 
            defaultColor="black"
            customStyle={{fontSize: '15px'}}
            hoverColor="rgb(3,105,94,var(--tw-text-opacity,1))/90"
            title={"AI Generate"} 
            description={"AI will generate content based on the data you provide, along with sample content and initial foundations that shape the posts."} />
            Train my social media agent
          </div>
        </div>

        <div className="relative w-full md:w-auto">
          <div
          onClick={()=> navigate('/MarketingPlan_Automatic')}
            className="text-sm sm:text-sm md:text-lg lg:text-xl color-primary font-semibold px-4 py-2 border-2 border-primary hover:bg-[rgb(255,118,14,1)]/10 cursor-pointer rounded-md flex items-center justify-center gap-2 transition-all duration-300"
          >
             <CustomTooltip 
             defaultColor="black"
             customStyle={{fontSize: '15px'}}
             hoverColor="rgb(255,118 14,var(--tw-text-opacity,1))/90"
             title={"AI Generate automatically"} 
             description={"By analyzing your industry, target audience, and provided data. AI can craft engaging and relevant posts that align with your business type "} />
            Let Chow generate automatically
          </div>
        </div>
      </div>
    </div>

  );
};

export default AIContentPage;

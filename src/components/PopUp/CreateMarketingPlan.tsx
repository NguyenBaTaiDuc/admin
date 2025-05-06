import React from 'react';
import ScheduleOutlined from '@ant-design/icons/lib/icons/ScheduleOutlined';
import FieldTimeOutlined from '@ant-design/icons/lib/icons/FieldTimeOutlined';
import { useNavigate } from 'react-router-dom';
interface Props {
    onClose: () => void;
  }
const CreateMarketingPlan: React.FC<Props> = ({ onClose }) => {
    const navigate = useNavigate();
    return (
        <div className='w-full'>
            <div className=" w-96 text-center">
                <div className="mb-10">
                    <div className="flex items-center ">
                        <ScheduleOutlined
                            style={{ fontSize: '25px' }}
                            className="mr-2.5" />
                        <h2 className='text-base sm:text-lg font-semibold mb-4 text-black flex items-center pt-3'>POSTING SCHEDULE</h2>
                    </div>
                    <div className="flex items-center">
                        <FieldTimeOutlined
                            style={{ fontSize: '25px' }}
                            className="mr-2.5" />
                        <h2 className='flex items-center gap-2 text-sm sm:text-base' >Estimated Generation Time: 0 minutes</h2>
                    </div>
                </div>

            </div>
            <div className="flex justify-between w-full ">
                <button 
                onClick={() => navigate('/Welcome_Strategy')}
                className="w-full sm:w-max px-4 py-2 text-sm sm:text-lg font-semibold border-2 border-[rgb(58,166,202,var(--tw-border-opacity,1))] text-[rgb(58,166,202,var(--tw-text-opacity,1))] rounded-md hover:bg-[rgb(58,166,202,var(--tw-text-opacity,1))]/80 hover:text-white">
                    Cancel
                </button>
                <button 
                 onClick={() => {
                    // logic gì đó nếu cần
                    onClose(); // Đóng popup
                  }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded">
                    Generate Schedule Plan ✨
                </button>
            </div>

        </div>


    );
};

export default CreateMarketingPlan;
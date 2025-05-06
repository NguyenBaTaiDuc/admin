
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined'
import FileTextOutlined from '@ant-design/icons/lib/icons/FileTextOutlined'
import RobotOutlined from '@ant-design/icons/lib/icons/RobotOutlined'
import React, { useEffect, useRef, useState, } from 'react'
import ScheduleAIGeneratePost from './Schedule_AI_Generate_Post';

type PopUpProps = {
    onClose: () => void;
    onChooseAIPost: () => void;
    onChooseCreateandSchedulePost: () => void;
};


const OptionSchedulePost: React.FC<PopUpProps> = ({ onClose, onChooseAIPost, onChooseCreateandSchedulePost }) => {
    // mở pop up của Generate AI Post
    const [IsshowAIschedulepost, setIsshowAIchedulepost] = useState(false)
    //đóng mở pop up
    const [IsOpenPopup, setIsOpenPopup] = useState(true);
    // áp dụng nhấn bên ngoài tắt pop up
    const modalRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    if (!IsOpenPopup) return null;
    return (

        <div ref={modalRef} className='flex flex-col justify-center '>

            <h1 className='text-lg text-[rgb(255,118,14,var(--tw-text-opacity,1))] font-semibold mb-4 text-center'>
                Which option would you like to choose?
            </h1>
            <div className='flex items-center gap-4 justify-between'>
                <button
                    onClick={() => {
                        onChooseAIPost();
                        onClose();
                    }}
                    className='w-[380px] h-[200px] text-lg font-semibold px-6 py-4 
                    hover:border-[rgb(255,118,14,var(--tw-text-opacity,1))] hover:bg-[rgb(255,118,14,var(--tw-text-opacity,1))]/5 hover:-translate-y-1 transition-all duration-200 
                    flex flex-col justify-start items-start gap-4 rounded-lg border border-gray-200 text-left' >
                    <RobotOutlined style={{ color: 'rgb(255,118,14,var(--tw-text-opacity,1))', fontSize: 40 }} />
                    <p>Schedule AI-Generated Post</p>
                    <p className='text-sm font-light'>Option to retrieve the AI-generated article content for you</p>
                </button>
                <button 
                onClick={() => {
                    onChooseCreateandSchedulePost();
                    onClose();
                }}
                className='w-[380px] h-[200px] text-lg font-semibold px-6 py-4 
                    hover:border-[rgb(255,118,14,var(--tw-text-opacity,1))] hover:bg-[rgb(255,118,14,var(--tw-text-opacity,1))]/5 hover:-translate-y-1 transition-all duration-200 
                    flex flex-col justify-start items-start gap-4 rounded-lg border border-gray-200 text-left'>
                    <FileTextOutlined
                        style={{ color: 'rgb(255,118,14,var(--tw-text-opacity,1))', fontSize: 40 }} />
                    <p>Create and Schedule a New Post</p>
                    <p className='text-sm font-light'>Option to create content in your own way</p>
                </button>
            </div>
        </div>

    )
}

export default OptionSchedulePost
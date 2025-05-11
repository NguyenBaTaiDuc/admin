import React, { useEffect, useRef } from 'react';
import ScheduleOutlined from '@ant-design/icons/lib/icons/ScheduleOutlined';
import FieldTimeOutlined from '@ant-design/icons/lib/icons/FieldTimeOutlined';
import { CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface Props {
    onClose: () => void;
}
const CreateMarketingPlan: React.FC<Props> = ({ onClose }) => {
    const { t } = useTranslation();
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
    return (
        <div
            ref={modalRef}
            className='bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-2xl p-4 sm:p-6 relative mx-4'>
            <button
                onClick={onClose}
                className='absolute top-3 right-3 text-gray-500 hover:text-black'
            >
                <CloseOutlined />
            </button>
            <div className=" w-96 text-center">
                <div className="mb-10">
                    <div className="flex items-center ">
                        <ScheduleOutlined className="text-xl sm:text-2xl md:text-3xl mr-2.5" />
                        <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-4 text-black pt-3">
                           {t("POSTING SCHEDULE")}
                        </h2>                   
                     </div>
                    <div className="flex items-center">
                        <FieldTimeOutlined className="text-xl sm:text-2xl md:text-3xl mr-2.5" />

                        <h2 className="flex items-center gap-2 text-xs sm:text-sm md:text-base">
                            {t("Estimated Generation Time: 0 minutes")}
                        </h2>                 
                    </div>
                </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 w-full">
                <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base md:text-lg font-semibold border-2 border-[rgb(58,166,202,var(--tw-border-opacity,1))] text-[rgb(58,166,202,var(--tw-text-opacity,1))] rounded-md hover:bg-[rgb(58,166,202,var(--tw-border-opacity,1))]/80 hover:text-white transition-all duration-300"
                >
                    {t("Cancel")}
                </button>
                <button
                    onClick={() => {
                        onClose();
                        alert('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại..');
                    }}
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 hover:opacity-90"
                >
                    {t("Generate Schedule Plan")}✨
                </button>
            </div>
        </div>
    );
};

export default CreateMarketingPlan;
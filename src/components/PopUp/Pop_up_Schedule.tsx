import React, { useEffect, useRef, useState } from 'react'
import schedule1 from '../PopUp/images/Schedule_step_1.png';
import schedule2 from '../PopUp/images/Schedule_step_2.png';
import schedule3 from '../PopUp/images/Schedule_step_3.png';
import schedule4 from '../PopUp/images/Schedule_step_4.png';
import views from '../PopUp/images/ViewSCheduledPost_step_1.png'
import views2 from '../PopUp/images/Update_Delete_step_1.png'
import update2 from '../PopUp/images/Update_Step_2.png';
import update3 from '../PopUp/images/Update_Step_3.png';
import delete2 from '../PopUp/images/Delete_step_2.png'
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined';
import { useTranslation } from 'react-i18next';
const tabSteps = {
    Schedule: [
        {
            title: "Step 1: Select Post",
            image: schedule1,
            content: "Choose a post from the AI-generated list.",
        },
        {
            title: "Step 2: Input content and image_url",
            image: schedule2,
            content: "Set content and image_url",
        },
        {
            title: "Step 3: Choose page and set time",
            image: schedule3,
            content: "Choose page and set time",
        },
        {
            title: "Step 4: Confirm",
            image: schedule4,
            content: "Confirm the scheduled post.",
        }
    ],
    View: [
        {
            title: "Step 1: Select page",
            image: views,
            content: "Select a page with a previously scheduled post",
        },
        {
            title: "Step 2: Select a post",
            image: views2,
            content: "Select the article you want to view details"
        },
    ],
    Update: [
        {
            title: "Step 1: Choose a post",
            image: views2,
            content: "Select a post from the calendar"
        },
        {
            title: "Step 2: Update new content",
            image: update2,
            content: "Enter new content to update"
        },
        {
            title: "Step 3: Confirm",
            image: update3,
            content: "Click 'save changes'to save changes"
        },
    ],
    Delete: [
        {
            title: "Step 1: Choose a post",
            image: views2,
            content: "Select a post from the calendar"
        },
        {
            title: "Step 2: Confirm",
            image: delete2,
            content: "Click 'Delete'to delete scheduled post"
        },
    ]
} as const;

type PopUpProps = {
    onClose: () => void;
};
type TabName = keyof typeof tabSteps;
const Pop_up_Schedule: React.FC<PopUpProps> = ({ onClose }) => {
    const { t } = useTranslation();
    //đóng mở pop up
    const [IsOpenPopup] = useState(true);
    const modalRef = useRef<HTMLDivElement | null>(null)

    // áp dụng nhấn bên ngoài tắt pop up
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

  

    //settting pop up
    const tabName = Object.keys(tabSteps) as TabName[];
    const [StepIndex, setStepIndex] = useState(0);
    const [currentTab, setCurrentTab] = useState<TabName>(tabName[0]);

    const steps = tabSteps[currentTab];
    const currentStep = steps[StepIndex];
      if (!IsOpenPopup) return null;

    const goNext = () => {
        if (StepIndex < steps.length - 1) setStepIndex((s) => s + 1);
    };
    const goPrev = () => {
        if (StepIndex > 0) setStepIndex((s) => s - 1);
    };
    const switchtab = (tab: TabName) => {
        setCurrentTab(tab);
        setStepIndex(0);
    }

    //hiển thị nút done ở bước cuói
    const isLastStep = StepIndex === steps.length - 1;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center w-full h-full bg-black/30 ">
            <div
                ref={modalRef}
                className="relative w-[90vw] h-auto sm:w-[360px] md:w-[640px] lg:w-[900px] lg:h-[600px] xl:w-[1149px] xl:h-[658px] bg-white overflow-hidden rounded-lg p-4 flex flex-col justify-between">
                {/* Close Button - đặt trên cùng bên phải */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl z-10"
                >
                    <CloseOutlined />
                </button>
                {/* Tab Bar - dưới nút X */}
                <div className=" flex justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 pt-6 sm:pt-8 md:pt-10 w-full  max-w-[320px] sm:max-w-[480px] md:max-w-[640px] lg:max-w-[800px] xl:max-w-[1000px] mx-auto">
                    {tabName.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => switchtab(tab)}
                            className={`font-medium ${tab === currentTab
                                ? "text-[rgb(58,166,202,var(--tw-text-opacity,1))] py-1 sm:py-2 px-2 sm:px-4  text-sm sm:text-base md:text-lg lg:text-xl  border-b-2 border-[rgb(58,166,202,var(--tw-text-opacity,1))]"
                                : "text-gray-500 text-base sm:text-base md:text-lg lg:text-xl"
                                }`}
                        >
                            {t(tab)}
                        </button>
                    ))}
                </div>
                <hr className='w-[90%] ml-15 text-gray-300 mb-4 ' />
                {/* Content */}
                <div className="flex-grow w-full px-4 sm:px-6 md:px-10 xl:px-12 flex flex-col justify-start">
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-orange-600 mb-2 text-center sm:text-left">
                        {t(currentStep.title)}
                    </h2>

                    <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light mb-4 text-center sm:text-left">
                        {t(currentStep.content)}
                    </p>

                    <img
                        src={currentStep.image}
                        alt="Step Illustration"
                        className="
      mx-auto
      w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%]
      aspect-[5/3] max-h-[300px] sm:max-h-[340px] md:max-h-[380px] lg:max-h-[360px] xl:max-h-[360px]
      object-contain mb-4
    "
                    />
                </div>


                {/* Navigation */}
                <div className="flex flex-col sm:flex-row justify-end items-center sm:items-end gap-3 sm:gap-4 mt-auto px-4 sm:px-6 md:px-10">
                    {StepIndex > 0 && (
                        <button
                            onClick={goPrev}
                            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base font-semibold border-2 border-cyan-600 text-cyan-600 rounded-md hover:bg-cyan-600 hover:text-white transition"
                        >
                            {t('Previous')}
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (isLastStep) {
                                onClose();
                            } else {
                                goNext();
                            }
                        }}
                        className={`w-full sm:w-auto px-4 py-2 text-sm sm:text-base font-semibold text-white rounded-md transition duration-200 ${isLastStep
                            ? 'bg-emerald-700 hover:bg-emerald-800'
                            : 'bg-emerald-700 hover:bg-emerald-800'
                            }`}
                    >
                        {isLastStep ? t('Done') : t('Next')}
                    </button>
                </div>

            </div>
        </div>
    );
}
export default Pop_up_Schedule
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

    //đóng mở pop up
    const [IsOpenPopup, setIsOpenPopup] = useState(true);
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

    if (!IsOpenPopup) return null;

    //settting pop up
    const tabName = Object.keys(tabSteps) as TabName[];
    const [StepIndex, setStepIndex] = useState(0);
    const [currentTab, setCurrentTab] = useState<TabName>(tabName[0]);

    const steps = tabSteps[currentTab];
    const currentStep = steps[StepIndex];

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
                className="relative w-full h-auto md:w-[1149px] md:h-[658px] overflow-hidden p-2 bg-white rounded-lg "
            >

                {/* Close Button - đặt trên cùng bên phải */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl z-10"
                >
                    <CloseOutlined />
                </button>

                {/* Tab Bar - dưới nút X */}
                <div className="flex justify-center gap-12  pt-10 ">
                    {tabName.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => switchtab(tab)}
                            className={`font-medium ${tab === currentTab
                                ? "text-[rgb(58,166,202,var(--tw-text-opacity,1))] py-2 px-4 text-xl  border-b-2 border-[rgb(58,166,202,var(--tw-text-opacity,1))]"
                                : "text-gray-500 text-xl font-medium"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <hr className='w-[90%] ml-15 text-gray-300 mb-4 ' />
                {/* Content */}

                <div className="w-full">
                    <h2 className="text-2xl w-full pl-35 font-semibold text-orange-600 mb-2">
                        {currentStep.title}
                    </h2>
                    <p className="text-xl pl-35 font-light mb-6">{currentStep.content}</p>
                    <img
                        src={currentStep.image}
                        className="mx-auto w-[75%] max-h-[320px] object-contain"
                    />
                </div>
                {/* Navigation */}
                <div className="flex justify-end mt-6">
                    {StepIndex > 0 && (
                        <button
                            onClick={goPrev}
                            className="px-4 py-2 cursor-pointer w-max text-lg font-semibold border-2 border-[rgb(58,166,202,var(--tw-text-opacity,1))] text-[rgb(58,166,202,var(--tw-text-opacity,1))] rounded-md hover:bg-[rgb(58,166,202,var(--tw-text-opacity,1))]/80 hover:text-white "
                        >
                            Previous
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
                        className={`px-4 py-2 ml-3 mr-10 ${isLastStep ? 'cursor-pointer rounded-md bg-[rgb(3,105,94,var(--tw-bg-opacity,1))] hover:bg-[rgb(3,105,94,var(--tw-bg-opacity,1))]/90' : 'cursor-pointer rounded-md bg-[rgb(3,105,94,var(--tw-bg-opacity,1))] hover:bg-[rgb(3,105,94,var(--tw-bg-opacity,1))]/90 border-2'
                            } text-white text-lg font-semibold rounded transition duration-200`}
                    >
                        {isLastStep ? 'Done' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );

}

export default Pop_up_Schedule
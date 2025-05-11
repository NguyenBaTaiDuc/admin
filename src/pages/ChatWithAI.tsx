import React, { useState, useRef, useEffect } from "react";
import { Progress } from "antd";
import SendOutlined from "@ant-design/icons/lib/icons/SendOutlined";
import CreateMarketing from "@/components/CreateMarketing";
import RightOutlined from "@ant-design/icons/lib/icons/RightOutlined";
import { useNavigate } from "react-router-dom";
import { useCharacterCount } from "./CharacterCountContext";
import { useTranslation } from 'react-i18next';
const ChatWithAI: React.FC = () => {
    const { t } = useTranslation();
    const questions = [
        "📚" + t("Do you want your previous contents to be incorporated into our marketing strategy?"),
        "📖" + t("What is the main goal of your social media content in the next month ?"),
        "📂" + t("Who is your target audience, and what tone or style resonates with them ?"),
        "📑" + t("Do you have any upcoming promotions, events, or product launches that should be highlighted?"),
        "✏️" + t("What type of content do you prefer?"),
        "✏️" + t("Are there any specific keywords, hashtags, or brand messages you want included in each post?"),
        "✏️" + t("How many days should your marketing plan cover? (Enter the number of days)"),
    ];
    const options = [
        [t("Yes"), t("No")],
        [t("Brand Awareness"), t("Engagement"), t("Lead Generations"), t("Sales"), t("Other")],
        [t("Professional"), t("Friendly"), t("Humorous"), t("Informative"), t("Other")],
        [t("Christmas"), t("Halloween"), t("Friday Special"), t("Other")],
        [t("Educational tips"), t("Behind-the-scenes"), t("Testimonials"), t("user-generated content"), t("Other")],
        [t("#Marketing"), t("#BrandGrowth"), t("#SocialMedia"), t("#Engagament"), t("Other")],
        ["10", "20", "30", t("Other")],
    ];


    // chat box tự cuộn xuống khi chọn câu trả lời
    const bottomRef = useRef<HTMLDivElement>(null);


    //hàm tính tổng số kí tự câu trả lời
    const { setChatCharCount } = useCharacterCount();

    //chuyển qua trang upload file cho AI
    const navigate = useNavigate();
    //khung chat AI
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customInput, setCustomInput] = useState("");

    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
    // tổng số kí tự câu trả lời
    React.useEffect(() => {
        const total = answers.reduce((sum, answer) => sum + answer.length, 0);
        setChatCharCount(total);
    }, [answers]);
    // tự cuộn
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentStep, answers]);
    // hàm xử lý nếu sau khi click chọn câu trả lời
    const handleAnswerChange = (index: number, value: string) => {
        if (value === "Other") {
            setShowCustomInput(true);
        } else {
            const updatedAnswers = [...answers];
            updatedAnswers[index] = value;
            setAnswers(updatedAnswers);
            goToNext(index);
        }
    };
    //hàm xử lý đưa câu trả lời lên màn hình sau khi gửi
    const handleCustomSubmit = (index: number) => {
        if (!customInput.trim()) return;
        const updatedAnswers = [...answers];
        updatedAnswers[index] = customInput.trim();
        setAnswers(updatedAnswers);
        setShowCustomInput(false);
        setCustomInput("");
        goToNext(index);
    };
    // hàm đi tới bước tiếp theo trong quá trình hỏi đáp
    const goToNext = (index: number) => {
        if (index < questions.length - 1) {
            setTimeout(() => {
                setCurrentStep(index + 1);
            }, 300);
        }
    };
    return (
        <div className="w-full sm:min-h-[calc(100vh-80px)] min-h-screen mb-5  sm:h-auto  bg-white rounded-none sm:rounded-xl shadow-none sm:shadow-xl p-4 sm:p-6 md:p-8 pt-6">
            <div className="pt-10 sm:pt-2 md:pt-0 text-xs xs:text-[12px] sm:text-[14px] base:text-base lg:text-base">
            <CreateMarketing />
            </div>
           
            <hr className='w-full border-[#e5e7eb] mt-1' />
            <Progress
                className="h-full rounded-full"
                style={{ marginTop: "20px" }}
                percent={(currentStep / (questions.length - 1)) * 100}
                showInfo={false}
                strokeColor={{
                    '0%': '#8e2de2',   // tím
                    '100%': '#ff6a95', // hồng
                }}
            />
            <div className="px-5 pt-1 h-[490px] overflow-y-auto bg-white">
                {questions.slice(0, currentStep + 1).map((question, index) => (
                    <div key={index} className="space-y-2">
                        {/* Bot message */}
                        <div className="flex">
                            <div className="h-max max-w-md rounded-md py-3 px-4 break-words bg-gray-100">
                                {question}
                            </div>
                        </div>

                        {/* User response */}
                        <div className="flex justify-end">
                            <div className="rounded-lg max-w-[80%] w-fit ml-auto">
                                {/* Các lựa chọn dạng button */}
                                <div className="flex gap-3 flex-wrap mb-2">
                                    {answers[index] ? (
                                        <span className="inline-block bg-blue-300 text-black px-4 py-2 rounded-lg">
                                            {answers[index]}
                                        </span>
                                    ) : (
                                        options[index].map((option, optIndex) => (
                                            <button
                                                key={optIndex}
                                                onClick={() => handleAnswerChange(index, option)}
                                                className={`px-4 py-2 rounded-lg  transition-all duration-200
                                                         ${answers[index] === option
                                                        ? "bg-blue-300 text-black "
                                                        : "bg-white text-black border border-gray-300 hover:bg-blue-100"}`}
                                            >
                                                {option}
                                            </button>
                                        ))
                                    )}
                                </div>
                                {/* Hiện input nếu chọn "Other" */}
                                {showCustomInput && currentStep === index && (
                                    <div className="flex mt-2">
                                        <input
                                            type="text"
                                            placeholder="Enter custom value…"
                                            value={customInput}
                                            onChange={(e) => setCustomInput(e.target.value)}
                                            className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none"
                                        />
                                        <button
                                            onClick={() => handleCustomSubmit(index)}
                                            className="bg-gray-800 text-white px-4 rounded-r-md hover:bg-gray-600"
                                        >
                                            <SendOutlined
                                                style={{ fontSize: '18px', transform: 'rotate(-45deg)' }}
                                            />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} /> {/* Tự cuộn xuống dưới cùng */}
            </div>
            {currentStep === questions.length - 1 && answers[currentStep] && (
                <button
                    onClick={() => navigate("/UploadContentForAI", { state: { answers } })}
                    className="ml-auto mt-1 mr-5 pl-3 pr-4 font-semibold py-3 group relative flex items-center bg-[rgb(3,105,94,var(--tw-bg-opacity,1))] text-white rounded-lg transition-all duration-300"
                >
                    {t("Next")}
                    <span className="ml-2 font-semibold opacity-0 translate-x-[-10px] group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                        {t("step")}
                        <RightOutlined
                            style={{
                                fontWeight: 'bold',
                                fontSize: '13px',
                            }}
                            className="ml-1" />
                    </span>
                </button>
            )}
            <div>
            </div>
            <div className='h-5'>
            </div>
        </div>
    );
};
export default ChatWithAI;
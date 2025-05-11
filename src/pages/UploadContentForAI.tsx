import CreateMarketing from "@/components/CreateMarketing";
import CreateMarketingPlan from "@/components/PopUp/CreateMarketingPlan";
import CloseOutlined from "@ant-design/icons/lib/icons/CloseOutlined";
import CloudDownloadOutlined from "@ant-design/icons/lib/icons/CloudDownloadOutlined";
import FacebookFilled from "@ant-design/icons/lib/icons/FacebookFilled";
import FileTextOutlined from "@ant-design/icons/lib/icons/FileTextOutlined";
import InfoCircleOutlined from "@ant-design/icons/lib/icons/InfoCircleOutlined";
import InstagramFilled from "@ant-design/icons/lib/icons/InstagramFilled";
import LinkedinFilled from "@ant-design/icons/lib/icons/LinkedinFilled";
import SettingOutlined from "@ant-design/icons/lib/icons/SettingOutlined";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import pdfToText from "react-pdftotext";
import { useCharacterCount } from "./CharacterCountContext";
import { useLocation } from "react-router-dom";
import GIF from "../assets/loadingGenerate.gif";
import ScheduleOutlined from "@ant-design/icons/lib/icons/ScheduleOutlined";
import { useTranslation } from 'react-i18next';
import '../index.css'
import { AuthContext } from "@/services/auth_context";
import { toast, ToastContainer } from 'react-toastify';
const UploadContentForAI: React.FC = () => {
    const [IsShowCreateMarketingPlanPopup, setIsShowCreateMarketingPlanPopup] = useState(false);
    const {isLogin} = useContext(AuthContext);
    const { t } = useTranslation();
    //lấy accessToken sau khi đăng nhập
    const [connectedPages, setConnectedPages] = useState<{ id: string; name: string; access_token: string }[]>([]);
    useEffect(() => {
        const pagesData = localStorage.getItem('connectedPages');
        if (pagesData) {
            const parsedPages = JSON.parse(pagesData);
            if (Array.isArray(parsedPages)) {
                const validPages = parsedPages.filter((page: any) => page.access_token);
                setConnectedPages(validPages);
            }
        }
    }, []);
    // lưu dữ liệu back-end trả về
    const [GeneratedPlan, setGeneratedPlan] = useState<{
        social_platform: string;
        post_titles: string[];
        marketing_plan: string[];
        social_posts: string[];
        timestamps: number[];
    } | null>(null);
    const [IsFacebookorInstagram, setIsFacebookorInstagram] = useState<string | null>(null);
    const [GenBusiness, setGenBusiness] = useState("");
    const [GenLanguage, setGenLanguage] = useState("");
    const [GenNdays, setGenNdays] = useState(0);
    // màn hình kết quả sau khi gen
    const [IsResultModalOpen, setIsResultModalOpen] = useState(false);
    // màn hình chờ AI gen dữ liệu
    const [Isloading, setisLoading] = useState(false);
    const businessRef = React.useRef<HTMLInputElement>(null);
    const [Language, setLanguage] = React.useState("English");
    const { chatCharCount } = useCharacterCount();
    const [pdfText, setpdfText] = React.useState("");
    const [pdfChartCount, setpdfChartCount] = React.useState(0);
    const [dragActive, setDragActive] = React.useState(false);
    const [IsupLoadFile, setIsupLoadFile] = React.useState<File | null>(null);
    const [IsClickCreateMarketingPlan, setIsClickCreateMarketingPlan] = React.useState(false);
    const [IsclickAdvanceSetting, setIsclickAdvanceSetting] = React.useState(false);
    const [IsClickFaceandInstagram, setIsClickFaceandInstagram] = React.useState<string | null>(null);
    const [selectedPage, setSelectedPage] = useState<string>("Hephatustechgroup");
    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
        const files = event.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'application/pdf') {
            setIsupLoadFile(files[0]); // lưu file
            try {
                const text = await pdfToText(files[0]);
                setpdfText(text); // Lưu nội dung PDF vào state
                const charCount = text.length;
                setpdfChartCount(charCount); // Lưu số lượng ký tự vào state
            }
            catch (error) {
                console.error("Error reading PDF file:", error);
            }
        } else {
            alert('Only PDF files are supported!');
        }
    }
    const handleFileUpload = async () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".pdf";
        fileInput.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (file && file.type === 'application/pdf') {
                setIsupLoadFile(file);
                try {
                    const text = await pdfToText(file);
                    setpdfText(text);
                    setpdfChartCount(text.length);
                } catch (error) {
                    console.error("Error reading PDF file:", error);
                }
            } else {
                alert('Only PDF files are supported!');
            }
        };
        fileInput.click();
    };
    const location = useLocation();
    const chatMessage = location.state?.answers;
    if (!chatMessage) {
        console.warn("Không có dữ liệu chat được truyền!");
    }
    // kết nối back-end up content
    const handleGenerate = async () => {
        if (!chatMessage || chatMessage.length < 7 || !IsClickFaceandInstagram) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const business = businessRef.current?.value;
        if (!business) {
            alert("Vui lòng nhập tên doanh nghiệp!");
            return;
        }
        if(!isLogin){
            setIsShowCreateMarketingPlanPopup(true); 
            return;
        }

        const knowledge_base = pdfText
            ? `${chatMessage.join("\n")}\n${pdfText}`
            : chatMessage.join("\n");

        const n_days = parseInt(chatMessage[6]);
        const data = {
            social_platform: IsClickFaceandInstagram,
            business,
            language: Language,
            knowledge_base,
            n_days,
        };

        try {
            setisLoading(true);

            // 👉 Step 1: gọi marketing_plan để lấy tiêu đề & timestamps
            const response = await axios.post("http://localhost:8000/marketing_plan", data);
            const { post_titles, timestamps } = response.data;

            // 👉 Step 2: gọi /posts để sinh bài viết đầy đủ từ tiêu đề
            const postResponse = await axios.post("http://localhost:8000/posts", {
                ...data,
                post_titles,
                timestamps,
            });

            console.log("✅ Kế hoạch + bài viết đầy đủ:", postResponse.data);
            console.log(GeneratedPlan?.social_posts)
            setIsFacebookorInstagram(IsClickFaceandInstagram);
            setGenBusiness(business);
            setGenLanguage(Language);
            setGenNdays(n_days);
            setIsResultModalOpen(true);
            //  Lưu lại để hiển thị
            setGeneratedPlan(postResponse.data);
        } catch (error: any) {
            console.error("❌ Lỗi gửi dữ liệu:", error.response?.data || error.message);
        } finally {
            setisLoading(false);
        }
    };
    const postContentToFacebook = async (posts: string[]) => {
        const message = posts.join("\n\n"); // Gộp các bài thành 1 chuỗi, ngăn cách bằng 2 dòng trắng
        try {
            const page = connectedPages.find(p => p.name === selectedPage);
            await axios.post("http://localhost:8000/post_to_facebook", {
                message,
                page_id: page?.id,
                access_token: page?.access_token
            });
            console.log(" Đã đăng:");
            toast.success("Bài viết đã được đăng thành công");
            setIsResultModalOpen(false);
        } catch (err) {
            console.error(" Lỗi đăng:", err);
            toast.success("Bài viết đăng không thành công");
        }
    };
    return (
        <div className="w-full overflow-auto sm:h-auto sm:min-h-[calc(100vh-35px)] min-h-screen  bg-white rounded-none sm:rounded-xl shadow-none sm:shadow-xl p-4 sm:p-6 md:p-8 pt-6 sm:pt-0 sm:pb-4 ">
            {
                IsShowCreateMarketingPlanPopup &&(
                    <div className='fixed inset-0 bg-black/50 z-60 flex items-center justify-center '>
                    <CreateMarketingPlan
                      onClose={() => {
                        setIsShowCreateMarketingPlanPopup(false);
                      }}
                    />
                </div>
                )
            }
            {Isloading && (
                <div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
                    <div className=" flex flex-col items-center justify-center gap-4">
                        <img src={GIF} alt="Loading..." className=" flex-1 items-center self-center object-cover" />
                        <p className="text-xl font-semibold">
                            {t("I'm generating, Please wait for a few minutes......")}
                        </p>
                    </div>
                </div>
            )}
            {IsResultModalOpen && GeneratedPlan && (
                <div
                    className="fixed inset-0  bg-black/30  z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            onClick={() => setIsResultModalOpen(false)}
                        >
                            <CloseOutlined />
                        </button>
                        <h2 className="text-xl font-bold mb-4 color-primary">
                            <ScheduleOutlined style={{ paddingRight: 4 }} />
                            {t("Generate Marketing Plan")}

                        </h2>
                        <p><strong>{t("Platform")}:</strong> {IsFacebookorInstagram}</p>
                        <p><strong>{t("Business")}:</strong> {GenBusiness}</p>
                        <p><strong>{t("Language")}:</strong> {GenLanguage}</p>
                        <p><strong>{t("Number of Days")}:</strong> {GenNdays}</p>
                        <div className="mt-4">
                            <strong>{t("Post Content")}:</strong>
                            <div className="max-h-[200px] overflow-y-auto pr-2">
                                <ul className="list-disc ml-5">
                                    {GeneratedPlan?.social_posts?.map((post, i) => (
                                        <li key={i} className="whitespace-pre-line mb-3">{post}</li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                        <div className=" mt-6 flex justify-end">
                            <button
                                onClick={() => postContentToFacebook(GeneratedPlan.social_posts)}
                                className="text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-4 md:px-5 py-2 font-medium rounded-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center justify-center gap-2 transition-all">
                                {t("Generate Marketing Plan")}✨
                            </button>
                        </div>

                    </div>
                </div>
            )}
            <div className="pt-10 sm:pt-2 md:pt-0 text-xs xs:text-[12px] sm:text-[14px] base:text-base lg:text-base">
                <CreateMarketing />
            </div>

            <hr className='w-full border-[#e5e7eb] mt-1' />
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 font-normal">
                {t("The character count is limited to 10,000 characters. Character count:")}{" "}
                <span className="text-blue-500">{chatCharCount + pdfChartCount}/10,000</span>
            </h1>
            <p className="font-bold color-primary flex items-center text-sm sm:text-base md:text-lg lg:text-xl ">
                {t("Upload new content")}
                <p className="text-gray-500 font-light"> ({t("optional")})</p>
                <p className="w-[2px]"></p>
                <InfoCircleOutlined style={{ fontSize: 14, marginTop: 3 }} />
            </p>
            <div className=" border-dashed border-gray-300 rounded-lg p-6 mt-3 text-center border-2">
                <div
                    className={`cursor-pointer p-6 mt-3 text-center 
                        ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    onClick={handleFileUpload}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                >
                    <CloudDownloadOutlined
                        style={{ fontSize: 50, color: 'gray' }} />
                    <div className="text-gray-500 text-sm sm:text-base md:text-lg lg:text-xl ">
                        {t("Click or drag file to upload")}
                    </div>
                    <div className="text-gray-500 sm:text-base md:text-lg lg:text-xl ">{t("PDF only")}</div>
                </div>
                {IsupLoadFile && (
                    <div className=" text-sm sm:text-base text-black font-medium">
                        <FileTextOutlined /> {IsupLoadFile.name}
                    </div>
                )}
            </div>
            <h2 className="font-bold py-2 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl color-primary">
                {t("Which social platform do you want AI to create posts for?")}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 py-1">
                <button
                    onClick={() => setIsClickFaceandInstagram('Facebook')}
                    className={`px-4 py-2 rounded cursor-pointer flex flex-row items-center justify-center gap-1 border border-gray-300
                    ${IsClickFaceandInstagram === "Facebook" ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-300"}`}
                >

                    <FacebookFilled style={{ fontSize: 18 }} />
                    Facebook
                </button>
                <button
                    onClick={() => setIsClickFaceandInstagram('Instagram')}
                    className={`px-4 py-2 rounded cursor-pointer flex flex-row items-center justify-center gap-1 border border-gray-300
                    ${IsClickFaceandInstagram === "Instagram" ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-300"}`}
                >
                    <InstagramFilled />
                    Instagram
                </button>
                <button className="px-4 py-2 rounded cursor-pointer flex items-center justify-center gap-1 border border-gray-300">
                    <span className="-translate-x-[6px] flex items-center gap-1">
                        <LinkedinFilled style={{ fontSize: '20px' }} />
                        LinkedIn
                    </span>
                </button>

            </div>
            {
                (IsClickFaceandInstagram === "Facebook" || IsClickFaceandInstagram === "Instagram") && (
                    <div className="mt-4 space-y-2">
                        <h2 className="color-primary text-sm sm:text-base md:text-lg lg:text-xl font-bold">
                            {t("Which pages do you want to generate for the marketing plan?")}
                        </h2>
                        <select
                            value={selectedPage}
                            onChange={(e) => setSelectedPage(e.target.value)}
                            className="w-full max-w-sm border border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-500 rounded px-3 py-2 text-sm sm:text-base md:text-lg shadow-none">
                            <option value="Hephatustechgroup">Hephatustechgroup</option>
                            <option value="Quantus_Learn">Quantus Learn</option>
                            <option value="Hephaestus_Technology_&_Consulting">Hephaestus Technology & Consulting</option>
                        </select>
                    </div>
                )}
            <div className="flex flex-col items-start space-y-4 w-full">
                <div
                    onClick={() => setIsclickAdvanceSetting(true)}>
                    <SettingOutlined style={{ fontSize: 19, color: 'rgb(58,166,202,var(--tw-text-opacity, 1))' }} />
                    <button className="btn-settings pl-2 font-light inline-flex cursor-pointer hover:underline text-sm sm:text-base md:text-lg lg:text-xl items-center gap-2 mt-4">
                        {t("Advanced Settings")}
                    </button>
                </div>
                {IsclickAdvanceSetting && (
                    <div className="flex flex-col sm:flex-row gap-6 mt-5">
                        {/* Business Type */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <label className="color-primary text-sm sm:text-base md:text-lg lg:text-xl font-bold mr-3 text-left sm:text-right">
                                {t("Business Type:")}
                            </label>
                            <input
                                ref={businessRef}
                                type="text"
                                className="w-[150px] h-[40px] px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        {/* Language */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <label className="color-primary text-sm sm:text-base md:text-lg lg:text-xl font-bold mr-3 text-left sm:text-right">
                                {t("Language")}
                            </label>
                            <div className="relative w-[115px]">
                                <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500 pointer-events-none z-10">
                                    {t("Language")}
                                </label>
                                <select
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full h-[45px] border border-gray-300 rounded px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option>English</option>
                                    <option>Vietnamese</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                </select>
                            </div>
                        </div>

                    </div>
                )}
                <button
                    onClick={handleGenerate}
                    className="text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-4 md:px-5 py-2 font-medium rounded-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center justify-center gap-2 transition-all">
                    {t("Generate Marketing Plan")}✨
                </button>
                {
                    IsClickCreateMarketingPlan && (
                        <div className='fixed inset-0 bg-black/50 z-40 flex items-center justify-center '>
                            <div className='bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-5xl w-full relative z-50 '>
                                <button
                                    className=' absolute top-2 right-2  text-gray-500  hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm'
                                    onClick={() => { setIsClickCreateMarketingPlan(false) }}
                                >
                                    <CloseOutlined
                                        style={{ fontSize: '20px', padding: 10 }}
                                    />
                                </button>
                                <CreateMarketingPlan onClose={() => setIsClickCreateMarketingPlan(false)}
                                />
                            </div>
                        </div>
                    )
                }

            </div>

        </div>
    );
};

export default UploadContentForAI;
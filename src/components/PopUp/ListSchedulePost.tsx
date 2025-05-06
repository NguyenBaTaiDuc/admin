import { CalendarOutlined, CloseOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import img from './images/iconFacebook.svg';
import dayjs from 'dayjs'
export interface Post {
    content: string;
    imageUrl?: string;
    postingTime: string;
    selectedPage: string;
}
interface ListSchedulePostProps {
    isOpen: boolean;
    onClose: () => void;
    date: string;
    posts: Post[];
}




export const ListSchedulePost: React.FC<ListSchedulePostProps> = ({ isOpen, onClose, date }) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const [scheduledPosts, setScheduledPosts] = useState<Post[]>([]);
    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
    
            // Load từ localStorage
            const storedPosts = localStorage.getItem('scheduledPosts');
            if (storedPosts) {
                const parsedPosts: Post[] = JSON.parse(storedPosts);
                const filtered = parsedPosts.filter(post =>
                    dayjs(post.postingTime).format("YYYY-MM-DD") === dayjs(date).format("YYYY-MM-DD")
                );
                setScheduledPosts(filtered);
            }
    
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isOpen, date]);
    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50 z-50">
            <div ref={popupRef} className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-4 relative">
                {/* Close Button */}
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-2 mb-4">
                    <div className="flex items-center space-x-2 color-primary">
                        <CalendarOutlined
                            style={{ fontSize: 25 }}
                        />
                        <h2 className="text-xl color-primary font-semibold text-gray-800">List Scheduled Posts</h2>

                    </div>
                    <div className="text-gray-500 text-xl hover:text-black cursor-pointer transition-colors duration-200">
                        <CloseOutlined
                            onClick={onClose}
                        />
                    </div>
                </div>
                {/* List Items */}
                <div className="overflow-y-auto max-h-[400px] pr-2">
                    {scheduledPosts.map((post, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                            <div className="flex flex-row justify-between items-center w-full">
                                <div className="flex flex-row items-center pl-7 ">
                                    <img src={img} className="w-[40px] h-[40px]" />
                                    <p className="pl-3  text-lg font-semibold">Facebook</p>
                                </div>
                                <span>{dayjs(post.postingTime).format("HH:mm")}</span>
                                <div className="flex flex-row pr-5 text-2xl text-[#FF760E]/80  hover:text-[#FF760E]">
                                    <EyeOutlined className="pr-3   transition-colors duration-200" />
                                    <DeleteOutlined className="  transition-colors duration-200" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

import { CalendarOutlined, CloseOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import img from './images/iconFacebook.svg';
import dayjs from 'dayjs'
import { deleteSchedulePostFacebook } from "@/services/apiFacebook";
import { toast } from "react-toastify";
export interface Post {
    id: string,
    content: string;
    imageUrl?: string;
    postingTime: string;
    selectedPage: string;
    scheduled_publish_time?: number; // Added this property
    scheduledTime?: number | string; // Added this property
    created_time?: string; // Added this property
    pageAccessToken: string;
}
interface ListSchedulePostProps {
    isOpen: boolean;
    onClose: () => void;
    date: string;
    posts: Post[];
    onPostsUpdated?: () => void;
    onViewPost: (post: Post) => void
}
export const ListSchedulePost: React.FC<ListSchedulePostProps> = ({ isOpen, onClose, date, posts, onPostsUpdated, onViewPost }) => {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isOpen, onClose]);

    const getFormattedPostTime = (post: Post): string => {
        const unixTimestamp =
            post.scheduled_publish_time ||
            post.scheduledTime ||
            null;

        if (unixTimestamp) {
            return typeof unixTimestamp === 'number' ? dayjs.unix(unixTimestamp).format('HH:mm') : 'Invalid time';
        }

        if (post.postingTime) {
            return dayjs(post.postingTime).format(' HH:mm');
        }

        if (post.created_time) {
            return dayjs(post.created_time).format('HH:mm');
        }

        return 'Không xác định';
    };

    const [scheduledPosts, setScheduledPosts] = useState<Post[]>([]);

    const handleDeletePost = async (postDelete: Post) => {
        const confirmed = window.confirm('bạn có chắc muốn xóa bài viết này?');
        if (!confirmed) return;
        try {
            await deleteSchedulePostFacebook(postDelete.id, postDelete.pageAccessToken);
            console.log(postDelete.pageAccessToken);
            const updated = posts.filter(p => p.id !== postDelete.id);
            setScheduledPosts(updated);
            if (onPostsUpdated) onPostsUpdated();
            toast.success("Đã Xóa bài viết thành công");
        } catch (err) {
            if (err instanceof Error) {
                toast.error("Đã xảy ra lỗi khi xóa bài viết");
                console.error("Lỗi:", err.message);
            } else {
                toast.error("Lỗi không xác định khi xóa bài viết");
                console.error("Lỗi:", err);
            }
        }
    }
    useEffect(() => {
        if (!isOpen || !date) return;

        const filtered = posts.filter(post => {
            const rawTimestamp =
                post.scheduled_publish_time ||
                post.scheduledTime ||
                post.postingTime ||
                post.created_time;

            if (!rawTimestamp) return false;

            const postDate = typeof rawTimestamp === 'number'
                ? (rawTimestamp > 1e12 ? dayjs(rawTimestamp) : dayjs.unix(rawTimestamp)) // check: milliseconds vs seconds
                : dayjs(rawTimestamp);

            return postDate.format("YYYY-MM-DD") === dayjs(date).format("YYYY-MM-DD");
        });

        setScheduledPosts(filtered);
    }, [isOpen, date, posts]);
    useEffect(() => {
        console.log('[🔍 DEBUG] Tất cả bài viết:', posts);
        console.log('[🔍 DEBUG] Ngày đang chọn:', date);
    }, [posts, date]);


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-50">
            <div ref={popupRef} className="w-full max-w-sm sm:max-w-xl md:max-w-4xl bg-white rounded-lg shadow-lg p-3 sm:p-4 relative">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-2 mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2">
                        <CalendarOutlined style={{ fontSize: 20 }} className="color-primary" />
                        <h2 className="text-base sm:text-xl font-semibold color-primary">List Scheduled Posts</h2>
                    </div>
                    <div className="text-gray-500 text-lg sm:text-xl hover:text-black cursor-pointer transition-colors duration-200">
                        <CloseOutlined onClick={onClose} />
                    </div>
                </div>


                {/* List Items */}
                <div className="overflow-y-auto max-h-[400px] pr-2">
                    {scheduledPosts.map((post, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                            <div className="flex flex-row justify-between items-center w-full">
                                <div className="flex flex-row items-center pl-3 sm:pl-7">
                                    <img src={img} className="w-8 h-8 sm:w-10 sm:h-10" />
                                    <p className="pl-2 sm:pl-3 text-sm sm:text-lg font-semibold">Facebook</p>
                                </div>
                                <span className="text-sm sm:text-base">{getFormattedPostTime(post)}</span>
                                <div className="flex flex-row pr-3 sm:pr-5 text-xl sm:text-2xl text-[#FF760E]/80 hover:text-[#FF760E]">
                                    <EyeOutlined
                                        onClick={() => onViewPost(post)}
                                        className="pr-2 sm:pr-3 transition-colors duration-200"
                                    />
                                    <DeleteOutlined
                                        onClick={() => handleDeletePost(post)}
                                        className="transition-colors duration-200"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};


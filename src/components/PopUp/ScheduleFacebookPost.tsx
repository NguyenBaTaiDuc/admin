import CalendarOutlined from '@ant-design/icons/lib/icons/CalendarOutlined';
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined';
import { log } from 'console';
import React, { useEffect, useState } from 'react';

interface ScheduleFacebookPostProps {
    onClose: () => void;
    platform: 'Facebook' | 'Instagram';
    onBackToPlatForm: () => void;
}

const ScheduleFacebookPost: React.FC<ScheduleFacebookPostProps> = ({ onClose, platform, onBackToPlatForm }) => {
    const [step, setStep] = useState(1);
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedPage, setSelectedPage] = useState('');
    const [postingTime, setPostingTime] = useState('');
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
    const handleSchedulepost = () => {
        const scheduledPosts = JSON.parse(localStorage.getItem('scheduledPosts') || '[]');
        const postedPosts = JSON.parse(localStorage.getItem('postedPosts') || '[]');
        const newPost = {
            content,
            imageUrl,
            selectedPage,
            postingTime,
        };
        localStorage.setItem('scheduledPosts', JSON.stringify([...scheduledPosts, newPost]));
        window.dispatchEvent(new Event('reload_posts'))
        schedulePost(newPost); // Đặt hẹn cho bài mới
        onClose();
    };


    const handleNext = () => {
        if (step === 1) setStep(2);
    };

    const handlePrevious = () => {
        if (step === 2) {
            setStep(1);
        } else {
            onBackToPlatForm(); // quay về CreateAndSchedulePost
        }
    };

    const schedulePost = (post: any) => {
        const postTime = new Date(post.postingTime).getTime();
        const now = Date.now();
        const delay = postTime - now;

        if (delay <= 0) {
            console.warn('Scheduled time is in the past, skipping post:', post);
            return;
        }

        console.log(`Scheduling post in ${delay / 1000} seconds`, post);
        alert('Đặt lịch dăng thành công');

        setTimeout(async () => {
            try {
                await postToFacebook(post);
                const currentPosts = JSON.parse(localStorage.getItem('scheduledPosts') || '[]');
                currentPosts.push(post);
                localStorage.setItem('postedPosts', JSON.stringify(currentPosts));
                // const updatedPosts = currentPosts.filter((p: any) => p.postingTime !== post.postingTime);
                // localStorage.setItem('scheduledPosts', JSON.stringify(updatedPosts));
                // console.log('Post done and removed from schedule:', post);
            } catch (error) {
                console.error('Failed to post scheduled post:', error);
            }
        }, delay);
    };
    const postToFacebook = async (post: { content: string; imageUrl: string; selectedPage: string; postingTime: string }) => {
        try {
            const connectedPages = JSON.parse(localStorage.getItem('connectedPages') || '[]');
            const selected = connectedPages.find((page: any) => page.id === post.selectedPage);

            if (!selected) {
                console.error('Page not found with id:', post.selectedPage);
                throw new Error('Page not found!');
            }

            const pageId = selected.id;
            const pageAccessToken = selected.access_token;

            console.log(' Posting to Facebook with data:', {
                pageId,
                imageUrl: post.imageUrl,
                caption: post.content,
            });

            const response = await fetch(`https://graph.facebook.com/${pageId}/photos`, {
                method: 'POST',
                body: new URLSearchParams({
                    url: post.imageUrl,
                    caption: post.content,
                    access_token: pageAccessToken,
                    published: 'true',
                }),
            });

            const result = await response.json();

            console.log(' Facebook API response:', result);

            if (!response.ok) {
                console.error('Facebook API Error:', result.error?.message || 'Unknown Error');
                throw new Error(result.error?.message || 'Failed to post to Facebook');
            }

            console.log('Post successful:', result);
            alert('bài bạn đặt lịch đã được đăng lên facebook ')
            const postedPosts = JSON.parse(localStorage.getItem('postedPosts') || '[]');
            postedPosts.push(post);
            localStorage.setItem('postedPosts', JSON.stringify(postedPosts));
        } catch (error: any) {
            console.error('Error occurred during posting:', error.message || error);
            throw error; // để cho ngoài hàm catch được lỗi tiếp
        }
    };
    return (
        <div className="">
            <div className="popup">
                <h2 className='text-lg font-semibold text-[rgb(255,118,14,var(--tw-text-opacity,1))] mb-6'>
                    Schedule {platform === 'Facebook' ? 'Facebook' : 'Instagram'} Post
                </h2>
                {step === 1 && (
                    <div>
                        <label className='block text-sm font-semibold mb-2'>Content:</label>
                        <div className="form-group ">
                            <textarea
                                className='w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[rgb(255,118,14,var(--tw-text-opacity,1))]'
                                placeholder="Input content..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                        <label className='block text-sm font-semibold text-black mb-2 mt-5'>Paste image URL:</label>
                        <div className="form-group">
                            <input
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[rgb(255,118,14,var(--tw-text-opacity,1))]"
                                type="text"
                                placeholder="Paste image URL..."
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className='flex flex-col space-y-6 flex-grow'>
                        <label className='block text-sm font-semibold text-black'>Select Facebook page:</label>
                        <div className="relative w-full max-w-[300px]">
                            <select
                                value={selectedPage}
                                onChange={(e) => setSelectedPage(e.target.value)}
                                className="custom-select appearance-none w-full text-left px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[rgb(255,118,14,var(--tw-text-opacity,1))]"
                            >
                                <option value="">Select a page</option>
                                {
                                    connectedPages.map((page) => (
                                        <option key={page.id} value={page.id}>
                                            {page.name}
                                        </option>
                                    ))
                                }
                            </select>
                            {/* Mũi tên custom */}
                            <DownOutlined
                                style={{ fontSize: 15 }}
                                className='pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600' />
                        </div>

                        <label className="block text-sm font-semibold text-black mb-2">Posting time:</label>
                        <div className="relative w-full">
                            <input
                                type="datetime-local"
                                value={postingTime}
                                onChange={(e) => setPostingTime(e.target.value)}
                                className="w-full block pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[rgb(255,118,14,var(--tw-text-opacity,1))] appearance-none"
                            />
                        </div>


                    </div>
                )}
                <div className="flex justify-between mt-6">
                    <button className="px-4 py-2 cursor-pointer w-max text-lg font-semibold border-2 border-[rgb(58,166,202,var(--tw-border-opacity,1))] text-[rgb(58,166,202,var(--tw-text-opacity,1))] rounded-md hover:bg-[rgb(58,166,202,var(--tw-border-opacity,1))]/80 hover:text-white" onClick={handlePrevious}>
                        Previous
                    </button>
                    {step === 2 ? (
                        <button
                            className={`px-4 py-2 cursor-pointer w-max text-lg font-semibold border-2 rounded-md 
                           ${selectedPage
                                    ? 'bg-[rgb(3,105,94,var(--tw-border-opacity,1))] text-white hover:bg-[rgb(3,105,94,var(--tw-border-opacity,1))]/90 border-[rgb(3,105,94,var(--tw-border-opacity,1))]'
                                    : 'bg-gray-300 text-gray-600 cursor-not-allowed border-gray-300'
                                }`}
                            onClick={handleSchedulepost}
                            disabled={!selectedPage}
                        >
                            Schedule
                        </button>
                    ) : (
                        <button
                            className="px-4 py-2 cursor-pointer w-max text-lg font-semibold border-2 bg-[rgb(3,105,94,var(--tw-bg-opacity,1))] text-white rounded-md hover:bg-[rgb(3,105,94,var(--tw-bg-opacity,1))]/90 border-[rgb(3,105,94,var(--tw-border-opacity,1))] "
                            onClick={handleNext}>
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScheduleFacebookPost;
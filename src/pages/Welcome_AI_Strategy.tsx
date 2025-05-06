
import CreateMarketing from '@/components/CreateMarketing'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Welcome_AI_Strategy = () => {
    const navigate = useNavigate()
    return (
        <div className='flex flex-col' >
            <div className="flex flex-col w-full min-h-[calc(100vh-35px)] sm:h-auto bg-white rounded-none sm:rounded-xl shadow-none sm:shadow-xl p-4 sm:p-6 md:p-8 pt-6">
                <CreateMarketing />
                <hr className='w-full border-[#e5e7eb]' />
                <div className='flex-1 flex justify-center items-center'>
                <div className=' flex flex-col w-full h-full justify-center items-center gap-4 '>
                    <h1 className='text-xl sm:text-2xl md:text-4xl font-bold text-foreground/80 text-center'>
                        🎉 Welcome to Your Marketing Strategy Assistant!🚀
                    </h1>
                    <p className='text-sm sm:text-base md:text-lg text-center max-w-xs sm:max-w-xl md:max-w-3xl'>
                        🎀 Hello! Welcome to our marketing strategy assistant. The information you provide will help us
                         gather the basic details needed to create a tailored marketing plan for you. Let's get started! 🎉
                    </p>
                    <button 
                    onClick={() => navigate('/ChatWithAI')}
                    className='w-full max-w-xs px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-lg bg-black text-white 
                    rounded-md hover:bg-[rgb(38,38,50,var(--tw-bg-opacity,1))]/90 transition duration-300'>
                        🚀 Let's Get Started!
                    </button>
                </div>
                </div>
            </div>
        </div>
    )
}

export default Welcome_AI_Strategy
import React from 'react'
import imageface from '../PopUp/images/iconFacebook.svg'
import imageinsta from '../PopUp/images/iconInstagram.svg'

type PopUpProps = {
    onClose: () => void;
    onChooseFacebookandIG: (platform: 'Facebook' | 'Instagram') => void;
    
};
const CreateAndSchedulePost: React.FC<PopUpProps> = ({ onClose, onChooseFacebookandIG }) => {
    return (
        <div className='flex flex-col'>
            <h1 className='text-[rgb(255,118,14,var(--tw-text-opacity,1))] text-lg font-semibold mb-6'> Schedule Facebook Post</h1>
            <h2 className='text-lg font-semibold text-primary-black  text-center '>Which social platform do you want to schedule posts for?</h2>
            <div className='flex flex-row  flex-grow justify-center mt-5  '>
                <div 
                onClick={() => { 
                    onChooseFacebookandIG('Facebook');
                    onClose();
                }}
                className='flex flex-row items-center hover:-translate-y-1 p-4 hover:border-[rgb(255,118,14,var(--tw-text-opacity,1))]/90 border-2 border-[rgb(229,231,235,var(--tw-border-opacity,1))] rounded-md cursor-pointer transition-all duration-200 '>
                    <img src={imageface} alt="Facebook" className='w-8 h-8 mr-1' />
                    Facebook
                </div>
                <div className='w-[20px]'></div>
                <div 
                onClick={() => {
                    onChooseFacebookandIG('Instagram');
                    onClose();
                }}
                className='flex flex-row items-center hover:-translate-y-1 p-4 hover:border-[rgb(255,118,14,var(--tw-text-opacity,1))]/90 border-2 border-[rgb(229,231,235,var(--tw-border-opacity,1))] rounded-md cursor-pointer transition-all duration-200 '>
                    <img src={imageinsta} alt="Instagram" className='w-8 h-8 mr-1' />
                    Instagram
                </div>

            </div>


        </div>
    )
}

export default CreateAndSchedulePost
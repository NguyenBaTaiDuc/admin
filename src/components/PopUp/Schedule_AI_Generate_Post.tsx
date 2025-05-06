import LeftOutlined from '@ant-design/icons/lib/icons/LeftOutlined'
import RightOutlined from '@ant-design/icons/lib/icons/RightOutlined'
import React  from 'react'
import { useNavigate } from 'react-router-dom';

type PopUpProps = {
  onClose: () => void; 
 }

const Schedule_AI_Generate_Post: React.FC<PopUpProps> = ({onClose}) => {
  const navigate = useNavigate();
  return (
    <div className='bg-white p-6 rounded-lg w-full flex flex-col justify-center items-center'>
          <h1 className="text-lg text-[rgb(255,118,14,var(--tw-text-opacity,1))] font-semibold  text-center">Select a post</h1>
          <div className=' flex  items-center justify-center flex-row gap-2 mt-3'>
            
          <LeftOutlined 
          style={{fontSize: '30px'}}
          className=' opacity-50 cursor-not-allowed text-xl '/>
            <p
            className=' text-[15px]'
            >There are no AI-generated posts yet.Go to the 
                <span 
                
                onClick={() => navigate("/ai_content_creation")}
                className='text-[rgb(58,166,202,var(--tw-text-opacity,1))] pl-1 cursor-pointer hover:underline'>AI Generate Post page to create.</span>
            </p>
            <RightOutlined 
            style={{fontSize: '30px'}}
            className='opacity-50 cursor-not-allowed text-xl' />
          </div>
          <div className='flex justify-end w-full'>
        <button 
        onClick={onClose}
        className='px-4 py-2 mt-4 text-lg font-semibold border-2 border-[rgb(58,166,202,var(--tw-text-opacity,1))] text-[rgb(58,166,202,var(--tw-text-opacity,1))] rounded-md hover:bg-[rgb(58,166,202,var(--tw-text-opacity,1))]/80 hover:text-white'>
          Close
        </button>
      </div>
     
    </div>
  
  )
}

export default Schedule_AI_Generate_Post
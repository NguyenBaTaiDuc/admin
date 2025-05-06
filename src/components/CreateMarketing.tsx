
import UndoOutlined from '@ant-design/icons/lib/icons/UndoOutlined'
import '../index.css'
import { useNavigate } from 'react-router-dom';
const CreateMarketing = () => {
    const navigate = useNavigate();
    return (
        <div className='flex flex-row justify-between' >
            <h1 className='text-sm sm:text-base md:text-lg lg:text-xl font-semibold color-primary'>Create a Marketing Plan</h1>
            <div 
            onClick={()=> navigate('/ai_content_creation')}
            className=' flex flex-rowflex items-center  gap-2 group hover:cursor-pointer underline-offset-3 hover:underline decoration-1'>
                <UndoOutlined
                    className='transition-transform duration-500 group-hover:rotate-360'
                    style={{ color: 'rgb(58,166,202,var(--tw-text-opacity, 1))' }} />
                <h1 className='text-sm sm:text-base md:text-lg lg:text-xl text-[#3AA6CA]'>Change AI Content Generation</h1>
            </div>
        </div>
    )
}
export default CreateMarketing
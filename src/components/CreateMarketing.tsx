
import UndoOutlined from '@ant-design/icons/lib/icons/UndoOutlined'
import '../index.css'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const CreateMarketing = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2 lg:gap-0'>
            <h1 className='text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold color-primary'>
                {t("Create a Marketing Plan")}
            </h1>
            <div
                onClick={() => navigate('/ai_content_creation')}
                className='flex flex-row items-center gap-2 group hover:cursor-pointer underline-offset-3 hover:underline decoration-1'
            >
                <UndoOutlined
                    className='transition-transform duration-500 group-hover:rotate-360'
                    style={{ color: 'rgb(58,166,202)' }}
                />
                <h1 className='text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#3AA6CA]'>
                    {t("Change AI Content Generation")}
                </h1>
            </div>
        </div>
    )
}
export default CreateMarketing
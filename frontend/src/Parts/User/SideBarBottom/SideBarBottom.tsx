
import { Link } from 'react-router-dom'
import { exploreOutline, homeFill, messageOutline, ticketIcon } from '../../../Components/SvgIcon/SvgIcon'
import useGetData from '../../../hooks/useGetData';
import { userInformation } from '../../../hooks/user/user.types';

function SideBarBottom() {


    const { data: myInfo, isSuccess } = useGetData<userInformation>(
        ["getMyUserInfo"],
        "users/user-information"
    );







    return (
        <>
            <div className='fixed flex md:hidden py-2 px-3  w-full left-0 right-0 bottom-0 bg-white dark:bg-black border-y dark:border-gray-300/20 border-gray-300 z-30'>
                <ul className='flex w-full justify-around items-center'>
                    <li className='p-3 rounded-md hover:bg-[#00376b1a] dark:hover:bg-[#e0f1ff21] transition-all duration-300 group'>
                        <Link className='text-base/5 flex items-center justify-center xl:justify-start gap-3 font-bold text-black dark:text-white' to='/tickets'>
                            <div className='w-6 h-6 group-hover:scale-110 transition-all duration-300'>
                                {ticketIcon}
                            </div>
                            <span className='hidden xl:block'>Tickets</span>
                        </Link>
                    </li>
                    <li className='p-3 rounded-md hover:bg-[#00376b1a] dark:hover:bg-[#e0f1ff21] transition-all duration-300 group'>
                        <Link className='text-base/5 flex items-center justify-center xl:justify-start gap-3 font-bold text-black dark:text-white' to='/login-info'>
                            <div className='w-6 h-6 group-hover:scale-110 transition-all duration-300'>
                                {exploreOutline}
                            </div>
                            <span className='hidden xl:block'>Explore</span>
                        </Link>
                    </li>
                    <li className='p-3 rounded-md hover:bg-[#00376b1a] dark:hover:bg-[#e0f1ff21] transition-all duration-300 group'>
                        <Link className='text-base/5 flex items-center justify-center xl:justify-start gap-3 font-bold text-black dark:text-white' to='/'>
                            <div className='w-6 h-6 group-hover:scale-110 transition-all duration-300'>
                                {homeFill}
                            </div>
                            <span className='hidden xl:block'>Home</span>

                        </Link>
                    </li>
                    <li className='p-3 rounded-md hover:bg-[#00376b1a] dark:hover:bg-[#e0f1ff21] transition-all duration-300 group'>
                        <Link className='text-base/5 flex items-center justify-center xl:justify-start gap-3 font-bold text-black dark:text-white' to='/direct'>
                            <div className='w-6 h-6 group-hover:scale-110 transition-all duration-300'>
                                {messageOutline}
                            </div>
                            <span className='hidden xl:block'>Message</span>
                        </Link>
                    </li>
                    <li className='p-3 rounded-md hover:bg-[#00376b1a] dark:hover:bg-[#e0f1ff21] transition-all duration-300 group'>
                        {isSuccess && (
                            <Link className='text-base/5 flex items-center justify-center xl:justify-start gap-3 font-bold text-black dark:text-white' to={`/profile/${myInfo?._id}`}>
                                <div className='w-6 h-6 group-hover:scale-110 transition-all duration-300'>
                                    <img loading='lazy' className='w-full h-full rounded-full object-cover' src={`${import.meta.env.VITE_API_BASE_URL}/${myInfo?.profilePicture.path}`} alt="profile" />
                                </div>
                                <span className='hidden xl:block'>Profile</span>
                            </Link>
                        )}
                    </li>
                </ul>
            </div>

          

        </>
    )
}

export default SideBarBottom
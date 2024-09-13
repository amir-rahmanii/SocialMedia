import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { exploreOutline, homeFill, messageOutline, searchIcon } from '../../Components/SvgIcon/SvgIcon'
import { AuthContext } from '../../Context/AuthContext';
import ShowSearchInput from '../../Components/ShowSearchInput/ShowSearchInput';
import toast from 'react-hot-toast';
import { useGetMyUsersInfo } from '../../hooks/user/useUser';

function SideBarBottom() {
    const authContext = useContext(AuthContext);
    const [isShowSearch, setIsShowSearch] = useState(false);

    const { data: myInfo, isSuccess : isSuccessmyinfo, isError : isErrorMyInfo } = useGetMyUsersInfo();
    useEffect(() => {
        if (isSuccessmyinfo) {
            authContext?.setUser(myInfo);
        } else if (isErrorMyInfo) {
            toast.error("please try again later 😩")
        }
    }, [isSuccessmyinfo, isErrorMyInfo]);


  return (
    <>
    <div className='fixed flex md:hidden py-2 px-3  w-full left-0 right-0 bottom-0 bg-white dark:bg-black border-y dark:border-gray-300/20 border-gray-300 z-30'>
        <ul className='flex w-full justify-around items-center'>
                    <li onClick={() => setIsShowSearch(true)} className='p-3 rounded-md hover:bg-[#00376b1a] dark:hover:bg-[#e0f1ff21] transition-all duration-300 group'>
                        <div className='text-base/5 flex items-center justify-center xl:justify-start gap-3 font-bold text-black dark:text-white'>
                            <div className='w-6 h-6 group-hover:scale-110 transition-all duration-300'>
                                {searchIcon}
                            </div>
                            <span className='hidden xl:block'>Search</span>
                        </div>
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
                        <Link className='text-base/5 flex items-center justify-center xl:justify-start gap-3 font-bold text-black dark:text-white' to={`/profile/${authContext?.user?._id}`}>
                            <div className='w-6 h-6 group-hover:scale-110 transition-all duration-300'>
                                <img loading='lazy' className='w-full h-full rounded-full object-cover' src={`http://localhost:4002/images/profiles/${myInfo?.profilePicture.filename}`} alt="profile" />
                            </div>
                            <span className='hidden xl:block'>Profile</span>
                        </Link>
                    </li>
                </ul>
    </div>

    
    <ShowSearchInput isShowSearch={isShowSearch} setIsShowSearch={setIsShowSearch} />
    </>
  )
}

export default SideBarBottom
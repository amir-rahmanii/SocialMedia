import React from 'react'
import { messageOutline, searchIcon } from '../../../Components/SvgIcon/SvgIcon'
import useGetData from '../../../hooks/useGetData';
import { userInformation } from '../../../hooks/user/user.types';



function Header() {

    const { data: myInfo, isSuccess: isSuccessMyInfo } = useGetData<userInformation>(
        ["getMyUserInfo"],
        "users/user-information"
    );

    return (
        <div className='font-sans fixed top-0 right-0 w-[calc(100%-290px)] left-[290px] px-11 py-4 flex items-center bg-admin-navy'>
            <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <div className='text-admin-High w-5 h-5'>
                        {searchIcon}
                    </div>
                    <input className='bg-transparent text-white outline-none' placeholder='type to search...' type="text" />
                </div>

                {/* profile */}
                <div className='flex items-center gap-5'>
                    <div className='bg-[#313D4A] relative flex justify-center items-center w-[34px] h-[34px] rounded-full'>
                        <div className='w-5 h-5 text-white'>
                            {messageOutline}
                        </div>
                        <div className='absolute top-0 right-0'>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error-red opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-error-red"></span>
                            </span>
                        </div>
                    </div>

                    {isSuccessMyInfo && (
                        <div className='flex items-center gap-3'>
                            <div className='flex flex-col'>
                                <p className='text-white font-bold text-sm'>{myInfo?.username}</p>
                                <p className='text-admin-low font-light text-xs'>Frontend developer</p>
                            </div>
                            <img loading='lazy' className='w-12 h-12 rounded-full object-cover' src={`http://localhost:4002/images/profiles/${myInfo?.profilePicture.filename}`} alt="profile" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Header
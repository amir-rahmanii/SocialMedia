import React, { useState } from 'react'
import { messageOutline, searchIcon } from '../../../Components/SvgIcon/SvgIcon'
import useGetData from '../../../hooks/useGetData';
import { userInformation } from '../../../hooks/user/user.types';
import { SideBarLeftProps } from '../SideBarLeft/SideBarLeft';


function Header({ setShowSidebarLeftMobile , showSidebarLeftMobile } : SideBarLeftProps) {

    const { data: myInfo, isSuccess: isSuccessMyInfo } = useGetData<userInformation>(
        ["getMyUserInfo"],
        "users/user-information"
    );



    return (
        <>
            <div className='font-sans z-40 fixed top-0 right-0 w-full md:w-[calc(100%-100px)]  lg:w-[calc(100%-200px)] xl:w-[calc(100%-290px)] left-0 md:left-[100px] lg:left-[200px] xl:left-[290px] px-4 md:px-11 py-2 md:py-4 flex items-center bg-admin-navy'>
                <div className='flex w-full items-center justify-between'>
                    <p className='hidden md:block'>Welcome to the Dashboard ❤️</p>
                    <button onClick={() => setShowSidebarLeftMobile((prev : boolean) => !prev)} className='bg-[#313D4A] block md:hidden p-5 rounded'>

                    </button>

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

            {/*black side for menu mobile */}
            <div onClick={() => setShowSidebarLeftMobile(false)} className={`bg-black/40 md:hidden fixed inset-0 w-full h-full z-[41] transition-all ${showSidebarLeftMobile ? 'visible opacity-100' : 'invisible opacity-0'}`}></div>

        </>
    )
}

export default Header
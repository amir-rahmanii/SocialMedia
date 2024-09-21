import React from 'react'
import { messageOutline, searchIcon } from '../../../Components/SvgIcon/SvgIcon'
import useGetData from '../../../hooks/useGetData';
import { userInformation } from '../../../hooks/user/user.types';

function Header() {

    const { data: myInfo, isSuccess } = useGetData<userInformation>(
        ["getMyUserInfo"],
        "users/user-information"
    );

    return (
        <div className='absolute font-medium top-0 px-11 py-4 flex items-center right-0 left-[290px] h-20 bg-admin-navy'>
            <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <div className='text-admin-High w-5 h-5'>
                        {searchIcon}
                    </div>
                    <input className='bg-transparent text-white outline-none' placeholder='type to search...' type="text" />
                </div>

                {/* profile */}
                <div className='flex items-center'>
                    <div className='bg-[#313D4A] flex justify-center items-center w-[34px] h-[34px] rounded-full'>
                        <div className='w-5 h-5 text-white'>
                            {messageOutline}
                        </div>
                    </div>


                    <div className='flex items-center gap-3'>
                        <div className='flex flex-col'>
                            <p className='text-white font-bold text-sm'>{myInfo?.username}</p>
                            <p className='text-admin-low font-light text-xs'>Frontend developer</p>
                        </div>
                        {isSuccess && (
                            <img loading='lazy' className='w-12 h-12 rounded-full object-cover' src={`http://localhost:4002/images/profiles/${myInfo?.profilePicture.filename}`} alt="profile" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header